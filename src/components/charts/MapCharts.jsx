import React, { useEffect, useState } from 'react'

import HightChart from '.'
import useTranslations from '../../hooks/useTranslations'

const MapCharts = () => {
  const { t } = useTranslations()

  const data = [
    ['madhya pradesh', 10],
    ['uttar pradesh', 11],
    ['karnataka', 12],
    ['nagaland', 13],
    ['bihar', 14],
    ['lakshadweep', 15],
    ['andaman and nicobar', 16],
    ['assam', 17],
    ['west bengal', 18],
    ['puducherry', 19],
    ['daman and diu', 20],
    ['gujarat', 21],
    ['rajasthan', 22],
    ['dadara and nagar havelli', 23],
    ['chhattisgarh', 24],
    ['tamil nadu', 30],
    ['chandigarh', 26],
    ['punjab', 27],
    ['haryana', 28],
    ['andhra pradesh', 29],
    ['maharashtra', 30],
    ['himachal pradesh', 31],
    ['meghalaya', 32],
    ['kerala', 33],
    ['telangana', 50],
    ['mizoram', 35],
    ['tripura', 36],
    ['manipur', 37],
    ['arunanchal pradesh', 38],
    ['jharkhand', 39],
    ['goa', 40],
    ['nct of delhi', 41],
    ['odisha', 42],
    ['jammu and kashmir', 43],
    ['sikkim', 44],
    ['uttarakhand', 45],
  ]

  const [topology, setTopology] = useState(null)

  useEffect(() => {
    const apiCall = async () => {
      const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/in/custom/in-all-disputed.topo.json',
      )
        .then(response => response?.json())
        .catch(err => {})
      setTopology(topology)
    }

    apiCall()
  }, [])

  const options = {
    chart: {
      map: topology,
    },

    title: {
      text: t('dash_MapShowingRecoveryRateForEachState'),
    },
    credits: false,
    subtitle: {
      text: t('dash_SourceMapIndia'),
    },

    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
      },
    },

    colorAxis: {
      min: 0,
    },

    series: [
      {
        mapData: topology,
        data: data,
        states: {
          hover: {
            color: '#BADA55',
          },
        },
        // type: 'mapbubble',
        dataLabels: {
          enabled: true,
          format: '{point.name}',
        },
      },
    ],
  }

  return <HightChart options={options} constructorType={'mapChart'} />
}

export default MapCharts
