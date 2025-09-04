import classNames from 'classnames'
import { Fragment, memo } from 'react'

import BasicInfo from './BasicInfo'
import ProductList from './ProductListUserForm'
import UserList from './UserList'
import UserRating from './UserRating'
import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual, ternary } from '../../../utils/javascript'
import viewUser from '../container/viewUser.container'

const ViewUser = ({ open, userDetails, hasAction, handleCancel }) => {
  const {
    parentData,
    otherDetail,
    userListView,
    basicInfoData,
    parentInfoData,
    loginUserRoleId,
    getEmailList,
    handleDeleteModel,
    handleSaveModel,
    vehicleModelData,
    onVehicleModelPageChange,
    PAGE_SIZE,
  } = viewUser({
    userDetails,
  })

  const { t } = useTranslations()
  const { recycler, producer } = userWiseRole
  const isChildUser = childUsers.includes(userDetails?.roleId)

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
        {isEqual(recycler, userDetails?.roleId) && (
          <p
            className="text-end fs-12 mb-10"
            dangerouslySetInnerHTML={{ __html: t('user_InformationMessage') }}
          ></p>
        )}

        {isEqual(producer, userDetails?.roleId) && (
          <ProductList
            handleDeleteModel={handleDeleteModel}
            handleSaveModel={handleSaveModel}
            onPageChange={onVehicleModelPageChange}
            vehicleModels={vehicleModelData?.list}
            pageSize={PAGE_SIZE}
            total={vehicleModelData?.lastPage * PAGE_SIZE}
          />
        )}

        <UserRating />

        {!isChildUser &&
          userListView &&
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
          title={t('txt_Details')}
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
