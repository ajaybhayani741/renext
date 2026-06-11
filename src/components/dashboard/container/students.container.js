import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { downloadReport } from '../../../utils/customFunctions'
import { keys } from '../../../utils/javascript'
import { getJobDetailApi } from '../../jobs/jobs.api'
import { payloadType, tabKeys } from '../../jobs/jobs.description'
import {
  getChartReportApi,
  getHostelStudentsChartApi,
  getStudentsHostelsApi,
} from '../dashboard.api'
import {
  chartTypeKeys,
  lineChartRange,
  studentCharts,
} from '../dashboard.description'
import {
  getHostelChartParams,
  setLineChartSeriesData,
} from '../dashboardFunctions'

const students = ({ hostelFilter, genderFilter = 'ALL' } = {}) => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [selectedColumn, setSelectedColumn] = useState({
    selected: false,
    chartData: null,
  })
  const [jobModel, setJobModel] = useState({
    open: false,
    loader: false,
    data: null,
  })
  const [seriesData, setSeriesData] = useState(null)
  const [hostelsData, setHostelsData] = useState(null)
  const [reportLoader, setReportLoader] = useState(false)

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getData()
    }
  }, [dateRange, hostelFilter, genderFilter])

  const getDataApi = async ({
    name,
    start = lineChartRange?.start,
    end = lineChartRange?.end,
  }) => {
    const lineParams = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
      start,
      end,
      gender: genderFilter,
      ...getHostelChartParams(hostelFilter),
    }
    switch (name) {
      case 'dash_TotalNumberOfStudents':
        const fansResp = await getHostelStudentsChartApi({
          params: lineParams,
        })
        return fansResp
      default:
        return null
    }
  }

  const getData = async ({
    start,
    end,
    chartType = keys(studentCharts),
  } = {}) => {
    chartType?.forEach(async key => {
      const respData = await getDataApi({ name: key, start, end })
      let tempSeriesData = setLineChartSeriesData({
        respData,
        key,
      })
      setSeriesData(prev => ({
        ...prev,
        [key]: tempSeriesData,
      }))
    })
  }

  const getHandleClickDataApi = async ({
    range,
    pageNo = 1,
    name,
    start,
    end,
    newDateRange = dateRange,
  } = {}) => {
    const isRangeFrequency = studentCharts?.[name]?.chartType === 'rangeFrequency'
    const rangeValue = isRangeFrequency && range && typeof range === 'number' ? range : null
    const selectedDateRange =
      newDateRange?.from && newDateRange?.to ? newDateRange : dateRange
    const lineParams = {
      fromDate: selectedDateRange?.from,
      toDate: selectedDateRange?.to,
      ...(rangeValue && { range: rangeValue }),
      ...(!rangeValue && (start || end) && { start, end }),
      gender: genderFilter,
    }
    switch (name) {
      case 'dash_TotalNumberOfStudents':
        const studentsResp = await getStudentsHostelsApi({
          pageNo,
          params: lineParams,
        })
        return studentsResp?.data
      default:
        return null
    }
  }

  const handleChartClick = async ({
    e,
    name,
    startEnd,
    newDateRange,
    xAxisTitle,
  }) => {
    const data = e.point
    const selectedDateRange =
      newDateRange?.from && newDateRange?.to ? newDateRange : dateRange
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      range: data?.category,
      name,
      start: startEnd?.start,
      end: startEnd?.end,
      newDateRange: selectedDateRange,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }
    setSelectedColumn({
      selected: true,
      chartData: {
        category: data?.category,
        value: data?.y,
        range: data?.category,
        name,
        start: startEnd?.start,
        end: startEnd?.end,
        newDateRange: selectedDateRange,
        chartType: studentCharts?.[name]?.chartType,
        xAxisTitle: xAxisTitle,
      },
      title: name,
    })
  }

  const handleTableChange = async ({ current }) => {
    setHostelsData(prev => ({ ...prev, loader: true }))
    const respData = await getHandleClickDataApi({
      range: selectedColumn?.chartData?.category,
      name: selectedColumn?.title,
      pageNo: current,
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      newDateRange: selectedColumn?.chartData?.newDateRange,
    })
    if (respData) {
      setHostelsData({ ...respData, loader: false })
    } else {
      setHostelsData(prev => ({ loader: false }))
    }
  }

  const handleCloseModal = () => {
    setSelectedColumn({
      selected: false,
      chartData: null,
      list: [],
    })
  }

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
        jobType: payloadType[tabKeys.inspection],
      },
    })
    setJobModel({
      ...jobModel,
      data: resp?.data,
      open: true,
      loader: false,
    })
  }

  const handleDownloadExcel = async () => {
    const selectedDateRange =
      selectedColumn?.chartData?.newDateRange?.from &&
      selectedColumn?.chartData?.newDateRange?.to
        ? selectedColumn?.chartData?.newDateRange
        : dateRange

    const payload = {
      fromDate: selectedDateRange?.from,
      toDate: selectedDateRange?.to,
      chartType: chartTypeKeys?.[selectedColumn?.title],
      title: t(selectedColumn?.chartData?.xAxisTitle),
      start: selectedColumn?.chartData?.start,
      end: selectedColumn?.chartData?.end,
      gender: genderFilter,
    }

    try {
      setReportLoader(true)
      const response = await getChartReportApi({ payload })
      if (response?.data?.dmsDetails?.fileUrl) {
        downloadReport(response?.data?.dmsDetails?.fileUrl)
      }
    } finally {
      setReportLoader(false)
    }
  }

  return {
    onRangeChange: getData,
    seriesData,
    selectedColumn,
    handleChartClick,
    handleCloseModal,
    hostelsData,
    handleTableChange,
    jobModel,
    handleCloseJobModel,
    handleHostelClick,
    handleDownloadExcel,
    reportLoader,
    jobType: tabKeys.inspection,
  }
}

export default students
