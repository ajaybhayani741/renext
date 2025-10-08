import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual, values } from '../../../utils/javascript'
import {
  getEducationFacilitiesBarChartApi,
  getEducationFacilitiesHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  educationFacilitiesCharts,
} from '../dashboard.description'

const educationFacilities = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [hostelsData, setHostelsData] = useState(null)

  const [seriesData, setSeriesData] = useState({})
  const [axisOptions, setAxisOptions] = useState(null)

  const categoryMapping = {
    [t('job_TextbooksSupplied')]: 'TEXTBOOKS',
    [t('job_NotebooksSupplied')]: 'NOTEBOOKS',
    [t('job_UniformsSupplied')]: 'UNIFORMS',
    [t('job_TrunkBoxesSupplied')]: 'TRUNK_BOXES',
    [t('job_PlatesGlassesSupplied')]: 'PLATES_GLASSES',
    [t('job_SchoolBagsSupplied')]: 'SCHOOL_BAGS',
    [t('job_BeddingMaterialSupplied')]: 'BEDDING_MATERIAL',
    [t('job_TreasuryBillRegisterMaintained')]: 'TREASURY_BILL_REGISTER',
    [t('job_TeachingAsPerLessonPlan')]: 'TEACHING_ANNUAL_LESSON_PLAN',
  }

  useEffect(() => {
    getSeriesData()
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange])

  const getDataApi = name => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    switch (name) {
      case 'dash_EducationRequirements':
        return getEducationFacilitiesBarChartApi({ params })
      default:
        return null
    }
  }

  const getData = async () => {
    let tempSeriesData = {}
    for (const key of Object.keys(educationFacilitiesCharts)) {
      const response = await getDataApi(key)
      if (response && response.data) {
        const isData = values(response?.data)?.find(item => item)
        if (key === 'dash_EducationRequirements') {
          tempSeriesData[key] = {
            chartData: {
              category: [
                t('job_TextbooksSupplied'),
                t('job_NotebooksSupplied'),
                t('job_UniformsSupplied'),
                t('job_TrunkBoxesSupplied'),
                t('job_PlatesGlassesSupplied'),
                t('job_SchoolBagsSupplied'),
                t('job_BeddingMaterialSupplied'),
                t('job_TreasuryBillRegisterMaintained'),
                t('job_TeachingAsPerLessonPlan'),
              ],
            },
            seriesData: isData
              ? [
                  {
                    name: t('btn_Yes'),
                    data: [
                      response.data.boardersSuppliedTextbooksYes || 0,
                      response.data.boardersSuppliedNotebooksYes || 0,
                      response.data.boardersSuppliedUniformsYes || 0,
                      response.data.boardersSuppliedTrunkBoxesYes || 0,
                      response.data.boardersSuppliedPlatesGlassesYes || 0,
                      response.data.boardersSuppliedSchoolBagsYes || 0,
                      response.data.boardersSuppliedBeddingMaterialYes || 0,
                      response.data.treasuryBillRegisterMaintainedYes || 0,
                      response.data.teachingAsPerAnnualLessonPlanYes || 0,
                    ],
                  },
                  {
                    name: t('btn_No'),
                    data: [
                      response.data.boardersSuppliedTextbooksNo || 0,
                      response.data.boardersSuppliedNotebooksNo || 0,
                      response.data.boardersSuppliedUniformsNo || 0,
                      response.data.boardersSuppliedTrunkBoxesNo || 0,
                      response.data.boardersSuppliedPlatesGlassesNo || 0,
                      response.data.boardersSuppliedSchoolBagsNo || 0,
                      response.data.boardersSuppliedBeddingMaterialNo || 0,
                      response.data.treasuryBillRegisterMaintainedNo || 0,
                      response.data.teachingAsPerAnnualLessonPlanNo || 0,
                    ],
                  },
                ]
              : [],
          }
        }
      }
    }
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
  }

  const getHandleClickDataApi = ({ name, category, pageNo, type }) => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      pageNo,
    }
    switch (name) {
      case 'dash_EducationRequirements':
        const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
        const apiCategory = categoryMapping[category]
        return getEducationFacilitiesHostelsApi({
          pageNo,
          params: { ...params, category: apiCategory, filterValue },
        })
      default:
        return null
    }
  }

  const handleChartClick = async ({ e, name }) => {
    const data = e.point
    setHostelsData(prev => ({ ...prev, loader: true }))
    const category = data?.category
    const type = data?.series?.name
    const response = await getHandleClickDataApi({
      name,
      category,
      type,
      pageNo: 1,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }

    setSelectedColumn({
      selected: true,
      chartData: {
        category,
        type,
        value: data?.y,
      },
      list: response?.data?.hostels || [],
      title: name,
      modalTitle: educationFacilitiesCharts[name]?.modalTitle,
    })
  }

  const getSeriesData = () => {
    let tempOptions = {}
    let tempSeriesData = {}
    // let tempTotalData = {}
    entries(educationFacilitiesCharts).forEach(([key, value]) => {
      if (notEqual(value?.type, 'rangeFrequency')) return
      tempOptions[key] = {
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
    })
    setSeriesData(prev => ({ ...prev, ...tempSeriesData }))
    setAxisOptions(prev => ({ ...prev, ...tempOptions }))
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const { title, chartData } = selectedColumn
    const response = await getHandleClickDataApi({
      name: title,
      category: chartData?.category,
      type: chartData?.type,
      pageNo: current,
    })

    if (response?.data) {
      setHostelsData({ ...response?.data, loader: false })
    } else {
      setHostelsData(prev => ({ ...prev, loader: false }))
    }
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
    setHostelsData({})
  }

  return {
    axisOptions,
    handleChartClick,
    seriesData,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
  }
}

export default educationFacilities
