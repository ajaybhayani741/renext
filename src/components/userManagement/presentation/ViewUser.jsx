import classNames from 'classnames'
import { Fragment, memo } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { entries, include, ternary } from '../../../utils/javascript'
import JobManagement from '../../jobs/presentation'
import viewUser from '../container/viewUser.container'
import { userTranslationKey } from '../user.description'
import BasicInfo from './BasicInfo'
import UserList from './UserList'
import UserRating from './UserRating'

const ViewUser = ({
  open,
  userDetails,
  hasAction,
  handleCancel,
  editButtons,
}) => {
  const {
    parentData,
    otherDetail,
    userListView,
    basicInfoData,
    parentInfoData,
    loginUserRoleId,
    getEmailList,
  } = viewUser({
    userDetails,
  })

  const { hostel, inspectionOfficer, districtCollector } = userWiseRole

  const { t } = useTranslations()
  const isChildUser =
    !include([hostel, inspectionOfficer], userDetails?.roleId) &&
    childUsers.includes(userDetails?.roleId)

  const viewDetails = () => {
    return (
      <div className="view-user-modal">
        <div
          className={classNames('content-title-wrapper', {
            'title-text': hasAction,
          })}
        >
          <h2 className="content-title">{t('user_BasicInformation')}</h2>
          {hasAction && editButtons && (
            <div className="header-buttons">{editButtons}</div>
          )}
        </div>
        <BasicInfo
          {...{
            basicInfoData,
            userDetails,
            getEmailList,
            ...(!isChildUser && { otherDetail }),
          }}
        />
        {isChildUser && (
          <>
            <h2 className="content-title">{t('user_ParentInformation')}</h2>
            <BasicInfo
              {...{
                basicInfoData: parentInfoData,
                otherDetail: otherDetail.slice(0, 2),
                userDetails: parentData,
                getEmailList,
              }}
            />
          </>
        )}

        {!include(
          [hostel, inspectionOfficer, districtCollector],
          userDetails?.roleId,
        ) && <UserRating />}

        {userListView &&
          entries(userListView).map(([key, value]) => {
            if (value?.some(v => v?.hideInProfile)) return null
            return (
              <Fragment key={key}>
                <h2 className="content-title">{t(key)}</h2>
                {value.map((v, i) => {
                  const showAdd =
                    v?.isBuilding || include(v?.addAssociate, loginUserRoleId)
                  const payload = {
                    ...v?.payload,
                    userId: ternary(
                      v?.needParent,
                      userDetails?.adminId,
                      userDetails?.id,
                    ),
                  }
                  return (
                    <Fragment key={i}>
                      {v?.viewJobs ? (
                        <JobManagement
                          userView={true}
                          userId={userDetails?.id}
                          userJobType={v?.payload?.jobType}
                        />
                      ) : (
                        <UserList
                          key={i}
                          payload={payload}
                          showAdd={showAdd}
                          subTitle={v?.subTitle}
                          isBuilding={v?.isBuilding}
                          userDetails={userDetails}
                          className="mb-15"
                          showAssignHostel={false}
                          userKey={key}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </Fragment>
            )
          })}
      </div>
    )
  }

  return (
    <div>
      {open ? (
        <ANTDModal
          title={`${t(userTranslationKey[userDetails?.roleId])} ${t('txt_Details')}`}
          centered
          open={open}
          onCancel={handleCancel}
          footer={false}
          width={1000}
        >
          {viewDetails()}
        </ANTDModal>
      ) : (
        viewDetails()
      )}
    </div>
  )
}

export default memo(ViewUser)
