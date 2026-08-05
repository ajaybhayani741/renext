import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { setNotificationList } from '../../../redux/app/reducer'
import pathName from '../../../routing/pathName.constant'
import { getNotificationsApi } from '../notification.api'

const NOTIFICATIONS_CONTAINER_ID = 'notifications-scroll-container'

const notifications = () => {
  const { navigate } = useRouter()
  const { selector, dispatch } = useRedux()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const notificationsList = selector(state => state.app.notificationsList)

  const getNotification = async ({ pageNo = 1 }) => {
    const append = pageNo > 1

    if (append && !hasMore) return

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
        const responseLastPage = Number(responseData?.lastPage) || pageNo
        const currentList = append ? notificationsList?.list || [] : []
        const notificationList =
          pageNo === 1 ? newList : [...currentList, ...newList]

        dispatch(
          setNotificationList({ ...responseData, list: notificationList }),
        )

        setLastPage(responseLastPage)
        setHasMore(pageNo < responseLastPage)
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

  const loadNextPage = () => {
    setCurrentPage(pageNo =>
      pageNo === currentPage && pageNo < lastPage ? pageNo + 1 : pageNo,
    )
  }

  const handleScroll = event => {
    if (loading || isLoadingMore || !hasMore) return

    const container = event.currentTarget
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight

    // Load more when user scrolls to within 100px of bottom
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadNextPage()
    }
  }

  useEffect(() => {
    getNotification({ pageNo: currentPage })
  }, [currentPage])

  useEffect(() => {
    if (loading || isLoadingMore || !hasMore) return

    const checkScroll = setTimeout(() => {
      const container = document.getElementById(NOTIFICATIONS_CONTAINER_ID)
      if (!container) return

      const hasScroll = container.scrollHeight > container.clientHeight
      if (!hasScroll) {
        loadNextPage()
      }
    }, 0)

    return () => clearTimeout(checkScroll)
  }, [notificationsList?.list?.length, loading, isLoadingMore, hasMore])

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
    loading,
    isLoadingMore,
    notificationContainerProps: {
      id: NOTIFICATIONS_CONTAINER_ID,
      onScroll: handleScroll,
    },
    handleNotificationClick,
    getNotification,
  }
}

export default notifications
