import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { entries, notEqual } from '../../../utils/javascript'
import {
  getEducationFacilitiesBarChartApi,
  getEducationFacilitiesHostelsApi,
} from '../dashboard.api'
import {
  axisOptionsList,
  educationFacilitiesCharts,
  schoolsList,
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

  const [seriesData, setSeriesData] = useState({
    dash_EducationRequirements: {
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
      seriesData: [
        {
          name: t('btn_Yes'),
          data: [],
          // pointPlacement: -0.13,
        },
        {
          name: t('btn_No'),
          data: [],
          // pointPlacement: 0.12,
        },
      ],
    },
  })
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
      getEducationFacilitiesBarChartData()
    }
  }, [dateRange])

  // Education Facilities Bar Chart API call
  const getEducationFacilitiesBarChartData = async () => {
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getEducationFacilitiesBarChartApi({
      params,
    })

    if (response && response.data) {
      setSeriesData(prev => ({
        ...prev,
        dash_EducationRequirements: {
          ...prev.dash_EducationRequirements,
          seriesData: [
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
          ],
        },
      }))
    }
  }

  const handleChartClick = async (e, name) => {
    const data = e.point

    if (name === 'dash_EducationRequirements') {
      // Handle education facilities bar chart click
      const category = data?.category
      const type = data?.series?.name
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getEducationFacilitiesHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: 1,
        })

        if (response && response.data) {
          setSelectedColumn({
            selected: true,
            chartData: {
              category: data?.category,
              type: data?.series?.name,
              value: data?.y,
            },
            list: response.data.hostels || [],
            title: name,
            modalTitle: true,
          })
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
    } else {
      setSelectedColumn({
        selected: true,
        chartData: {
          category: data?.category,
          type: data?.series?.name,
          value: data?.y,
        },
        list: [...schoolsList],
        title: name,
        modalTitle: true,
      })
    }
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
    if (selectedColumn?.title === 'dash_EducationRequirements') {
      // Handle education facilities bar chart pagination
      const category = selectedColumn?.chartData?.category
      const type = selectedColumn?.chartData?.type
      const filterValue = type === t('btn_Yes') ? 'YES' : 'NO'
      const apiCategory = categoryMapping[category]

      try {
        setHostelsData(prev => ({ ...prev, loader: true }))
        const response = await getEducationFacilitiesHostelsApi({
          params: {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            category: apiCategory,
            filterValue: filterValue,
          },
          pageNo: current,
        })

        if (response && response.data) {
          setHostelsData({ ...response.data, loader: false })
        }
      } catch (error) {
        setHostelsData(prev => ({ ...prev, loader: false }))
      }
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
