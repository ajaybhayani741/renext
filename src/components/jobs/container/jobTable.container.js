import { useMemo, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import pathName from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import ANTDProgress from '../../../shared/antd/ANTDProgress'
import ANTDTag from '../../../shared/antd/ANTDTag'
import { addressFormat } from '../../../utils'
import { userWiseRole } from '../../../utils/constant'
import { downloadReport } from '../../../utils/customFunctions'
import { dateFormat } from '../../../utils/dateFormat'
import { dayJs } from '../../../utils/dayjs'
import { DownloadOutlined } from '../../../utils/icons'
import { include, isEqual, length, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { inspectionOfficerMandalOptions } from '../../userManagement/user.description'
import { columnKeys, jobStatusList, tabKeys } from '../jobs.description'

const jobTable = ({
  displayColKeys,
  onViewClick,
  checkEditPermission,
  jobType,
  selectedJobs,
  handleSelectChange,
  readyOnly,
  handleDisAssociateModal,
  handleRevertJobModal,
  userView,
  showActionColumn = true,
}) => {
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const userData = JSON.parse(getItem('userData'))
  const { roleId, id: loginUserId } = { ...userData }
  const { districtCollector, inspectionOfficer, mandalSpecialOfficer } =
    userWiseRole
  const activeTab = selector(state => state?.jobs?.activeTab)
  const isMobile = selector(state => state.app.isMobile)
  const isCompletedInspectionJob =
    isEqual(jobType, tabKeys.inspection) &&
    isEqual(activeTab?.status, tabKeys.complete)
  const [reportDownloadModal, setReportDownloadModal] = useState({
    open: false,
    data: '',
  })

  const navigateToEditJob = ({ rowData, restart = false }) => {
    navigate(
      pathName.EDIT_JOB.replace(':jobId', rowData?.id).replace(
        ':jobType',
        jobType,
      ),
      { state: { status: rowData?.status, ...(restart && { restart: true }) } },
    )
  }

  const actionButtons = rowData => {
    const isAssignedMsoRow =
      isEqual(roleId, mandalSpecialOfficer) &&
      isEqual(activeTab?.status, tabKeys.active) &&
      isEqual(rowData?.userId, loginUserId)

    return (
      <div className={!isMobile ? '' : 'mobile-action-buttons'}>
        {(isEqual(roleId, districtCollector) ||
          isEqual(roleId, mandalSpecialOfficer)) &&
          isEqual(jobType, tabKeys.inspection) &&
          isEqual(activeTab?.status, tabKeys.active) && (
            <ANTDButton
              className="bg-danger"
              onClick={() => handleDisAssociateModal({ rowData })}
            >
              {t('btn_DisAssociate')}
            </ANTDButton>
          )}
        <div className="mb-5" />
        <ANTDButton
          className="bg-view"
          onClick={() => onViewClick(rowData?.id)}
        >
          {t(
            isEqual(activeTab?.status, tabKeys.complete)
              ? 'job_ViewInspection'
              : 'job_viewInspectionStatus',
          )}
        </ANTDButton>
        <div className="mb-5" />
        {(isAssignedMsoRow ||
          (checkEditPermission && checkEditPermission(rowData))) && (
          <ANTDButton
            className="bg-start"
            onClick={() => navigateToEditJob({ rowData })}
          >
            {t(
              include([inspectionOfficer, mandalSpecialOfficer], roleId)
                ? rowData?.latitude || rowData?.longitude
                  ? 'job_EditInspection'
                  : 'job_startInspectionJob'
                : 'btn_Edit',
            )}
          </ANTDButton>
        )}
        <div className="mb-5" />
        {isEqual(activeTab?.status, tabKeys.active) &&
          (isAssignedMsoRow || isEqual(roleId, inspectionOfficer)) && (
            <ANTDButton
              className="bg-assign-hostel"
              onClick={() => navigateToEditJob({ rowData, restart: true })}
            >
              {t('job_RestartInspection')}
            </ANTDButton>
          )}
        {isEqual(activeTab?.status, tabKeys.complete) &&
          isEqual(jobType, tabKeys.inspection) &&
          include([districtCollector, inspectionOfficer], roleId) && (
            <ANTDButton
              className="download-btn"
              onClick={() => {
                handleDownloadReportModal(rowData)
              }}
            >
              {t('btn_Download')} <DownloadOutlined />
            </ANTDButton>
          )}
        <div className="mb-5" />
        {isEqual(activeTab?.status, tabKeys.complete) &&
          isEqual(jobType, tabKeys.inspection) &&
          isEqual(roleId, districtCollector) && (
            <>
              <ANTDButton
                className="bg-revert"
                onClick={() => handleRevertJobModal({ rowData })}
              >
                {t('job_Revert')}
              </ANTDButton>
            </>
          )}
      </div>
    )
  }

  const allColumns = useMemo(
    () => [
      {
        title: null,
        key: 'select',
        render: rowData => {
          const selectedList = selectedJobs?.map(v => v?.id)
          return (
            <ANTDCheckbox
              value={rowData}
              onChange={handleSelectChange}
              checked={include(selectedList, rowData?.id)}
            />
          )
        },
        hidden: !handleSelectChange,
      },
      // {
      //   title: '',
      //   key: columnKeys.read,
      //   render: rowData => {
      //     return (
      //       <div className="blink-btn">
      //         {rowData?.read ? null : (
      //           <div className="blink-btn">
      //             <ANTDButton>{t('txt_New')}</ANTDButton>
      //           </div>
      //         )}
      //       </div>
      //     )
      //   },
      //   hidden: isEqual(activeTab?.status, tabKeys.complete),
      // },
      {
        title: t('job_Id'),
        key: columnKeys.jobId,
        dataIndex: 'id',
        ellipsis: true,
      },
      // {
      //   title: t('job_Title'),
      //   key: columnKeys.jobTitle,
      //   dataIndex: 'jobTitle',
      //   render: rowData => {
      //     return <p>{rowData || '-'}</p>
      //   },
      // },
      {
        title: t('user_CreationDate'),
        key: columnKeys.createdDate,
        dataIndex: 'creationDate',
        render: rowData => {
          return <>{rowData ? dayJs(rowData).format('DD/MM/YYYY') : '-'}</>
        },
      },
      {
        title: t('job_CompletionDate'),
        key: columnKeys.completionDate,
        dataIndex: 'modificationDate',
        render: rowData => {
          return <>{rowData ? dayJs(rowData).format('DD/MM/YYYY') : '-'}</>
        },
      },
      {
        title: t('user_Hostel'),
        key: columnKeys.hostel,
        dataIndex: 'hostelInfo',
        ellipsis: true,
        render: rowData => rowData?.lastName || '-',
      },
      {
        title: t('mso_Mandal'),
        key: columnKeys.mandal,
        dataIndex: 'hostelInfo',
        ellipsis: true,
        render: rowData =>
          inspectionOfficerMandalOptions.find(
            option => option.value === rowData?.mandal,
          )?.label ||
          rowData?.mandal ||
          '-',
      },
      {
        title: t('user_InspectionOfficer'),
        key: columnKeys.inspectionOfficer,
        dataIndex: 'userInfo',
        ellipsis: true,
        render: rowData => rowData?.lastName || '-',
      },
      {
        title: t('mso_Designation'),
        key: columnKeys.designation,
        dataIndex: 'userInfo',
        ellipsis: true,
        render: rowData => rowData?.designation || '-',
      },
      {
        title: t('user_HostelAddress'),
        key: columnKeys.hostelAddress,
        dataIndex: 'hostelInfo',
        width: '250px',
        render: rowData => {
          return addressFormat(rowData)
        },
      },

      // {
      //   title: t('user_Contact'),
      //   key: columnKeys.hostelContact,
      //   dataIndex: 'hostelInfo',
      //   ellipsis: true,
      //   render: rowData => rowData?.phoneNumber || '-',
      // },

      {
        title: t('job_CreationName'),
        key: columnKeys.creationName,
        ellipsis: true,
        render: rowData =>
          rowData?.creationName ||
          rowData?.createdByName ||
          rowData?.creatorName ||
          rowData?.createdBy?.lastName ||
          rowData?.createdBy?.businessName ||
          rowData?.createdByUser?.lastName ||
          rowData?.createdByUser?.businessName ||
          '-',
      },

      {
        title: t('job_UpdatedDate'),
        key: columnKeys.updatedDate,
        dataIndex: 'modificationDate',
        render: rowData => {
          return <>{rowData ? dateFormat(rowData)?.dmyDate : '-'}</>
        },
      },
      {
        title: t('job_Status'),
        key: columnKeys.status,
        // dataIndex: 'status',
        className: 'nowrap',
        render: rowData => {
          const progress = Number(rowData?.progressPercentage || 0) || 0
          return isEqual(activeTab?.status, tabKeys.active) ? (
            <ANTDProgress
              percent={Number(rowData?.progressPercentage || 0) || 0}
              percentPosition={{ align: 'center', type: 'inner' }}
              size={[100, 20]}
              strokeColor={
                progress > 0 && progress < 100 ? '#40A368' : '#FA8128'
              }
            />
          ) : (
            <ANTDTag
              className={`pl-15 pr-15 fs-14 py-5 br-10 ${
                include(rowData?.status, 'COMPLETED')
                  ? 'color-white'
                  : 'color-black'
              }`}
              color={
                include(rowData?.status, 'INPROGRESS')
                  ? '#FA8128'
                  : include(rowData?.status, 'COMPLETED')
                    ? '#40A368'
                    : ''
              }
            >
              {rowData?.status
                ? t(jobStatusList?.[rowData?.status]) || rowData?.status
                : ''}
            </ANTDTag>
          )
        },
      },
      {
        title: t('txt_Action'),
        key: columnKeys.action,
        width: 150,
        className: 'job-action-column',
        fixed: 'right',
        render: actionButtons,
        hidden: !showActionColumn,
      },
    ],
    [
      onViewClick,
      selectedJobs,
      isCompletedInspectionJob,
      showActionColumn,
      activeTab?.status,
      roleId,
      loginUserId,
    ],
  )

  const columns = ternary(
    length(displayColKeys),
    allColumns.filter(col => {
      col.align = 'center'
      return include(
        [
          ...displayColKeys,
          ...(readyOnly || !showActionColumn
            ? []
            : [columnKeys.action, columnKeys.read]),
        ],
        col.key,
      )
    }),
    [],
  )

  const cardViewFn = ({
    id,
    creationDate,
    modificationDate,
    jobTitle,
    hostelInfo = {},
    ...jobData
  }) => {
    return [
      // { label: 'job_Title', value: jobTitle },
      {
        label: isCompletedInspectionJob
          ? 'job_CompletionDate'
          : 'user_CreationDate',
        value: isCompletedInspectionJob
          ? modificationDate
            ? dateFormat(modificationDate)?.dmyDate
            : '-'
          : creationDate
            ? dayJs(creationDate).format('DD/MM/YYYY HH:mm A')
            : '-',
      },
      { label: 'job_hostelName', value: hostelInfo?.lastName },
      { label: 'mso_Mandal', value: hostelInfo?.mandal },
      {
        label: 'user_InspectionOfficer',
        value: jobData?.userInfo?.lastName,
      },
      {
        label: 'mso_Designation',
        value: jobData?.userInfo?.designation,
      },

      { label: 'job_Status', value: jobData?.status },
    ].filter(item => !item.hidden)
  }

  const handleDownloadReportModal = data => {
    setReportDownloadModal({
      open: !reportDownloadModal?.open,
      data: data || null,
    })
  }

  const downloadReportFn = (data, type) => {
    if (!data) {
      notifyMethod.error({
        message: t('job_InspectionReportNotGenerated'),
      })
      handleDownloadReportModal()
      return
    }
    downloadReport(data?.fileUrl, data?.fileName, type)
    handleDownloadReportModal()
  }

  return {
    t,
    columns,
    isDesktop,
    cardViewFn,
    actionButtons,
    reportDownloadModal,
    handleDownloadReportModal,
    downloadReportFn,
  }
}

export default jobTable
