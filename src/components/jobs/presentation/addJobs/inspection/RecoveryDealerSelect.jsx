import React from 'react'
import { useMatch } from 'react-router-dom'

import { notifyMethod } from '../../../../../App'
import useTranslations from '../../../../../hooks/useTranslations'
import pathName from '../../../../../routing/pathName.constant'
import ANTDButton from '../../../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../../../shared/antd/ANTDCheckbox'
import {
  ANTDFormItem,
  useFormInstanceFn,
  useWatchFn,
} from '../../../../../shared/antd/ANTDForm'
import { ANTDSearch } from '../../../../../shared/antd/ANTDInput'
import ANTDModal from '../../../../../shared/antd/ANTDModal'
import ANTDSelect from '../../../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../../../shared/antd/ANTDTable'
import MandatoryTag from '../../../../../shared/MandatoryTag'
import { noImage } from '../../../../../utils/icons'
import { include, isEqual, length } from '../../../../../utils/javascript'
import userTable from '../../../../userManagement/container/userTable.container'
import ViewUser from '../../../../userManagement/presentation/ViewUser'
import jobUserSelect from '../../../container/jobUserSelect.container'

const RecoveryDealerSelect = ({
  roleId,
  userData,
  apiPayload,
  userIndex,
  onSelectUser,
  onUserClear,
  disableClear,
  disableSelect,
  showSelf,
  onSelfUser,
  fieldPath,
  readOnly,
  mandatory,
  label,
  fieldKey,
  currentForm,
}) => {
  const { t } = useTranslations()
  const matchRoute = useMatch(pathName.PUBLIC_JOB_DETAILS)
  const isPublicPage = Boolean(matchRoute)

  const form = currentForm ? currentForm : useFormInstanceFn()
  const userLocation = length(fieldPath)
    ? useWatchFn(['recoverList', ...fieldPath, fieldKey], {
        form,
        preserve: true,
      })
    : null
  const { selectUserModal, onModelClose, handleSelectUserPopup } =
    jobUserSelect({ roleId, apiPayload })

  const {
    viewModel,
    searchResult,
    handleView,
    handleCancel,
    selectedUsers,
    handleSelectChange,
    onSearch,
    // handleSearchTableChange,
  } = userTable({ payload: apiPayload })

  let handleTableChange = e =>
    handleSelectUserPopup({
      pageNo: e?.current,
      parent: true,
    })

  // if (searchResult.data) {
  //   userData = searchResult.data
  //   handleTableChange = handleSearchTableChange
  // }

  const onSelectConfirm = async () => {
    if (!length(selectedUsers))
      return notifyMethod.warning({ message: 'msg_SelectUser' })

    try {
      await form.validateFields(
        [
          [
            'recoverList',
            ...fieldPath,
            fieldKey,
            selectedUsers?.[0]?.id?.toString(),
          ],
        ],
        { recursive: true },
      )
    } catch (error) {
      return
    }

    onSelectUser({ data: selectedUsers, userIndex, roleId })
    onModelClose()
  }

  const column = ({ readOnly, handleSelectChange }) =>
    [
      {
        title: null,
        key: 'select',
        render: rowData => {
          const usersList = selectedUsers?.map(v => v?.id)
          return (
            <ANTDCheckbox
              value={rowData}
              onChange={handleSelectChange}
              checked={include(usersList, rowData?.id)}
            />
          )
        },
        hidden: !handleSelectChange,
      },
      {
        title: t('user_ID'),
        dataIndex: 'id',
        key: 'user_ID',
      },
      {
        title: t('user_Image'),
        dataIndex: 'profileUrl',
        className: 'img-td',
        key: 'user_Image',
        render: rowData => {
          return (
            <div className="small-img-wrap">
              <img src={rowData || noImage} alt={'pic'} />
            </div>
          )
        },
      },
      {
        title: t('user_BusinessName'),
        dataIndex: 'businessName',
        key: 'user_BusinessName',
        className: 'business-name',
        render: rowData => {
          return rowData || '-'
        },
      },
      {
        title: t('user_State'),
        key: 'user_State',
        width: '150px',
        hidden: include(['job_SelectDealer', 'user_Dealer'], label),
        render: rowData => {
          return !readOnly ? (
            <ANTDFormItem
              className="mb-0"
              name={[
                ...fieldPath,
                fieldKey,
                rowData?.id?.toString(),
                'userStateId',
              ]}
              rules={[{ required: true, message: t('error_FieldISRequire') }]}
            >
              <ANTDSelect
                className="w-100"
                options={rowData?.userLocationChannelDtos?.map(v => ({
                  label: v?.stateName,
                  value: v?.stateId,
                }))}
              />
            </ANTDFormItem>
          ) : (
            rowData?.userLocationChannelDtos?.find(({ locationId } = {}) =>
              isEqual(locationId, userLocation?.[rowData?.id]?.userLocationId),
            )?.stateName ||
              rowData?.userJobLocationChannelDto?.stateName ||
              '-'
          )
        },
      },
      {
        title: t('inv_Location'),
        key: 'inv_Location',
        width: '150px',

        render: rowData => {
          return !readOnly ? (
            <ANTDFormItem
              className="mb-0"
              name={[
                ...fieldPath,
                fieldKey,
                rowData?.id?.toString(),
                'userLocationId',
              ]}
              rules={[{ required: true, message: t('error_FieldISRequire') }]}
            >
              <ANTDSelect
                className="w-100"
                options={rowData?.userLocationChannelDtos?.map(v => ({
                  label: v?.locationName,
                  value: v?.locationId,
                }))}
              />
            </ANTDFormItem>
          ) : (
            rowData?.userLocationChannelDtos?.find(({ locationId } = {}) =>
              isEqual(locationId, userLocation?.[rowData?.id]?.userLocationId),
            )?.locationName ||
              rowData?.userJobLocationChannelDto?.locationName ||
              '-'
          )
        },
      },
      {
        title: t('user_Channel'),
        key: 'user_Channel',
        width: '150px',
        render: rowData => {
          const channelList = rowData?.userLocationChannelDtos?.find(
            ({ locationId } = {}) =>
              isEqual(locationId, userLocation?.[rowData?.id]?.userLocationId),
          )?.channels
          return !readOnly ? (
            <ANTDFormItem
              className="mb-0"
              name={[
                ...fieldPath,
                fieldKey,
                rowData?.id?.toString(),
                'userChannelId',
              ]}
              rules={[{ required: true, message: t('error_FieldISRequire') }]}
            >
              <ANTDSelect
                className="w-100"
                options={channelList?.map(v => ({
                  label: v?.channelKey,
                  value: v?.channelId,
                }))}
              />
            </ANTDFormItem>
          ) : (
            channelList?.find(({ channelId } = {}) =>
              isEqual(channelId, userLocation?.[rowData?.id]?.userChannelId),
            )?.channelKey ||
              rowData?.userJobLocationChannelDto?.channels?.[0]?.channelKey ||
              '-'
          )
        },
      },
      {
        title: t('txt_Action'),
        key: 'txt_Action',
        hidden: isPublicPage,
        render: rowData => {
          return (
            <div className="flex-nowrap d-flex">
              <ANTDButton
                className="bg-view"
                onClick={() => handleView(rowData)}
              >
                {t('btn_View')}
              </ANTDButton>
            </div>
          )
        },
      },
    ].filter(v => !v?.hidden)

  const tableUI = ({
    readOnly,
    userData,
    handleTableChange = null,
    pagination,
    handleSelectChange,
  }) => {
    const { loader, list } = userData || { loader: false, list: [] }
    const pageSize = 5

    return (
      <>
        <div className="mt-10 user-table-card">
          <ANTDTable
            className="user-table"
            loading={loader || searchResult.loader}
            columns={column({ readOnly, handleSelectChange })}
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
            scroll={{ x: 'max-content' }}
          />
        </div>
      </>
    )
  }

  return (
    <div className="mb-20">
      <div className="mb-10 d-flex space-between title">
        <h3>
          {mandatory && <MandatoryTag />}
          {t(label)}
        </h3>
        {!readOnly && (
          <ANTDButton
            type="primary"
            className="btn"
            disabled={disableSelect}
            onClick={() =>
              handleSelectUserPopup({
                userId: roleId,
                index: userIndex,
                parent: true,
              })
            }
          >
            {t('btn_Select')}
          </ANTDButton>
        )}
      </div>
      {tableUI({
        readOnly: true,
        userData: { list: userData },
        pagination: false,
      })}
      {!readOnly && (
        <div className="mt-10">
          {showSelf ? (
            <ANTDButton
              type="link"
              onClick={() => onSelfUser(roleId, userIndex)}
            >
              {t('user_Self')}
            </ANTDButton>
          ) : (
            <ANTDButton
              type="primary"
              className="btn"
              onClick={() => onUserClear(roleId, userIndex)}
              disabled={disableClear}
            >
              {t('txt_Clear')}
            </ANTDButton>
          )}
        </div>
      )}

      <ANTDModal
        title={t('btn_Select')}
        open={selectUserModal?.isOpen}
        onCancel={onModelClose}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <div className="d-flex space-between">
          <ANTDButton
            className="btn mb-10"
            type="primary"
            onClick={onSelectConfirm}
          >
            {t('msg_OK')}
          </ANTDButton>
        </div>

        <ANTDSearch
          className="w-100"
          placeholder={t('user_BusinessName')}
          onChange={onSearch}
        />

        {tableUI({
          readOnly: false,
          pagination: true,
          userData: selectUserModal?.parent || [],
          handleTableChange,
          handleSelectChange,
        })}
      </ANTDModal>
      {viewModel?.open && (
        <ViewUser
          {...{
            open: viewModel?.open,
            userDetails: viewModel?.userDetails,
            handleCancel,
          }}
        />
      )}
    </div>
  )
}

export default RecoveryDealerSelect
