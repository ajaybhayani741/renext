import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

import ChartCard from './ChartCard';
import CustomLegend from './CustomLegend';
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
  categoryLabels,
  legendMapping,
  showFooterTitle = true,
  forceYesNoKeys = false,
  barSize = 80,
  titlePosition = 'footer',
  barColors,
  showLegend = true,
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
      const dataPoint = {
        category: categoryLabels?.[index] || t(category) || category,
        originalCategory: category,
      };
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
        if (forceYesNoKeys) {
          keyName = sIndex === 0 ? t('btn_Yes') : t('btn_No');
        }
        
        dataPoint[keyName] = getSeriesDataValue(series.data[index]);
        // Store the original object for click handlers
        dataPoint[`_raw_${keyName}`] = series.data[index];
      });
      return dataPoint;
    });
  }, [seriesData, chartData, categoryLabels, forceYesNoKeys, t]);

  const colors = ["#8B5CF6", "#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4"];
  const gradientIdBase = `compare-${String(name || title || 'chart').replace(/[^a-zA-Z0-9]/g, '-')}`;

  const getBarColor = (dataKey, index) => {
    const normalized = String(dataKey || '').toLowerCase();
    if (normalized === String(t('btn_Yes')).toLowerCase() || normalized === 'yes') {
      return `url(#${gradientIdBase}-yes)`;
    }
    if (normalized === String(t('btn_No')).toLowerCase() || normalized === 'no') {
      return `url(#${gradientIdBase}-no)`;
    }
    if (barColors?.[index]) {
      return barColors[index];
    }
    return colors[index % colors.length];
  };
  
  // Extract all unique data keys that are not category and not _raw_
  const dataKeys = transformedData.length > 0 
    ? Array.from(new Set(transformedData.flatMap(item => Object.keys(item)))).filter(k => k !== 'category' && k !== 'originalCategory' && !k.startsWith('_raw_'))
    : [];
  const hasChartData = dataKeys.some(dataKey =>
    transformedData.some(item => Number(item[dataKey] || 0) > 0),
  );

  return (
    <ChartCard title={titlePosition === 'header' ? title : ''}>
      <div style={{ width: '100%', height: 380, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <defs>
              <linearGradient id={`${gradientIdBase}-yes`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#16A34A" stopOpacity={0.68} />
              </linearGradient>
              <linearGradient id={`${gradientIdBase}-no`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#F87171" stopOpacity={0.68} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
            <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} />
            <YAxis tick={{ fontSize: 12, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} allowDecimals={false} />
            <Tooltip content={<StyledTooltip />} />
            {showLegend ? <Legend wrapperStyle={{ paddingTop: "20px" }} /> : null}
            {dataKeys.map((dataKey, i) => {
              return (
                <Bar 
                  key={dataKey || `bar-${i}`} 
                  dataKey={dataKey} 
                  name={t(dataKey) || dataKey} 
                  fill={getBarColor(dataKey, i)} 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                  barSize={barSize}
                  maxBarSize={barSize}
                  onClick={(data, index) => {
                    let clickedCategory = null;
                    if (chartData && (chartData.categories || chartData.category)) {
                      clickedCategory = data.originalCategory || (chartData.categories || chartData.category)[index];
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
      {hasChartData && legendMapping ? <CustomLegend mapping={legendMapping} /> : null}
      {showFooterTitle && titlePosition === 'footer' && title ? <h3 className="dashboard-chart-footer-title">{title}</h3> : null}
    </ChartCard>
  );
};

export default ModernCompareChart;
