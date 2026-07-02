import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { isEqual } from '../../../utils/javascript'
import { getStudentTopThreeConcernsApi } from '../dashboard.api'

const studentFeedback = () => {
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

  return {
    feedback,
    selectedFeedback,
    handleHostelSelect,
    handlePopupScroll,
  }
}

export default studentFeedback
