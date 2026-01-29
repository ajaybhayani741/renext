import { useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { downloadReport } from '../../../utils/customFunctions'
import { include, isEqual, notEqual } from '../../../utils/javascript'
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
      hidden: notEqual(title, 'job_Variation'),
    },
    {
      title: t('txt_Action'),
      key: 'viewJob',
      render: rowData => {
        return (
          <ANTDButton
            type="primary"
            size="small"
            onClick={() => handleHostelClick(rowData)}
          >
            {t('txt_ViewJob')}
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
    const payload = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      chartType: chartTypeKeys?.[selectedColumn?.title],
      title: isEqual(selectedColumn?.chartData?.chartType, 'rangeFrequency')
        ? t(selectedColumn?.chartData?.xAxisTitle)
        : `${t(selectedColumn?.chartData?.category)}${selectedColumn?.chartData?.type ? ` (${selectedColumn?.chartData?.type})` : ''}`,
    }
    if (isEqual(selectedColumn?.chartData?.chartType, 'rangeFrequency')) {
      Object.assign(payload, {
        start: selectedColumn?.chartData?.start,
        end: selectedColumn?.chartData?.end,
      })
    } else if (selectedColumn?.chartData?.chartType === 'pie') {
      Object.assign(payload, {
        filterValue: selectedColumn?.categoryValue,
      })
    } else {
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
