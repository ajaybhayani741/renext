import React, { useMemo } from 'react'

import AddUser from './AddUser'
import UserTableCard from './UserTableCard'
import ViewUser from './ViewUser'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { ANTDSearch } from '../../../shared/antd/ANTDInput'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import Label from '../../../shared/Label'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { include, isEqual, ternary } from '../../../utils/javascript'
import userColumns from '../container/userColumn'
import userTable from '../container/userTable.container'
import { inspectionOfficerMandalOptions } from '../user.description'

function UserTable({
  roleId,
  isSearch = false,
  userData,
  customerInfo,
  permission,
  handleTableChange,
  className,
  rowClassNameFn = null,
  payload,
  handleSelect = null,
  multiSelect = null,
  pagination = true,
  isBuilding,
  title,
  selectedList,
  onSelect,
  removeEditBtn,
  apiCall,
  searchByEmail,
  isCardView,
  handleAssignInspectionOfficer,
  handleAssignToSelf,
  showAssignInspectionOfficer,
  columnFilter,
  showAssignHostel = true,
  handleAssignHostel,
  userKey,
  getUsersData = null,
  searchPayload = null,
  tableScroll = null,
  showSearchBySection = true,
}) {
  const {
    viewModel,
    isDesktop,
    searchResult,
    searchBy,
    handleSearchByChange,
    onMandalSearch,
    handleView,
    handleCancel,
    handleEdit,
    selectedUsers,
    handleSelectChange,
    onSearch,
    handleSearchTableChange,
    editInfo,
    setEditInfo,
    handleCancelEdit,
    assignConfirmation,
    handleAssignHostelConfirmation,
  } = userTable({
    payload,
    multiSelect,
    isBuilding,
    searchByEmail,
    getUsersData,
    searchPayload,
    userData,
  })

  const { column, actionButtons, cardViewFn } = userColumns({
    showAssignHostel,
    permission,
    handleView,
    roleId: roleId || payload?.roleId,
    selectedUsers: selectedList || selectedUsers,
    handleSelectChange: ternary(
      handleSelect,
      handleSelectChange,
      onSelect || null,
    ),
    handleEdit,
    isBuilding,
    removeEditBtn,
    handleAssignHostelConfirmation,
    handleAssignInspectionOfficer,
    handleAssignToSelf,
    showAssignInspectionOfficer,
    handleAssignHostel,
    columnFilter,
    userKey,
  })
  const { t } = useTranslations()
  const { inspectionOfficer, mandalSpecialOfficer } = userWiseRole
  const showRoleSearch = include(
    [inspectionOfficer, mandalSpecialOfficer],
    payload?.roleId,
  )
  const searchByOptions = [
    { label: t('user_Name'), value: 'name' },
    { label: t('mso_Mandal'), value: 'mandal' },
  ]

  if (isSearch && searchResult.data) {
    userData = searchResult.data
    handleTableChange = handleSearchTableChange
  }

  const { loader, list } = userData || { loader: false, list: [] }
  const pageSize = 10

  const viewUserFN = useMemo(
    () =>
      viewModel?.open && (
        <ViewUser
          {...{
            open: viewModel?.open,
            userDetails: viewModel?.userDetails,
            handleCancel,
          }}
        />
      ),
    [viewModel?.open],
  )
  return (
    <div className={className}>
      {ternary(
        handleSelect,
        <div className="text-end">
          <ANTDButton
            className="submit-btn mb-10"
            type="primary"
            onClick={() => handleSelect(selectedUsers)}
          >
            {t('msg_OK')}
          </ANTDButton>
        </div>,
        null,
      )}
      {title && <h3 style={{ marginBottom: '12px' }}>{t(title)}</h3>}
      <>
        {ternary(
          isSearch && showSearchBySection,
          showRoleSearch ? (
            <ANTDRow gutter={10}>
              <ANTDColumn md={12} lg={12} xs={24}>
                <Label text={t('job_SearchBy')} />
                <ANTDSelect
                  className="w-100 mb-5"
                  value={searchBy}
                  options={searchByOptions}
                  onChange={handleSearchByChange}
                />
              </ANTDColumn>
              <ANTDColumn md={12} lg={12} xs={24}>
                <Label text={t('txt_Search')} />
                {isEqual(searchBy, 'mandal') ? (
                  <ANTDSelect
                    className="w-100 mb-5"
                    placeholder={t('mso_Mandal')}
                    options={inspectionOfficerMandalOptions}
                    onChange={onMandalSearch}
                    allowClear
                  />
                ) : (
                  <ANTDSearch
                    className="mb-5"
                    placeholder={t('user_Name')}
                    onChange={onSearch}
                  />
                )}
              </ANTDColumn>
            </ANTDRow>
          ) : (
            <ANTDSearch
              className="w-100"
              placeholder={t(
                ternary(
                  searchByEmail,
                  'user_SearchEmail',
                  ternary(
                    include(childUsers, payload?.roleId),
                    'user_Name',
                    'user_BusinessName',
                  ),
                ),
              )}
              onChange={onSearch}
            />
          ),
          null,
        )}
      </>
      <div className="mt-5 user-table-card">
        {ternary(
          !isCardView && isDesktop,
          <ANTDTable
            rowClassName={rowClassNameFn && (record => rowClassNameFn(record))}
            loading={loader || searchResult.loader}
            columns={column}
            size="medium"
            dataSource={
              list?.map(val => ({
                ...val,
                key: val?.id,
              })) || []
            }
            pagination={
              pagination
                ? {
                    lastFetched: userData?.pageNo,
                    current: userData?.pageNo,
                    pageSize: pageSize,
                    total: userData?.lastPage * pageSize,
                    responsive: true,
                  }
                : false
            }
            onChange={handleTableChange}
            scroll={tableScroll}
            className="user-table"
          />,
          <UserTableCard
            data={userData}
            actionButtons={actionButtons}
            cardViewFn={cardViewFn}
            pageSize={pageSize}
            onChange={handleTableChange}
            loader={loader}
            handleSelectChange={ternary(
              handleSelect,
              handleSelectChange,
              onSelect || null,
            )}
            selectedUsers={selectedList || selectedUsers}
            roleId={payload?.roleId}
          />,
        )}
      </div>
      {viewUserFN}
      {editInfo?.flag && (
        <ANTDModal
          title={t('btn_Edit')}
          centered
          open={editInfo?.flag}
          onCancel={handleCancelEdit}
          footer={false}
          width={1000}
        >
          <AddUser
            {...{
              editInfo,
              setEditInfo,
              handleCancelEdit,
              isBuilding,
              userDetails: customerInfo,
              apiCall,
            }}
          />
        </ANTDModal>
      )}
      {assignConfirmation?.open && (
        <PopUpConfirm
          isOpen={assignConfirmation?.open}
          onCancelModel={handleAssignHostelConfirmation}
          onAccept={handleAssignHostel}
          onReject={handleAssignHostelConfirmation}
          description={t('msg_AreYouSureWantToAssign')}
        />
      )}
    </div>
  )
}

export default UserTable
