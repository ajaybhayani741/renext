import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, isEqual } from '../../../utils/javascript'
import {
  getLocationBedsMattressesBarChartApi,
  getLocationBedsMattressesHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  hostelInfraRoomsCharts,
} from '../dashboard.description'

const hostelInfraRooms = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [axisOptions, setAxisOptions] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)
  // const [totalData, setTotalData] = useState(null)
  const title = t('dash_StaffDetails')

  const locationBedsMattressesCategoryMapping = {
    [t('dash_LocationGovtPrivate')]: 'HOSTEL_LOCATION_TYPE',
    [t('dash_AreBedsAvailableForAll')]: 'BEDS_AVAILABLE_FOR_ALL',
    [t('dash_AreMattressesAvailableForAll')]: 'MATTRESSES_AVAILABLE_FOR_ALL',
    [t('dash_IsAccommodationSufficient')]: 'ACCOMMODATION_SUFFICIENT',
  }

  const filterValueMapping = {
    [t('dash_Government')]: 'GOVERNMENT',
    [t('dash_Private')]: 'PRIVATE',
    [t('btn_Yes')]: 'YES',
    [t('btn_No')]: 'NO',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getLocationBedsMattressesData()
    }
  }, [dateRange])

  //get series data
  const getLocationBedsMattressesData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getLocationBedsMattressesBarChartApi({ params })

    if (response && response.data) {
      const newSeriesData = [
        {
          name: '',
          color: '#eabf9f',
          data: [
            {
              y: response.data.governmentLocationCount || 0,
              custom: { label: t('dash_Government') },
            },
            {
              y: response.data.bedsAvailableForAllYes || 0,
              custom: { label: t('btn_Yes') },
            },
            {
              y: response.data.mattressesAvailableForAllYes || 0,
              custom: { label: t('btn_Yes') },
            },
            {
              y: response.data.accommodationSufficientYes || 0,
              custom: { label: t('btn_Yes') },
            },
          ],
        },
        {
          name: '',
          color: '#f1725d',
          data: [
            {
              y: response.data.privateLocationCount || 0,
              custom: { label: t('dash_Private') },
            },
            {
              y: response.data.bedsAvailableForAllNo || 0,
              custom: { label: t('btn_No') },
            },
            {
              y: response.data.mattressesAvailableForAllNo || 0,
              custom: { label: t('btn_No') },
            },
            {
              y: response.data.accommodationSufficientNo || 0,
              custom: { label: t('btn_No') },
            },
          ],
        },
      ]

      setSeriesData(prev => ({
        ...prev,
        dash_LocationBedsMattresses: newSeriesData,
      }))
    }
  }

  const getLocationBedsMattressesHostelsData = async ({
    category,
    filterValue,
    pageNo = 1,
  }) => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      category: category,
      filterValue: filterValue,
    }
    const response = await getLocationBedsMattressesHostelsApi({
      params,
      pageNo,
    })
    return response?.data
  }

  const handleChartClick = async (e, name) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))

    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        type: data?.series?.name || data?.custom?.label,
        value: data?.y,
      },
      title: name,
      modalTitle: hostelInfraRoomsCharts?.[name]?.modalTitle,
    })

    let respData = null
    if (name === 'dash_LocationBedsMattresses') {
      const categoryIndex = data?.category
      const filterValue = data?.custom?.label

      const apiCategory = locationBedsMattressesCategoryMapping[categoryIndex]
      const apiFilterValue = filterValueMapping[filterValue]

      respData = await getLocationBedsMattressesHostelsData({
        category: apiCategory,
        filterValue: apiFilterValue,
      })

      if (respData) {
        setHostelsData({ ...respData, loader: false })
      } else {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    }
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(hostelInfraRoomsCharts).forEach(([key, value]) => {
      tempOptions[key] = isEqual(value?.chartType, 'column')
        ? {
            category: value?.xAxisText?.map(v => t(v)),
          }
        : {
            xAxis: {
              ...axisOptionsList?.xAxis,
              title: {
                text: t(value?.xAxisText),
              },
              tickPositions: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
            },
            yAxis: axisOptionsList?.yAxis?.map(axis => ({
              ...axis,
              title: {
                text: t(value?.yAxisText),
              },
            })),
          }
      tempSeriesData[key] = isEqual(value?.chartType, 'column')
        ? [
            {
              name: '',
              color: '#eabf9f',
              data: [
                { y: 85, custom: { label: t('dash_Government') } },
                { y: 45, custom: { label: t('btn_Yes') } },
                { y: 70, custom: { label: t('btn_Yes') } },
                { y: 60, custom: { label: t('btn_Yes') } },
              ],
              // pointPlacement: -0.13,
            },
            {
              name: '',
              color: '#f1725d',
              data: [
                { y: 15, custom: { label: t('dash_Private') } },
                { y: 55, custom: { label: t('btn_No') } },
                { y: 30, custom: { label: t('btn_No') } },
                { y: 40, custom: { label: t('btn_No') } },
              ],
              // pointPlacement: 0.12,
            },
          ]
        : [
            {
              type: 'column',
              data: [
                [5, 45],
                [10, 37],
                [15, 28],
                [20, 17],
                [25, 39],
                [30, 18],
                [35, 90],
                [40, 78],
                [45, 74],
                [50, 18],
                [55, 17],
                [60, 16],
              ],
            },
            {
              type: 'spline',
              data: [
                [5, 45],
                [10, 37],
                [15, 28],
                [20, 17],
                [25, 39],
                [30, 18],
                [35, 90],
                [40, 78],
                [45, 74],
                [50, 18],
                [55, 17],
                [60, 16],
              ],
            },
          ]
      // tempTotalData[key] = 1100
    })
    setSeriesData(tempSeriesData)
    setAxisOptions(tempOptions)
    // setTotalData(tempTotalData)
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
    setHostelsData({})
  }

  const handleTableChange = async ({ current }) => {
    if (selectedColumn?.title === 'dash_LocationBedsMattresses') {
      setHostelsData(prev => ({ ...prev, loader: true }))
      const categoryIndex = selectedColumn?.chartData?.category
      const categoryKeys = Object.keys(locationBedsMattressesCategoryMapping)
      const filterValue = selectedColumn?.chartData?.type

      if (categoryIndex !== undefined && categoryKeys[categoryIndex]) {
        const apiCategory =
          locationBedsMattressesCategoryMapping[categoryKeys[categoryIndex]]
        const apiFilterValue = filterValueMapping[filterValue]

        const respData = await getLocationBedsMattressesHostelsData({
          category: apiCategory,
          filterValue: apiFilterValue,
          pageNo: current,
        })

        if (respData) {
          setHostelsData({ ...respData, loader: false })
        } else {
          setHostelsData(prev => ({ ...prev, loader: false }))
        }
      }
    }
  }

  return {
    title,
    axisOptions,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default hostelInfraRooms
