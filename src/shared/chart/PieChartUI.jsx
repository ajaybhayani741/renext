import React from 'react'
import { Cell, Pie, PieChart, Tooltip } from 'recharts'

import { colorCodes } from '../../components/dataVisualization/countryData'
import useTranslations from '../../hooks/useTranslations'

function PieChartUI({ pieChartData }) {
  const { t } = useTranslations()

  const customTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: '#ffff',
            padding: '3px',
            border: '1px solid #cccc',
            position: 'relative',
            bottom: 20,
            left: 30,
          }}
        >
          <label>{`${t(payload[0].name)} : ${payload[0].value}`}</label>
        </div>
      )
    }
    return null
  }

  return (
    <div className="webkit-center">
      <PieChart width={200} height={200}>
        <Pie
          data={pieChartData?.errorCodesList?.map(val => ({
            ...val,
            value: val.count,
          }))}
          cx={80}
          cy={80}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          legendType="circle"
        >
          {pieChartData?.errorCodesList?.map((value, index) => (
            <Cell key={`cell-${index}`} fill={colorCodes[index]} />
          ))}
        </Pie>
        <Tooltip content={customTooltip} />
      </PieChart>
      <div className="legend-label">
        {pieChartData?.errorCodesList?.map((value, i) => {
          return (
            <span key={i}>
              <span
                style={{ backgroundColor: `${colorCodes[i]}` }}
                className="color"
              />
              {t(value.name)}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default PieChartUI
