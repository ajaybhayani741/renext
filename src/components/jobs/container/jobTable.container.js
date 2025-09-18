import { useMemo } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import pathName from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { dateFormat } from '../../../utils/dateFormat'
import { noImage } from '../../../utils/icons'
import { include, length, ternary } from '../../../utils/javascript'
import { columnKeys } from '../jobs.description'

const jobTable = ({
  displayColKeys,
  onViewClick,
  checkEditPermission,
  jobType,
  selectedJobs,
  handleSelectChange,
  readyOnly,
}) => {
  const { t } = useTranslations()
  const { navigate } = useRouter()
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)

  const actionButtons = rowData => (
    <div className="d-flex flex-nowrap">
      <ANTDButton className="bg-view" onClick={() => onViewClick(rowData?.id)}>
        {t('btn_View')}
      </ANTDButton>
      {checkEditPermission && checkEditPermission(rowData) && (
        <ANTDButton
          className="bg-edit"
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
          {t('btn_Edit')}
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
        dataIndex: 'status',
        className: 'nowrap',
        render: rowData => {
          return <>{rowData ? t(rowData) : ''}</>
        },
      },
      {
        title: t('txt_Action'),
        key: columnKeys.action,
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
    ...jobData
  }) => {
    return [
      { label: 'job_Id', value: id },
      { label: 'job_Title', value: jobTitle },
      {
        label: 'user_CreationDate',
        value: dateFormat(creationDate)?.newDate,
      },
      {
        label: 'job_UpdatedDate',
        value: dateFormat(modificationDate)?.newDate,
      },
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
