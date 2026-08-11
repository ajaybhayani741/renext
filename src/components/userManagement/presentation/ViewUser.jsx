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

const ViewUser = ({
  open,
  userDetails,
  hasAction,
  handleCancel,
  editButtons,
  viewDepth = 0,
  maxViewDepth = 2,
}) => {
  const {
    otherDetail,
    userListView,
    basicInfoData,
    loginUserRoleId,
    getEmailList,
  } = viewUser({
    userDetails,
  })

  const { hostel, inspectionOfficer } = userWiseRole

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
        {/* {isChildUser && (
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
        )} */}

        {/* {!include(
          [hostel, inspectionOfficer, districtCollector],
          userDetails?.roleId,
        ) && <UserRating />} */}

        {userListView &&
          entries(userListView).map(([key, value]) => {
            if (value?.some(v => v?.hideInProfile)) return null
            const sectionTitle = value?.[0]?.sectionTitle || key
            return (
              <Fragment key={key}>
                <h2 className="content-title">{t(sectionTitle)}</h2>
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
                          viewDepth={viewDepth}
                          maxViewDepth={maxViewDepth}
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
                          viewDepth={viewDepth}
                          maxViewDepth={maxViewDepth}
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
          className="view-user-details-modal"
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


