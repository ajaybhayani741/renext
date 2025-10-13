import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual } from '../../../utils/javascript'
import { getFeedbackHostelsApi } from '../dashboard.api'

const feedback = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [hostelsList, setHostelsList] = useState({ loader: false })
  const [selectedHostel, setSelectedHostel] = useState(null)

  const getHostels = async ({ pageNo = 1 } = {}) => {
    setHostelsList(prev => ({ ...prev, loader: true }))
    const params = {
      fromDate: dateRange?.from,
      toDate: dateRange?.to,
    }
    const response = await getFeedbackHostelsApi({ params, pageNo })
    if (response?.data) {
      setHostelsList(prev => ({
        ...prev,
        ...response?.data,
        list: isEqual(pageNo, 1)
          ? response?.data?.list
          : [...hostelsList?.list, ...response?.data?.list],
        loader: false,
      }))
    } else {
      setHostelsList(prev => ({ ...prev, loader: false }))
    }
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      getHostels()
    }
  }, [dateRange])

  const handleHostelSelect = jobId => {
    const selected = hostelsList?.list?.find(item => item?.jobId === jobId)
    setSelectedHostel(selected)
  }

  const handlePopupScroll = e => {
    const { target } = e
    if (
      !hostelsList?.loader &&
      hostelsList?.hasMore &&
      isEqual(
        Math.round(target.scrollTop) + target.offsetHeight,
        target.scrollHeight,
      )
    ) {
      getHostels({ pageNo: hostelsList?.pageNo + 1 })
    }
  }

  const feedbackColumns = [
    {
      title: t('job_StudentFeedback'),
      key: 'job_StudentFeedback',
      dataIndex: 'feedbackRequestFromStudents',
      width: '50%',
    },
    {
      title: t('job_OfficerFeedback'),
      key: 'job_OfficerFeedback',
      dataIndex: 'feedbackRequestFromPrincipal',
      width: '50%',
    },
  ]

  return {
    handlePopupScroll,
    handleHostelSelect,
    hostelsList,
    selectedHostel,
    feedbackColumns,
  }
}

export default feedback
