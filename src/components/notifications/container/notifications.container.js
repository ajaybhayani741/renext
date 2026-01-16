import { useEffect, useRef, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setNotificationList } from '../../../redux/app/reducer'
import pathName from '../../../routing/pathName.constant'
import { length } from '../../../utils/javascript'
import { getNotificationsApi } from '../notification.api'

const notifications = () => {
  const infiniteRef = useRef(null)
  const { navigate } = useRouter()
  const { selector, dispatch } = useRedux()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const notificationsList = selector(state => state.app.notificationsList)

  const getNotification = async ({ pageNo = 1, append = false }) => {
    if (isLoadingMore || (!hasMore && append)) return

    if (append) {
      setIsLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const response = await getNotificationsApi({ pageNo })
      if (response?.data) {
        const responseData = response.data
        const newList = responseData?.list || []
        const totalCount = responseData?.fullCount || 0
        const currentListLength = notificationsList?.list?.length || 0
        const notificationList =
          pageNo === 1
            ? responseData?.list
            : [...notificationsList?.list, ...responseData?.list]

        dispatch(
          setNotificationList({ ...responseData, list: notificationList }),
        )

        // Check if there's more data to load
        const hasMoreData = currentListLength + newList.length < totalCount
        setHasMore(hasMoreData)
        setCurrentPage(pageNo)
      }
    } catch (error) {
    } finally {
      if (append) {
        setIsLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleScroll = () => {
    if (!infiniteRef.current || isLoadingMore || !hasMore) return

    const container = infiniteRef.current
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Load more when user scrolls to within 100px of bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      getNotification({ pageNo: currentPage + 1, append: true })
    }
  }

  useEffect(() => {
    const container = infiniteRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage, hasMore, isLoadingMore, notificationsList])

  // Initial load
  useEffect(() => {
    if (!notificationsList?.list || length(notificationsList?.list) === 0) {
      getNotification({ pageNo: 1, append: false })
    }
  }, [])

  const handleNotificationClick = notification => {
    navigate(
      pathName.EDIT_JOB.replace(
        ':jobId',
        notification?.notificationContentDto?.jobId,
      ).replace(':jobType', 'inspection'),
      { state: { fromNotification: true } },
    )
  }

  return {
    notificationsList: notificationsList?.list,
    infiniteRef,
    loading,
    isLoadingMore,
    handleNotificationClick,
    getNotification,
  }
}

export default notifications
