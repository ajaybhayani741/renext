import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartCard from './ChartCard';
import StyledTooltip from './StyledTooltip';
import useTranslations from '../../../hooks/useTranslations';

const BLACK_AXIS = { stroke: "#000", strokeWidth: 1 };
const BLACK_TICK = { stroke: "#000" };

const ModernFrequencyChart = ({
  title,
  xAxisTitle,
  yAxisTitle,
  seriesData,
  handleChartClick,
  name,
}) => {
  const { t } = useTranslations();
  const [binSize, setBinSize] = useState(3);
  const [customMin, setCustomMin] = useState("");
  const [customMax, setCustomMax] = useState("");

  const distributionData = useMemo(() => {
    // Attempt to extract series either from seriesData.series or seriesData[0].data or raw array
    let seriesArray = null;
    if (seriesData && Array.isArray(seriesData.series)) {
      seriesArray = seriesData.series;
    } else if (Array.isArray(seriesData)) {
      if (seriesData[0] && Array.isArray(seriesData[0].data)) {
        seriesArray = seriesData[0].data;
      } else {
        seriesArray = seriesData;
      }
    }

    if (!seriesArray || seriesArray.length === 0 || !binSize) return [];
    
    // Some backend returns object with y value or just [x, y] arrays
    const isObject = seriesArray[0] && typeof seriesArray[0] === 'object' && !Array.isArray(seriesArray[0]);

    const valueMap = new Map();
    seriesArray.forEach(item => {
      let x = 0;
      let y = 0;
      if (isObject) {
        // If it's like { name: '10', y: 5 }
        x = Number(item.name || item.x || 0);
        y = item.y || item.value || 0;
      } else if (Array.isArray(item)) {
        x = Number(item[0]);
        y = Number(item[1] || 0);
      }
      if (!isNaN(x)) {
        valueMap.set(x, (valueMap.get(x) || 0) + y);
      }
    });

    if (valueMap.size === 0) return [];
    
    const xValues = Array.from(valueMap.keys());
    const dataMin = Math.min(...xValues);
    const dataMax = Math.max(...xValues);
    
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
      if (sum >= 0) { // Render even 0 heights to show bins
        result.push({
          range: start === end ? `${start}` : `${start}-${end}`,
          hostels: sum,
          startVal: start,
          endVal: end
        });
      }
    }
    return result;
  }, [seriesData, binSize, customMin, customMax]);

  return (
    <ChartCard title={title}>
      <div className="flex items-center justify-end px-2 mb-2 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1 rounded border border-slate-200">
          <div className="flex items-center gap-1">
            <span>Min:</span>
            <input 
              type="number" value={customMin} onChange={e => setCustomMin(e.target.value)}
              className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800" placeholder="Auto"
            />
          </div>
          <div className="flex items-center gap-1">
            <span>Max:</span>
            <input 
              type="number" value={customMax} onChange={e => setCustomMax(e.target.value)}
              className="w-16 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800" placeholder="Auto"
            />
          </div>
          <div className="flex items-center gap-1 border-l border-slate-300 pl-3">
            <span>Bin Size:</span>
            <input 
              type="number" min={1} max={50} value={binSize}
              onChange={e => setBinSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 px-1 text-center border-b border-slate-300 bg-transparent focus:outline-none focus:border-blue-500 font-bold text-slate-800"
            />
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.65} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} angle={-45} textAnchor="end" height={60} label={{ value: t(xAxisTitle) || "Range", position: "insideBottom", offset: -25, fontSize: 13, fill: "#333", fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 12, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} allowDecimals={false} label={{ value: t(yAxisTitle) || "Number of Hostels", angle: -90, position: "insideLeft", offset: -5, fontSize: 12, fill: "#333" }} />
            <Tooltip content={<StyledTooltip />} />
            <Bar dataKey="hostels" name="Hostels" fill={`url(#grad-${name})`} radius={[4, 4, 0, 0]} cursor="pointer"
              maxBarSize={80}
              activeBar={{ stroke: "#8B5CF6", strokeWidth: 2, fillOpacity: 1 }}
              onClick={data => {
                if (handleChartClick) {
                  handleChartClick({ 
                    e: { point: { category: data.range, y: data.hostels } }, 
                    name, xAxisTitle, startEnd: { start: data.startVal, end: data.endVal }
                  });
                }
              }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ModernFrequencyChart;
