import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import ChartCard from './ChartCard';
import NoDataChartMessage from './NoDataChartMessage';
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
  total,
  defaultBinSize = 3,
  color = "#8B5CF6",
  colorEnd = "#A78BFA",
  activeColor,
  barSize = 80,
}) => {
  const { t } = useTranslations();
  const [binSize, setBinSize] = useState(defaultBinSize);
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
  const hasChartData = distributionData.some(item => Number(item.hostels || 0) > 0);

  return (
    <ChartCard title={title}>
      <div className="dashboard-frequency-meta">
        {typeof total !== 'undefined' ? <span>Total: {total}</span> : null}
        <div className="dashboard-range-control">
          <div className="dashboard-range-field">
            <span>Min:</span>
            <input 
              type="number" value={customMin} onChange={e => setCustomMin(e.target.value)}
              placeholder="Auto"
            />
          </div>
          <div className="dashboard-range-field">
            <span>Max:</span>
            <input 
              type="number" value={customMax} onChange={e => setCustomMax(e.target.value)}
              placeholder="Auto"
            />
          </div>
          <div className="dashboard-range-field dashboard-range-field-bordered">
            <span>Bin Size:</span>
            <input 
              type="number" min={1} max={50} value={binSize}
              onChange={e => setBinSize(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
        </div>
      </div>
      <div style={{ width: '100%', height: 380, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id={`grad-${name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={colorEnd} stopOpacity={0.65} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} angle={-45} textAnchor="end" height={60} label={{ value: t(xAxisTitle) || "Range", position: "insideBottom", offset: -25, fontSize: 13, fill: "#333", fontWeight: 600 }} />
            <YAxis tick={{ fontSize: 12, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} allowDecimals={false} label={{ value: t(yAxisTitle) || "Number of Hostels", angle: -90, position: "insideLeft", offset: -5, fontSize: 12, fill: "#333" }} />
            <Tooltip content={<StyledTooltip />} />
            <Bar dataKey="hostels" name="Hostels" fill={`url(#grad-${name})`} radius={[4, 4, 0, 0]} cursor="pointer"
              barSize={barSize}
              maxBarSize={barSize}
              activeBar={{ stroke: activeColor || color, strokeWidth: 2, fillOpacity: 1 }}
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
        {!hasChartData ? <NoDataChartMessage /> : null}
      </div>
    </ChartCard>
  );
};

export default ModernFrequencyChart;
