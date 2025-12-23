import { useMemo } from 'react'

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
import { DownloadOutlined, noImage } from '../../../utils/icons'
import { include, isEqual, length, ternary } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
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
  userView,
}) => {
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const { districtCollector, inspectionOfficer } = userWiseRole
  const activeTab = selector(state => state?.jobs?.activeTab)
  const isMobile = selector(state => state.app.isMobile)

  const actionButtons = rowData => (
    <div className={!isMobile ? '' : 'd-flex flex-nowrap'}>
      {isEqual(roleId, districtCollector) &&
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
      <ANTDButton className="bg-view" onClick={() => onViewClick(rowData?.id)}>
        {t(
          isEqual(activeTab?.status, tabKeys.complete)
            ? 'job_ViewInspection'
            : 'job_viewInspectionStatus',
        )}
      </ANTDButton>
      <div className="mb-5" />
      {checkEditPermission && checkEditPermission(rowData) && (
        <ANTDButton
          className="bg-start"
          onClick={() => {
            navigate(
              pathName.EDIT_JOB.replace(':jobId', rowData?.id).replace(
                ':jobType',
                jobType,
              ),
              { state: { status: rowData?.status } },
            )
          }}
        >
          {t(
            roleId === inspectionOfficer
              ? rowData?.latitude || rowData?.longitude
                ? 'job_EditInspection'
                : 'job_startInspectionJob'
              : 'btn_Edit',
          )}
        </ANTDButton>
      )}
      <div className="mb-5" />
      {isEqual(activeTab?.status, tabKeys.active) &&
        isEqual(roleId, inspectionOfficer) && (
          <ANTDButton
            className="bg-assign-hostel"
            onClick={() => {
              navigate(
                pathName.EDIT_JOB.replace(':jobId', rowData?.id).replace(
                  ':jobType',
                  jobType,
                ),
                { state: { status: rowData?.status, restart: true } },
              )
            }}
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
              if (!rowData?.inspectionJobReportDetails) {
                notifyMethod.error({
                  message: t('job_InspectionReportNotGenerated'),
                })
                return
              }
              downloadReport(
                rowData?.inspectionJobReportDetails?.fileUrl,
                rowData?.inspectionJobReportDetails?.fileName,
              )
            }}
          >
            {t('btn_Download')} <DownloadOutlined />
          </ANTDButton>
        )}
    </div>
  )

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
      {
        title: '',
        key: columnKeys.read,
        render: rowData => {
          return (
            <div className="blink-btn">
              {rowData?.read ? null : (
                <div className="blink-btn">
                  <ANTDButton>{t('txt_New')}</ANTDButton>
                </div>
              )}
            </div>
          )
        },
        hidden: isEqual(activeTab?.status, tabKeys.complete),
      },
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
        title: t('user_Hostel'),
        key: columnKeys.hostel,
        dataIndex: 'hostelInfo',
        ellipsis: true,
        render: rowData => {
          return rowData?.lastName ? (
            <div className="user-image-job">
              <img src={rowData?.profile?.fileUrl || noImage} alt={'pic'} />
              <p>{rowData?.lastName || '-'}</p>
            </div>
          ) : (
            '-'
          )
        },
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
      {
        title: t('user_Contact'),
        key: columnKeys.hostelContact,
        dataIndex: 'hostelInfo',
        ellipsis: true,
        render: rowData => rowData?.phoneNumber || '-',
      },
      {
        title: t('user_InspectionOfficer'),
        key: columnKeys.inspectionOfficer,
        dataIndex: 'userInfo',
        ellipsis: true,
        render: rowData => {
          return rowData?.lastName ? (
            <div className="user-image-job">
              <img src={rowData?.profile?.fileUrl || noImage} alt={'pic'} />
              <p>{rowData?.lastName || '-'}</p>
            </div>
          ) : (
            '-'
          )
        },
      },

      {
        title: t('user_CreationDate'),
        key: columnKeys.createdDate,
        dataIndex: 'creationDate',
        render: rowData => {
          return <>{rowData ? dateFormat(rowData)?.dmyDate : '-'}</>
        },
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
          return isEqual(activeTab?.status, tabKeys.active) ? (
            <ANTDProgress
              percent={Number(rowData?.progressPercentage || 0) || 0}
              percentPosition={{ align: 'center', type: 'inner' }}
              size={[100, 20]}
              strokeColor="#FA8128"
            />
          ) : (
            <ANTDTag
              className="pl-15 pr-15 fs-14 py-5 br-10 color-black"
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
        fixed: 'right',
        render: actionButtons,
      },
    ],
    [onViewClick, selectedJobs],
  )

  const columns = ternary(
    length(displayColKeys),
    allColumns.filter(col => {
      col.align = 'center'
      return include(
        [
          ...displayColKeys,
          ...(readyOnly ? [] : [columnKeys.action, columnKeys.read]),
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
      { label: 'job_Id', value: id },
      // { label: 'job_Title', value: jobTitle },
      { label: 'job_hostelName', value: hostelInfo?.lastName },
      { label: 'user_HostelAddress', value: hostelInfo?.address },
      {
        label: 'user_CreationDate',
        value: dateFormat(creationDate)?.newDate,
      },
      // {
      //   label: 'job_UpdatedDate',
      //   value: dateFormat(modificationDate)?.newDate,
      // },
      { label: 'job_Status', value: jobData?.status },
    ].filter(item => !item.hidden)
  }

  return {
    t,
    columns,
    isDesktop,
    cardViewFn,
    actionButtons,
  }
}

export default jobTable
