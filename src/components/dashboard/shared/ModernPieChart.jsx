import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartCard from './ChartCard';
import StyledTooltip from './StyledTooltip';
import useTranslations from '../../../hooks/useTranslations';

const ModernPieChart = ({
  handleChartClick,
  seriesData,
  title,
  name,
}) => {
  const { t } = useTranslations();
  
  const getSeriesNameString = sName => {
    if (typeof sName === 'string') return sName;
    if (sName && typeof sName === 'object') {
      return sName.custom?.label || sName.name || sName.label || sName.y || "Unknown";
    }
    return String(sName || "Unknown");
  };

  const data = useMemo(() => {
    if (!seriesData || seriesData.length === 0) return [];
    
    let rawData = [];
    if (Array.isArray(seriesData)) {
      if (seriesData[0] && Array.isArray(seriesData[0].data)) {
        rawData = seriesData[0].data;
      } else {
        rawData = seriesData;
      }
    } else if (seriesData && Array.isArray(seriesData.data)) {
      rawData = seriesData.data;
    }
    
    return rawData.map(item => {
      const nameStr = getSeriesNameString(item.name || item.label);
      return {
        name: t(nameStr) || nameStr,
        value: item.y || item.value || 0,
        originalName: item.name || item.label
      };
    }).filter(item => item.value > 0);
  }, [seriesData, t]);

  if (!data || data.length === 0) return null;

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

  return (
    <ChartCard title={title}>
      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              cursor="pointer"
              onClick={dataPoint => {
                if (handleChartClick) {
                  handleChartClick({ 
                    e: { point: { name: dataPoint.originalName, y: dataPoint.value } }, 
                    name 
                  });
                }
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<StyledTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ModernPieChart;
