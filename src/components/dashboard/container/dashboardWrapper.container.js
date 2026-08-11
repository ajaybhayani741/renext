import { useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { downloadReport } from '../../../utils/customFunctions'
import { include, isEqual } from '../../../utils/javascript'
import { getJobDetailApi } from '../../jobs/jobs.api'
import { payloadType } from '../../jobs/jobs.description'
import { getChartReportApi } from '../dashboard.api'
import { chartTypeKeys, reportCategoryKeys } from '../dashboard.description'

const dashboardWrapper = ({ title, pageNo, jobType, selectedColumn }) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [jobModel, setJobModel] = useState({
    open: false,
    loader: false,
    data: null,
  })
  const [reportLoader, setReportLoader] = useState(false)
  // const condition = include(
  //   [
  //     'job_HostelAuthority',
  //     'job_RecordMaintenance',
  //     'dash_LocationBedsMattresses',
  //     'dash_WasteManagement',
  //     'dash_ToiletsSufficiency',
  //     'job_DrinkingWater',
  //     'job_MedicalCare',
  //     'dash_IsTheStaffNurseAvailableInTheHostel',
  //     'dash_EducationRequirements',
  //     'job_FoodProvisions',
  //     'dash_PrecautionaryMeasures',
  //     'dash_AnimalThreat',
  //     'dash_PrincipalHWOSpecialOfficer',
  //     'job_NatureOfCookingFuel',
  //   ],
  //   title,
  // )

  const showVariationValueColumn = isEqual(title, 'job_Variation')
  const isMetricsOverview = isEqual(
    selectedColumn?.reportChartType,
    'DASHBOARD_METRICS_OVERVIEW',
  )
  const hideActionColumn =
    isMetricsOverview &&
    isEqual(selectedColumn?.categoryValue, 'YET_TO_BE_ASSIGNED_THIS_WEEK')
  const columns = [
    {
      title: '',
      key: 'id',
      render: (_, __, index) => {
        return (pageNo - 1) * 10 + index + 1
      },
    },
    {
      title: t('user_Hostel'),
      key: 'lastName',
      render: rowData =>
        rowData?.businessName ?? rowData?.lastName ?? rowData?.name ?? '-',
      // hidden: !condition,
    },
    // Dynamic column based on selectedColumn data
    ...(selectedColumn?.chartData?.chartType === 'rangeFrequency' &&
    selectedColumn?.chartData?.xAxisTitle
      ? [
          {
            title: t(selectedColumn.chartData.xAxisTitle),
            dataIndex: 'value',
            key: 'dynamicColumn',
            render: rowData => (rowData ? `${rowData}` : '-'),
          },
        ]
      : []),
    //   title: t('dash_Students'),
    //   dataIndex: 'total_students',
    //   key: 'students',
    //   render: rowData => (rowData ? `${rowData}` : '-'),
    //   hidden: condition,
    // },
    {
      title: t('job_Variation'),
      dataIndex: 'value',
      key: 'variation',
      render: rowData => {
        return rowData || '-'
      },
      hidden: !showVariationValueColumn,
    },
    {
      title: t('txt_Action'),
      key: 'viewJob',
      width: 120,
      hidden: hideActionColumn,
      render: rowData => {
        const disableViewJob =
          isMetricsOverview &&
          isEqual(selectedColumn?.categoryValue, 'TOTAL_HOSTELS_ONBOARDED') &&
          !rowData?.jobId

        return (
          <ANTDButton
            type="primary"
            size="small"
            onClick={() => handleHostelClick(rowData)}
            disabled={disableViewJob}
          >
            {t('btn_View')}
          </ANTDButton>
        )
      },
    },
  ].filter(item => !item.hidden)

  const handleCloseJobModel = () => {
    setJobModel({ ...jobModel, open: false, data: null })
  }

  const handleHostelClick = async rowData => {
    setJobModel({
      ...jobModel,
      loader: true,
    })
    const resp = await getJobDetailApi({
      params: {
        id: rowData?.jobId,
        jobType: payloadType[jobType],
      },
    })
    setJobModel({
      ...jobModel,
      data: resp?.data,
      open: true,
      loader: false,
    })
  }

  const onGenerateReport = async () => {
    setReportLoader(true)
    const isInspectionAssessment = isEqual(
      selectedColumn?.reportChartType,
      'INSPECTION_ASSESSMENT',
    )
    const isOverallHostelCondition = isEqual(
      selectedColumn?.reportChartType,
      'OVERALL_HOSTEL_CONDITION',
    )
    const payload = isOverallHostelCondition
      ? {
          fromDate: dateRange?.from,
          toDate: dateRange?.to,
          chartType: 'OVERALL_HOSTEL_CONDITION',
          title: 'OVERALL_HOSTEL_CONDITION',
          filterValue: selectedColumn?.chartData?.filterValue,
        }
      : isInspectionAssessment
        ? {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            chartType: 'INSPECTION_ASSESSMENT',
            title: `INSPECTION_ASSESSMENT_${selectedColumn?.moduleName}`,
            category: selectedColumn?.moduleName,
            filterValue: selectedColumn?.categoryValue,
            question: selectedColumn?.questionName,
          }
        : {
            fromDate: dateRange?.from,
            toDate: dateRange?.to,
            chartType: chartTypeKeys?.[selectedColumn?.title],
            title: isEqual(
              selectedColumn?.chartData?.chartType,
              'rangeFrequency',
            )
              ? t(selectedColumn?.chartData?.xAxisTitle)
              : `${t(selectedColumn?.chartData?.category)}${selectedColumn?.chartData?.type ? ` (${selectedColumn?.chartData?.type})` : ''}`,
          }

    if (
      !isInspectionAssessment &&
      !isOverallHostelCondition &&
      isEqual(selectedColumn?.chartData?.chartType, 'rangeFrequency')
    ) {
      Object.assign(payload, {
        start: selectedColumn?.chartData?.start,
        end: selectedColumn?.chartData?.end,
      })
    } else if (
      !isInspectionAssessment &&
      !isOverallHostelCondition &&
      selectedColumn?.chartData?.chartType === 'pie'
    ) {
      Object.assign(payload, {
        filterValue: selectedColumn?.categoryValue,
      })
    } else if (!isInspectionAssessment && !isOverallHostelCondition) {
      Object.assign(payload, {
        category: reportCategoryKeys(t)?.[selectedColumn?.chartData?.category],
        ...(include(
          ['column', 'columnCompare'],
          selectedColumn?.chartData?.chartType,
        ) && {
          filterValue: reportCategoryKeys(t)?.[selectedColumn?.chartData?.type],
        }),
      })
    }

    const response = await getChartReportApi({ payload })
    if (response?.data) {
      downloadReport(response?.data?.dmsDetails?.fileUrl)
    }
    setReportLoader(false)
  }

  return {
    columns,
    jobModel,
    handleCloseJobModel,
    onGenerateReport,
    reportLoader,
  }
}

export default dashboardWrapper
