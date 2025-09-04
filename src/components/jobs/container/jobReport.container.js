import { useState } from 'react'

import { notifyMethod } from '../../../App'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import configData from '../../../utils/config'
import { fieldContactFormat } from '../../../utils/customFunctions'
import {
  capitalFirstLetter,
  entries,
  include,
  isEqual,
  keys,
} from '../../../utils/javascript'
import { getReportApi, shareCertificateApi, updateReportApi } from '../jobs.api'
import { jobWiseReport } from '../jobs.description'

const jobReport = ({ jobType, jobId, apiCall }) => {
  const reportTypes = jobWiseReport[jobType]
  const shareCertificateForm = useFormFn()
  const [loader, setLoader] = useState({ share: false, updateCert: false })
  const [reportView, setReportView] = useState({
    isOpen: false,
    reportLink: '',
  })
  const [shareReport, setShareReport] = useState({
    isOpen: false,
    report: {},
  })
  const [updateReport, setUpdateReport] = useState({ isOpen: false })

  const onPdfClick = ({ reportLink }) => {
    setReportView({ isOpen: true, reportLink: reportLink?.report })
  }

  const onShareClick = ({ reportLink }) => {
    // setShareReport({ isOpen: true, reportLink: reportLink })
    setShareReport({
      isOpen: true,
      reportLink: {
        reportQr:
          reportLink?.reportQr ||
          'https://dnum2o6eykwnz.cloudfront.net/qr-codes/qr-code_MatNEXT_Output_Certificate1.png',
      },
    })
  }

  const onUpdateClick = () => {
    setUpdateReport({ isOpen: true })
  }

  const onFinish = async values => {
    const hasValue = Object.values(values).some(value => !!value)
    if (!hasValue) {
      notifyMethod.error({ message: 'msg_PleaseEnterOneField' })
      return
    }
    setLoader(prev => ({ ...prev, share: true }))
    const { phoneNumber, emailId } = values
    const payload = {
      emailId,
      phoneNumber: phoneNumber && configData.countryCode.concat(phoneNumber),
      jobType,
      reportType: reportTypes?.[0]?.type,
      reportUrl: shareReport?.reportLink?.report,
      jobId,
    }
    const response = await shareCertificateApi({ payload })
    if (response?.data) {
      shareCertificateForm.resetFields()
      setShareReport({ isOpen: false, report: {} })
    }
    setLoader(prev => ({ ...prev, share: false }))
  }

  const onValuesChange = e => {
    if (include(keys(e), 'phoneNumber')) {
      const formattedPhone = fieldContactFormat(e.phoneNumber)
      shareCertificateForm.setFieldsValue({ phoneNumber: formattedPhone }) // Update form field value
    }
  }

  const onUpdateFormSubmit = async values => {
    setLoader({ ...loader, updateCert: true })
    const payload = {
      jobId,
      jobType,
      reportType: reportTypes?.[0]?.type,
    }
    entries(values)?.forEach(([key, val]) => {
      if (isEqual(typeof val, 'object')) {
        keys(val)?.forEach(k => {
          const newKey = key + capitalFirstLetter(k)
          payload[newKey] = val[k]
        })
      } else {
        payload[key] = val
      }
    })
    const resp = await updateReportApi({ payload })
    setLoader({ ...loader, updateCert: false })
    setUpdateReport({ isOpen: false })

    if (resp?.data) {
      notifyMethod.success({ message: 'msg_ReportUpdatedSuccessfully' })
      if (apiCall) {
        const time = Date.now()
        const intervalId = setInterval(async () => {
          const response = await getReportApi({
            jobId,
            jobType,
          })
          if (response?.data?.done || time + 300000 < Date.now()) {
            apiCall(jobId)
            clearInterval(intervalId)
          }
        }, 1000)
      }
    }
  }

  return {
    shareCertificateForm,
    reportTypes,
    reportView,
    shareReport,
    loader,
    updateReport,
    onPdfClick,
    setShareReport,
    setReportView,
    setUpdateReport,
    onShareClick,
    onUpdateClick,
    onFinish,
    onValuesChange,
    onUpdateFormSubmit,
  }
}

export default jobReport
