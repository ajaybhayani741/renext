import Highcharts from 'highcharts'
import Highcharts3d from 'highcharts/highcharts-3d.js'
import more from 'highcharts/highcharts-more'
import Cylinder from 'highcharts/modules/cylinder.js'
import Drilldown from 'highcharts/modules/drilldown'
import Funnel from 'highcharts/modules/funnel3d'
import HighchartsMap from 'highcharts/modules/map' // Import map module
import Sankey from 'highcharts/modules/sankey'
import Stock from 'highcharts/modules/stock'
import HighchartsReact from 'highcharts-react-official'
import React, { memo } from 'react'

import NoDataLoaderCard from './NoDataLoaderCard'
import ANTDCard from '../../shared/antd/ANTDCard'

// Initialize map module
HighchartsMap(Highcharts)
Sankey(Highcharts)
Drilldown(Highcharts)
more(Highcharts)
Highcharts3d(Highcharts)
Cylinder(Highcharts)
Funnel(Highcharts)
Stock(Highcharts)

const HightChart = ({
  options,
  id,
  header,
  loading = false,
  title,
  ...props
}) => {
  return (
    <ANTDCard className="mb-10 chart-card" bordered={false} {...(id && { id })}>
      {header}
      {!loading ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={{ ...options, accessibility: { enabled: false } }}
          {...props}
        />
      ) : (
        <NoDataLoaderCard title={title} loading={loading} />
      )}
    </ANTDCard>
  )
}

export default memo(HightChart)
