import { Select } from 'antd';
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

const StudentsDashboard = () => {
  const { t } = useTranslations();
  const {
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    jobModel,
    handleCloseJobModel,
    handleHostelClick,
    handleDownloadExcel,
    reportLoader,
    jobType,
  } = students();

  const key = 'dash_TotalNumberOfStudents';
  const currentSeries = seriesData?.[key];
  const chartConfig = studentCharts?.[key];

  const [binSize, setBinSize] = useState(5);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");
  const [districtFilter, setDistrictFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');
  const [genderFilter, setGenderFilter] = useState('All');

  const distributionData = useMemo(() => {
    if (!currentSeries || !currentSeries.series || currentSeries.series.length === 0 || !binSize) return [];
    
    const valueMap = new Map();
    for (const [x, y] of currentSeries.series) {
      valueMap.set(x, (valueMap.get(x) || 0) + y);
    }
    
    const dataMin = Math.min(...currentSeries.series.map(d => d[0]));
    const dataMax = Math.max(...currentSeries.series.map(d => d[0]));
    
    const min = customMin !== "" ? Number(customMin) : dataMin;
    const max = customMax !== "" ? Number(customMax) : dataMax;
    
    if (min > max) return [];
    
    const result = [];
    for (let start = min; start <= max; start += binSize) {
      const end = Math.min(start + binSize - 1, max);
      
      let sum = 0;
      for (let v = start; v <= end; v++) {
        if (valueMap.has(v)) sum += valueMap.get(v);
      }
      
      // Auto whitespace removal (only include bins with data)
      if (sum > 0) {
        result.push({
          range: start === end ? `${start}` : `${start}-${end}`,
          hostels: sum,
          startVal: start,
          endVal: end
        });
      }
    }
    return result;
  }, [currentSeries, binSize, customMin, customMax]);

  const totalEnrolled = currentSeries?.total || 0;

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
              <Option value="All">All Students</Option>
              <Option value="Boys">Boys</Option>
              <Option value="Girls">Girls</Option>
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
        
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
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
          </BarChart>
        </ResponsiveContainer>
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
