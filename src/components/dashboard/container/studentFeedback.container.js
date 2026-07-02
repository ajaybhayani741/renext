import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { isEqual } from '../../../utils/javascript'
import { getStudentTopThreeConcernsApi } from '../dashboard.api'

const studentFeedback = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { dateRange } = selector(state => state?.app?.fiscalYear)
  const [feedback, setFeedback] = useState({ list: [], loader: false, pageNo: 1 })
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  const getFeedback = async (pageNo = 1) => {
    setFeedback(prev => ({ ...prev, loader: true }))
    const response = await getStudentTopThreeConcernsApi({
      pageNo,
      params: { fromDate: dateRange?.from, toDate: dateRange?.to },
    })
    setFeedback(prev => ({
      ...prev,
      ...(response?.data || {}),
      list: isEqual(pageNo, 1)
        ? response?.data?.list
        : [...(prev?.list || []), ...(response?.data?.list || [])],
      pageNo,
      loader: false,
    }))
  }

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) getFeedback()
  }, [dateRange])

  const handleHostelSelect = jobId => {
    setSelectedFeedback(feedback?.list?.find(item => item?.jobId === jobId))
  }

  const handlePopupScroll = ({ target }) => {
    const reachedBottom =
      Math.round(target.scrollTop) + target.offsetHeight === target.scrollHeight
    if (!feedback?.loader && feedback?.hasMore && reachedBottom) {
      getFeedback(feedback?.pageNo + 1)
    }
  }

  const feedbackColumns = [
    {
      title: 'Feedback Type',
      dataIndex: 'label',
      key: 'label',
      width: '50%',
      render: value => t(value),
    },
    {
      title: 'Remarks',
      dataIndex: 'description',
      key: 'description',
      width: '50%',
    },
  ]

  const feedbackData = selectedFeedback
    ? [
        {
          label: 'job_StudentTopThreeConcerns',
          description: selectedFeedback?.studentTopThreeConcerns || '-',
        },
      ]
    : []

  return {
    feedback,
    selectedFeedback,
    handleHostelSelect,
    handlePopupScroll,
    feedbackColumns,
    feedbackData,
  }
}

export default studentFeedback
