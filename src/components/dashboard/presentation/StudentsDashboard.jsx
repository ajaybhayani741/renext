import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Select } from "antd";
import ChartCard from '../shared/ChartCard';
import StyledTooltip from '../shared/StyledTooltip';
import DataModal from '../shared/DataModal';
import students from '../container/students.container';
import useTranslations from '../../../hooks/useTranslations';
import { studentCharts } from '../dashboard.description';

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
  } = students();

  const key = 'dash_TotalNumberOfStudents';
  const currentSeries = seriesData?.[key];
  const chartConfig = studentCharts?.[key];

  const [binSize, setBinSize] = useState(3);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

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
    { title: "Hostel Name", dataIndex: "hostelName", key: "hostelName", width: 250 },
    { title: "District", dataIndex: "district", key: "district" },
    { title: "Students", dataIndex: "students", key: "students" },
    { title: "Boys", dataIndex: "boys", key: "boys" },
    { title: "Girls", dataIndex: "girls", key: "girls" },
  ];

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex-1 min-w-[200px] shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Students Enrolled</div>
          <div className="text-3xl font-bold text-slate-800">{totalEnrolled}</div>
        </div>
      </div>

      <ChartCard title={t(key) || "Student Enrollment Distribution"}>
        <div className="flex items-center justify-end px-2 mb-2 text-xs text-muted-foreground font-medium">
          <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded border border-slate-200">
            <div className="flex items-center gap-1">
              <span>Min:</span>
              <input 
                type="number" 
                value={customMin}
                onChange={e => setCustomMin(e.target.value)}
                className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                placeholder="Auto"
              />
            </div>
            <div className="flex items-center gap-1">
              <span>Max:</span>
              <input 
                type="number" 
                value={customMax}
                onChange={e => setCustomMax(e.target.value)}
                className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
                placeholder="Auto"
              />
            </div>
            <div className="flex items-center gap-1 border-l border-slate-300 pl-3">
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
      </ChartCard>

      <DataModal 
        open={selectedColumn?.selected} 
        onClose={handleCloseModal} 
        title={`${t(key)} - Details`}
        columns={columns} 
        data={hostelsData?.list || []} 
      />
    </div>
  );
};

export default StudentsDashboard;
