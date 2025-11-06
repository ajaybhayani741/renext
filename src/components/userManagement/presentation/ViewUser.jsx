import classNames from 'classnames'
import { Fragment, memo } from 'react'

import BasicInfo from './BasicInfo'
import UserList from './UserList'
import UserRating from './UserRating'
import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual, ternary } from '../../../utils/javascript'
import viewUser from '../container/viewUser.container'
import { userTranslationKey } from '../user.description'

const ViewUser = ({ open, userDetails, hasAction, handleCancel }) => {
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

  const { hostel, inspectionOfficer } = userWiseRole

  const { t } = useTranslations()
  const isChildUser =
    !include([hostel, inspectionOfficer], userDetails?.roleId) &&
    childUsers.includes(userDetails?.roleId)

  const viewDetails = () => {
    return (
      <div className="view-user-modal">
        <h2
          className={classNames('content-title', { 'title-text': hasAction })}
        >
          {t('user_BasicInformation')}
        </h2>
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
            <h2
              className={classNames('content-title', {
                'title-text': hasAction,
              })}
            >
              {t('user_ParentInformation')}
            </h2>
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

        {!include([hostel, inspectionOfficer], userDetails?.roleId) && (
          <UserRating />
        )}

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
                      <UserList
                        key={i}
                        payload={payload}
                        showAdd={showAdd}
                        subTitle={v?.subTitle}
                        isBuilding={v?.isBuilding}
                        userDetails={userDetails}
                        className="mb-15"
                        showAssignHostel={false}
                        userKey={isEqual(key, 'user_Hostel') ? key : null}
                      />
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
          title={`${t('txt_Details')} ${t(userTranslationKey[userDetails?.roleId])}`}
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
