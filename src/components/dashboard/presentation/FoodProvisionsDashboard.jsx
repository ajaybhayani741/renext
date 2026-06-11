import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import DashboardWrapper from './DashboardWrapper';
import useTranslations from '../../../hooks/useTranslations';
import foodProvisions from '../container/foodProvisions.container';
import ChartCard from '../shared/ChartCard';
import CustomLegend from '../shared/CustomLegend';
import ModuleFilters from '../shared/ModuleFilters';
import NoDataChartMessage from '../shared/NoDataChartMessage';
import StyledTooltip from '../shared/StyledTooltip';

const BLACK_AXIS = { stroke: "#000", strokeWidth: 1 };
const BLACK_TICK = { stroke: "#000" };

const getFuelSliceLabel = name => {
  const normalizedName = String(name || '').toLowerCase();

  if (normalizedName.includes('non')) return 'Non-sufficient';
  if (normalizedName.includes('sufficient')) return 'Sufficient';
  if (normalizedName.includes('no') && normalizedName.includes('lpg')) return 'No LPG';

  return name;
};

const renderFuelLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  name,
  value,
}) => {
  if (!value) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#0f172a"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
      pointerEvents="none"
    >
      {getFuelSliceLabel(name)}
    </text>
  );
};

const FoodProvisionsDashboard = () => {
  const { t } = useTranslations();
  const [districtFilter, setDistrictFilter] = useState('All');
  const [hostelFilter, setHostelFilter] = useState('All');
  const {
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  } = foodProvisions({ hostelFilter });

  // "job_FoodProvisions"
  const foodKey = 'job_FoodProvisions';
  const foodSeries = seriesData?.[foodKey]?.seriesData || [];
  
  const barData = useMemo(() => {
    if (!foodSeries.length) return [];
    // Transform seriesData (which is an array of Highcharts series {name: 'Yes', data: [10, 20]})
    // into Recharts data [{ shortLabel: '1', yes: 10, no: 5 }, ...]
    const yesSeries = foodSeries.find(s => s.name === t('btn_Yes'))?.data || [];
    const noSeries = foodSeries.find(s => s.name === t('btn_No'))?.data || [];
    const categories = seriesData?.[foodKey]?.chartData?.category || [];
    
    return categories.map((cat, idx) => ({
      shortLabel: `${idx + 1}`,
      categoryName: cat,
      yes: yesSeries[idx] || 0,
      no: noSeries[idx] || 0,
    }));
  }, [foodSeries, seriesData, t]);

  const foodLegendMapping = useMemo(() => {
    const categories = seriesData?.[foodKey]?.chartData?.category || [];
    return categories.reduce((acc, cat, idx) => ({ ...acc, [`${idx + 1}`]: cat }), {});
  }, [seriesData]);

  // "job_Variation"
  const varKey = 'job_Variation';
  const varSeries = seriesData?.[varKey]?.seriesData || [];
  const varData = useMemo(() => {
    if (!varSeries.length) return [];
    const yesSeries = varSeries.find(s => s.name === t('btn_Yes'))?.data || [];
    const noSeries = varSeries.find(s => s.name === t('btn_No'))?.data || [];
    const categories = seriesData?.[varKey]?.chartData?.category || [];
    
    return categories.map((cat, idx) => ({
      shortLabel: `${idx + 1}`,
      categoryName: cat,
      yesCount: yesSeries[idx] || 0,
      noCount: noSeries[idx] || 0,
    }));
  }, [varSeries, seriesData, t]);

  const varLegendMapping = useMemo(() => {
    const categories = seriesData?.[varKey]?.chartData?.category || [];
    return categories.reduce((acc, cat, idx) => ({ ...acc, [`${idx + 1}`]: cat }), {});
  }, [seriesData]);

  // "job_NatureOfCookingFuel"
  const fuelKey = 'job_NatureOfCookingFuel';
  const level2 = (seriesData?.[fuelKey] || []).find(s => s.name === 'Level 2');
  const level3 = (seriesData?.[fuelKey] || []).find(s => s.name === 'Level 3');
  const fuelLevel2Data = useMemo(() => {
    return (level2?.data || []).map(item => ({
      name: item.name,
      value: item.y,
      color: item.color,
    }));
  }, [level2]);
  const fuelLevel3Data = useMemo(() => {
    return (level3?.data || []).map(item => ({
      name: item.name,
      value: item.y,
      color: item.color,
    }));
  }, [level3]);
  const hasFuelData = [...fuelLevel2Data, ...fuelLevel3Data].some(item => Number(item.value || 0) > 0);
  const hasFoodData = barData.some(item => Number(item.yes || 0) > 0 || Number(item.no || 0) > 0);
  const hasVariationData = varData.some(item => Number(item.yesCount || 0) > 0 || Number(item.noCount || 0) > 0);

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-food-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
        />
        <div className="dashboard-single-chart-grid">
          <ChartCard title={t(fuelKey)}>
            <div style={{ width: '100%', height: 400, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {hasFuelData ? (
                    <>
                      <Pie
                        data={fuelLevel2Data}
                        cx="50%"
                        cy="46%"
                        innerRadius={58}
                        outerRadius={104}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={renderFuelLabel}
                        onClick={data => handleChartClick({ e: { point: { name: data.name, y: data.value, type: 'Level 2' } }, name: fuelKey })}
                      >
                        {fuelLevel2Data.map((entry, index) => (
                          <Cell key={`fuel-level-2-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Pie
                        data={fuelLevel3Data}
                        cx="50%"
                        cy="46%"
                        innerRadius={106}
                        outerRadius={142}
                        dataKey="value"
                        nameKey="name"
                        label={renderFuelLabel}
                        labelLine={false}
                        onClick={data => handleChartClick({ e: { point: { name: data.name, y: data.value, type: 'Level 3' } }, name: fuelKey })}
                      >
                        {fuelLevel3Data.map((entry, index) => (
                          <Cell key={`fuel-level-3-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                        ))}
                      </Pie>
                    </>
                  ) : null}
                  <Tooltip content={<StyledTooltip />} formatter={(v, n) => [`${v} Hostels`, n]} />
                  {hasFuelData ? <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 18 }} /> : null}
                </PieChart>
              </ResponsiveContainer>
              {!hasFuelData ? <NoDataChartMessage /> : null}
            </div>
          </ChartCard>

          <ChartCard title={t(foodKey)}>
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="fpYes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="fpNo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#F87171" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="shortLabel" tick={{ fontSize: 13, fill: "#000", fontWeight: 'bold' }} interval={0} height={40} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} />
                <YAxis tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} label={{ value: "Number of Hostels", angle: -90, position: "insideLeft", offset: -5, fontSize: 10, fill: "#333" }} />
                <Tooltip content={<StyledTooltip />} formatter={(v, n, props) => [v, props.payload.categoryName]} />
                <Legend verticalAlign="top" />
                <Bar dataKey="yes" name="Yes" fill="url(#fpYes)" radius={[4, 4, 0, 0]} cursor="pointer" barSize={40} maxBarSize={40} onClick={d => handleChartClick({ e: { point: { category: d.categoryName, y: d.yes, type: t('btn_Yes') } }, name: foodKey })} />
                <Bar dataKey="no" name="No" fill="url(#fpNo)" radius={[4, 4, 0, 0]} cursor="pointer" barSize={40} maxBarSize={40} onClick={d => handleChartClick({ e: { point: { category: d.categoryName, y: d.no, type: t('btn_No') } }, name: foodKey })} />
              </BarChart>
            </ResponsiveContainer>
            {!hasFoodData ? <NoDataChartMessage /> : null}
            </div>
            {hasFoodData ? <CustomLegend mapping={foodLegendMapping} /> : null}
          </ChartCard>

          <ChartCard title={t(varKey)}>
            <div style={{ width: '100%', height: 300, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={varData} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="pvYes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="pvNo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#F87171" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="shortLabel" tick={{ fontSize: 13, fill: "#000", fontWeight: 'bold' }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} />
                <YAxis tick={{ fontSize: 11, fill: "#000" }} axisLine={BLACK_AXIS} tickLine={BLACK_TICK} label={{ value: "Number of Hostels", angle: -90, position: "insideLeft", offset: -5, fontSize: 10, fill: "#333" }} />
                <Tooltip content={<StyledTooltip />} formatter={(v, n, props) => [v, props.payload.categoryName]} />
                <Legend verticalAlign="top" />
                <Bar dataKey="yesCount" name="Yes" fill="url(#pvYes)" radius={[4, 4, 0, 0]} cursor="pointer" barSize={40} maxBarSize={40} onClick={d => handleChartClick({ e: { point: { category: d.categoryName, y: d.yesCount, type: t('btn_Yes') } }, name: varKey })} />
                <Bar dataKey="noCount" name="No" fill="url(#pvNo)" radius={[4, 4, 0, 0]} cursor="pointer" barSize={40} maxBarSize={40} onClick={d => handleChartClick({ e: { point: { category: d.categoryName, y: d.noCount, type: t('btn_No') } }, name: varKey })} />
              </BarChart>
            </ResponsiveContainer>
            {!hasVariationData ? <NoDataChartMessage /> : null}
            </div>
            {hasVariationData ? <CustomLegend mapping={varLegendMapping} /> : null}
          </ChartCard>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default FoodProvisionsDashboard;
