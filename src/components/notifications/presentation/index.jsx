import { List } from 'antd'
import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import { isEqual, length } from '../../../utils/javascript'
import notifications from '../container/notifications.container'
import '../notification.scss'

const Notifications = () => {
  const { t } = useTranslations()
  const {
    notificationsList,
    infiniteRef,
    loading = false,
    handleNotificationClick,
    isLoadingMore = false,
  } = notifications()

  return (
    <>
      <h2>{t('txt_Notifications')}</h2>
      <div className="notifications-container mt-15" ref={infiniteRef}>
        <List>
          {notificationsList && length(notificationsList)
            ? notificationsList?.map(notification => {
                const isRevertJob = isEqual(notification?.type, 'REVERT_JOB')
                return (
                  <div
                    key={notification?.id}
                    className={`item-container ${!notification?.read ? 'new' : ''} ${
                      isEqual(notification?.type, 'HOSTEL_REASSOCIATION')
                        ? 'revert-assign-job'
                        : isRevertJob
                          ? 'revert-job'
                          : ''
                    }`}
                    onClick={
                      isRevertJob
                        ? undefined
                        : () => handleNotificationClick(notification)
                    }
                  >
                    <List.Item key={notification?.id}>
                      <div className={`item-wrapper type-job`}>
                        <p>
                          {t(
                            isEqual(notification?.type, 'HOSTEL_REASSOCIATION')
                              ? 'msg_hostelReAssignedForInspection'
                              : isRevertJob
                                ? 'msg_JobRevertedForInspection'
                                : 'msg_hostelAssignedForInspection',
                            {
                              hostelName:
                                notification?.notificationContentDto
                                  ?.hostelName,
                            },
                          )}
                        </p>
                      </div>
                    </List.Item>
                  </div>
                )
              })
            : !loading && <List.Item>{t('noData')}</List.Item>}
        </List>
        <div className="text-center"> {isLoadingMore && <ANTDSpin />}</div>
      </div>
    </>
  )
}

export default Notifications
