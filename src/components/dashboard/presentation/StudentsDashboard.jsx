import { message, Select } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";

import useTranslations from '../../../hooks/useTranslations';
import ANTDButton from '../../../shared/antd/ANTDButton';
import ANTDModal from '../../../shared/antd/ANTDModal';
import ViewJob from '../../jobs/presentation/viewJobs';
import students from '../container/students.container';
import { studentCharts } from '../dashboard.description';
import ChartCard from '../shared/ChartCard';
import DataModal from '../shared/DataModal';
import ModuleFilters from '../shared/ModuleFilters';
import StatsCard from '../shared/StatsCard';
import StyledTooltip from '../shared/StyledTooltip';

const { Option } = Select;
const BLACK_AXIS = { stroke: "#000", strokeWidth: 1 };
const BLACK_TICK = { stroke: "#000" };
const MIN_RANGE_SELECTION = 1;
const MAX_RANGE_SELECTION = 100;

const isInvalidRangeSelection = (start, end) =>
  start < MIN_RANGE_SELECTION || end > start + MAX_RANGE_SELECTION - 1;

const StudentsDashboard = () => {
  const { t } = useTranslations();
  const [binSize, setBinSize] = useState(5);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [brushRange, setBrushRange] = useState({ startIndex: 0, endIndex: 0 });
  const brushInitKeyRef = useRef("");
  const lastApiRangeRef = useRef("");
  const rangeChangeTimerRef = useRef(null);
  const warningShownRef = useRef(false);
  const lastValidBrushRangeRef = useRef({ startIndex: 0, endIndex: 0 });
  const [districtFilter, setDistrictFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('ALL');
  const {
    seriesData,
    selectedColumn,
    onRangeChange,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    jobModel,
    handleCloseJobModel,
    handleHostelClick,
    handleDownloadExcel,
    reportLoader,
    jobType,
  } = students({ hostelFilter, genderFilter });

  const key = 'dash_TotalNumberOfStudents';
  const currentSeries = seriesData?.[key];
  const chartConfig = studentCharts?.[key];

  const distributionData = useMemo(() => {
    if (!binSize) return [];
    
    const valueMap = new Map();
    for (const [x, y] of currentSeries?.series || []) {
      valueMap.set(x, (valueMap.get(x) || 0) + y);
    }
    
    const dataMax = currentSeries?.series?.length
      ? Math.max(...currentSeries.series.map(d => d[0]))
      : MAX_RANGE_SELECTION;
    const highestCount = Number(currentSeries?.highestCount);
    const normalizedHighestCount =
      !isNaN(highestCount) && highestCount > MAX_RANGE_SELECTION
        ? highestCount
        : MAX_RANGE_SELECTION;
    
    const min = customMin !== "" ? Number(customMin) : MIN_RANGE_SELECTION;
    const max =
      customMax !== ""
        ? Number(customMax)
        : Math.max(normalizedHighestCount, dataMax);
    
    if (min > max) return [];
    
    const result = [];
    for (let start = min; start <= max;) {
      const rangeEnd = start <= MAX_RANGE_SELECTION && start + binSize - 1 > MAX_RANGE_SELECTION
        ? MAX_RANGE_SELECTION
        : start + binSize - 1;
      const end = Math.min(rangeEnd, max);
      
      let sum = 0;
      for (let v = start; v <= end; v++) {
        if (valueMap.has(v)) sum += valueMap.get(v);
      }
      
      result.push({
        range: start === end ? `${start}` : `${start}-${end}`,
        hostels: sum,
        startVal: start,
        endVal: end
      });
      start = end + 1;
    }
    return result;
  }, [currentSeries, binSize, customMin, customMax]);

  const totalEnrolled = currentSeries?.total || 0;
  const defaultBrushEndIndex = Math.max(
    distributionData.findIndex(item => item.endVal > 100) - 1,
    -1,
  );
  const brushEndIndex =
    defaultBrushEndIndex >= 0
      ? defaultBrushEndIndex
      : Math.max(distributionData.length - 1, 0);
  const highestCountLabel = Number(currentSeries?.highestCount);
  const rangeLabelStart = MIN_RANGE_SELECTION;
  const selectedBrushEnd =
    !isNaN(highestCountLabel) && highestCountLabel > MAX_RANGE_SELECTION
      ? highestCountLabel
      : MAX_RANGE_SELECTION;

  useEffect(() => {
    const brushInitKey = `${key}:${binSize}:${customMin}:${customMax}:${districtFilter}:${hostelFilter}:${genderFilter}`;

    if (!distributionData.length || brushInitKeyRef.current === brushInitKey) {
      return;
    }

    brushInitKeyRef.current = brushInitKey;
    const initialRange = { startIndex: 0, endIndex: brushEndIndex };
    lastValidBrushRangeRef.current = initialRange;
    lastApiRangeRef.current = "";
    warningShownRef.current = false;
    setBrushRange(initialRange);
  }, [
    binSize,
    brushEndIndex,
    customMax,
    customMin,
    distributionData.length,
    districtFilter,
    genderFilter,
    hostelFilter,
    key,
  ]);

  useEffect(() => {
    return () => {
      if (rangeChangeTimerRef.current) {
        clearTimeout(rangeChangeTimerRef.current);
      }
    };
  }, []);

  const handleBrushChange = range => {
    if (range?.startIndex < 0 || range?.endIndex < 0) return;

    const selectedStart = distributionData?.[range.startIndex]?.startVal;
    const selectedEnd = distributionData?.[range.endIndex]?.endVal;

    if (
      typeof selectedStart !== 'undefined' &&
      typeof selectedEnd !== 'undefined' &&
      isInvalidRangeSelection(selectedStart, selectedEnd)
    ) {
      if (!warningShownRef.current) {
        message.warning(`Please select a range of ${MAX_RANGE_SELECTION} or less.`);
        warningShownRef.current = true;
      }
      setBrushRange({ ...lastValidBrushRangeRef.current });
      return;
    }

    warningShownRef.current = false;
    lastValidBrushRangeRef.current = range;
    setBrushRange(range);

    if (
      typeof selectedStart !== 'undefined' &&
      typeof selectedEnd !== 'undefined'
    ) {
      const apiRangeKey = `${key}:${selectedStart}-${selectedEnd}`;

      if (lastApiRangeRef.current === apiRangeKey) return;

      lastApiRangeRef.current = apiRangeKey;

      if (rangeChangeTimerRef.current) {
        clearTimeout(rangeChangeTimerRef.current);
      }

      rangeChangeTimerRef.current = setTimeout(() => {
        onRangeChange({
          start: selectedStart,
          end: selectedEnd,
          chartType: [key],
        });
      }, 350);
    }
  };

  const columns = [
    {
      title: "",
      key: "index",
      width: 48,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Hostel",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Number of Students",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Action",
      key: "action",
      render: (_, rowData) => (
        <ANTDButton type="primary" size="small" onClick={() => handleHostelClick(rowData)}>
          View Job
        </ANTDButton>
      ),
    },
  ];

  return (
    <div className="dashboard-module-surface dashboard-students-surface">
      <ModuleFilters
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        hostelFilter={hostelFilter}
        setHostelFilter={setHostelFilter}
        leadingContent={<StatsCard label="Total Students Enrolled" value={totalEnrolled} />}
        extraFilters={(
          <div className="dashboard-filter-card">
            <div className="text-sm font-medium text-slate-500 mb-2">Filter by Gender</div>
            <Select
              value={genderFilter}
              onChange={setGenderFilter}
              style={{ width: "100%" }}
            >
              <Option value="ALL">All Students</Option>
              <Option value="BOYS">Boys</Option>
              <Option value="GIRLS">Girls</Option>
            </Select>
          </div>
        )}
      />

      <ChartCard title="Student Enrollment Distribution">
        <div className="dashboard-chart-controls">
          <div className="dashboard-range-control">
            <div className="dashboard-range-field">
              <span>Min:</span>
              <input 
                type="number" 
                value={customMin}
                onChange={e => setCustomMin(e.target.value)}
                className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                placeholder="Auto"
              />
            </div>
            <div className="dashboard-range-field">
              <span>Max:</span>
              <input 
                type="number" 
                value={customMax}
                onChange={e => setCustomMax(e.target.value)}
                className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                placeholder="Auto"
              />
            </div>
            <div className="dashboard-range-field dashboard-range-field-bordered">
              <span>Bin Size:</span>
              <input 
                type="number" min={1} max={50} 
                value={binSize}
                onChange={e => setBinSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
              />
            </div>
          </div>
        </div>
        
        <div style={{ width: '100%', height: 430, position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 20, right: 78, left: 20, bottom: 88 }}>
              <defs>
                <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.65} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} angle={-45} textAnchor="end" height={60} label={{ value: t(chartConfig?.xAxisText) || "Range", position: "insideBottom", offset: -25, fontSize: 13, fill: "#333", fontWeight: 600 }} />
              <YAxis tick={{ fontSize: 12, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} label={{ value: t(chartConfig?.yAxisText) || "Number of Hostels", angle: -90, position: "insideLeft", offset: -5, fontSize: 12, fill: "#333" }} />
              <Tooltip content={<StyledTooltip />} />
              <Bar dataKey="hostels" name="Hostels" fill="url(#studGrad)" radius={[4, 4, 0, 0]} cursor="pointer"
                maxBarSize={98}
                activeBar={{ stroke: "#8B5CF6", strokeWidth: 2, fillOpacity: 1 }}
                onClick={data => {
                  handleChartClick({
                    e: { point: { category: data.range, y: data.hostels } },
                    name: key,
                    xAxisTitle: chartConfig?.xAxisText,
                    startEnd: { start: data.startVal, end: data.endVal }
                  });
                }} />
              <Brush
                dataKey="range"
                height={30}
                y={382}
                stroke="#8B5CF6"
                fill="#eef2ff"
                travellerWidth={10}
                startIndex={brushRange.startIndex}
                endIndex={brushRange.endIndex}
                alwaysShowText
                onChange={handleBrushChange}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="dashboard-brush-range-labels">
            <span>{rangeLabelStart}</span>
            <span>{selectedBrushEnd}</span>
          </div>
        </div>
        <h3 className="dashboard-chart-footer-title">
          Total number of students: {totalEnrolled}
        </h3>
      </ChartCard>

      <DataModal 
        open={selectedColumn?.selected} 
        onClose={handleCloseModal} 
        title={`${t(key)} - Details`}
        columns={columns} 
        data={hostelsData?.hostels || []} 
        onDownloadExcel={handleDownloadExcel}
        excelLoading={reportLoader}
      />
      {jobModel?.open && (
        <ANTDModal
          title={t('txt_Details')}
          centered
          open={jobModel?.open}
          onCancel={handleCloseJobModel}
          footer={false}
          width={1100}
        >
          <ViewJob
            data={jobModel?.data}
            jobType={jobType}
            loader={jobModel?.loader}
          />
        </ANTDModal>
      )}
    </div>
  );
};

export default StudentsDashboard;
