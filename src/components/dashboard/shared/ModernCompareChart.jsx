import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartCard from './ChartCard';
import StyledTooltip from './StyledTooltip';
import useTranslations from '../../../hooks/useTranslations';

const BLACK_AXIS = { stroke: "#000", strokeWidth: 1 };
const BLACK_TICK = { stroke: "#000" };

const ModernCompareChart = ({
  chartData,
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

  const getSeriesDataValue = dataItem => {
    if (typeof dataItem === 'number' || typeof dataItem === 'string') return Number(dataItem) || 0;
    if (dataItem && typeof dataItem === 'object') {
      return Number(dataItem.y || dataItem.value || 0);
    }
    return 0;
  };

  const transformedData = useMemo(() => {
    let categories = [];
    if (chartData && (chartData.category || chartData.categories)) {
      categories = chartData.category || chartData.categories;
    } else if (seriesData && seriesData[0] && seriesData[0].data) {
      categories = seriesData[0].data.map((_, i) => `Cat ${i+1}`);
    }

    if (!seriesData || !categories || categories.length === 0) return [];
    
    return categories.map((category, index) => {
      const dataPoint = { category: t(category) || category };
      seriesData.forEach((series, sIndex) => {
        // If series.name is empty (like in Hostel Infra Rooms), use the label from the data object if available, otherwise fallback
        let keyName = getSeriesNameString(series.name);
        if (!keyName || keyName === "Unknown") {
          const dataItem = series.data[index];
          if (dataItem && typeof dataItem === 'object' && dataItem.custom?.label) {
            keyName = dataItem.custom.label;
          } else {
            keyName = `Series ${sIndex + 1}`;
          }
        }
        
        dataPoint[keyName] = getSeriesDataValue(series.data[index]);
        // Store the original object for click handlers
        dataPoint[`_raw_${keyName}`] = series.data[index];
      });
      return dataPoint;
    });
  }, [seriesData, chartData, t]);

  if (!seriesData || seriesData.length === 0) return null;

  const colors = ["#8B5CF6", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];
  
  // Extract all unique data keys that are not category and not _raw_
  const dataKeys = transformedData.length > 0 
    ? Object.keys(transformedData[0]).filter(k => k !== 'category' && !k.startsWith('_raw_'))
    : [];

  return (
    <ChartCard title={title}>
      <div style={{ width: '100%', height: 380 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} />
            <YAxis tick={{ fontSize: 12, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} allowDecimals={false} />
            <Tooltip content={<StyledTooltip />} />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            {dataKeys.map((dataKey, i) => {
              return (
                <Bar 
                  key={dataKey || `bar-${i}`} 
                  dataKey={dataKey} 
                  name={t(dataKey) || dataKey} 
                  fill={colors[i % colors.length]} 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  maxBarSize={60}
                  onClick={(data, index) => {
                    let clickedCategory = null;
                    if (chartData && (chartData.categories || chartData.category)) {
                      clickedCategory = (chartData.categories || chartData.category)[index];
                    }
                    if (handleChartClick) {
                      const rawData = data[`_raw_${dataKey}`];
                      handleChartClick({ 
                        e: { point: { category: clickedCategory, series: { name: dataKey }, ...rawData } }, 
                        name 
                      });
                    }
                  }}
                />
              )
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ModernCompareChart;
