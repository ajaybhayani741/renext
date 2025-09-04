import { useState } from 'react'

const producerDashboard = () => {
  const [targetModel, setTargetModel] = useState({ open: false })
  const [reportView, setReportView] = useState({
    isOpen: false,
    reportLink: '',
  })
  const onCheckTargetModelToggle = () => {
    setTargetModel(pre => ({ ...pre, open: !pre?.open }))
  }
  const inDownloadClick = () => {
    setReportView(prev => ({
      isOpen: !prev?.isOpen,
      reportLink:
        'https://dnum2o6eykwnz.cloudfront.net/job-reports/Annual+Returns_MSTI_202526.pdf',
    }))
  }
  return {
    reportView,
    targetModel,
    setReportView,
    onCheckTargetModelToggle,
    inDownloadClick,
  }
}

export default producerDashboard
