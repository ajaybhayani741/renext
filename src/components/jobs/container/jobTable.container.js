import { useMemo } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import { dayJs, DISPLAY_DATE_FORMAT, estDateFormat } from '../../../utils/dayjs'
import { include, isEqual, length, ternary } from '../../../utils/javascript'
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
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)

  const actionButtons = rowData => (
    <>
      <ANTDButton className="bg-view" onClick={() => onViewClick(rowData?.id)}>
        {t('btn_View')}
      </ANTDButton>
    </>
  )

  function formatMillis(ms) {
    const totalMinutes = Math.floor(ms / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours?.toString()?.padStart(2, '0')}:${minutes?.toString()?.padStart(2, '0')}`
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
      //         {rowData?.read ? (
      //           <ANTDButton>{t('txt_Actual')}</ANTDButton>
      //         ) : (
      //           <ANTDButton style={{ backgroundColor: '#ffab00' }}>
      //             {t('txt_Sample')}
      //           </ANTDButton>
      //         )}
      //       </div>
      //     )
      //   },
      // },
      {
        title: t('job_Id'),
        key: columnKeys.jobId,
        dataIndex: 'id',
        // sorter: true,
        ellipsis: true,
      },
      {
        title: t('job_EmployeeName'),
        key: columnKeys.employeeName,
        dataIndex: ['userInfo', 'lastName'],
        ellipsis: true,
        render: rowData => rowData || '-',
      },
      {
        title: t('job_ShiftDate'),
        key: columnKeys.shiftDate,
        dataIndex: 'creationDate',
        render: rowData => {
          return rowData ? dayJs(rowData).format(DISPLAY_DATE_FORMAT) : '-'
        },
      },
      {
        title: t('job_ShiftType'),
        key: columnKeys.shiftType,
        dataIndex: 'shiftType',
        render: rowData => {
          return rowData || '-'
        },
      },
      {
        title: `${t('job_LoginTime')} (EST)`,
        key: columnKeys.loginTime,
        dataIndex: 'logInTime',
        render: rowData => {
          return rowData ? estDateFormat(dayJs(rowData)).format(`HH:mm`) : '-'
        },
      },
      {
        title: `${t('job_LogoutTime')} (EST)`,
        key: columnKeys.logoutTime,
        dataIndex: 'logOutTime',
        render: rowData => {
          return rowData ? estDateFormat(dayJs(rowData)).format(`HH:mm`) : '-'
        },
      },
      {
        title: t('job_ShiftTime'),
        key: columnKeys.shiftTime,
        render: rowData => {
          return rowData
            ? formatMillis(rowData?.logOutTime - rowData?.logInTime)
            : '-'
        },
      },
      // {
      //   title: t('job_Status'),
      //   key: columnKeys.status,
      //   dataIndex: 'status',
      //   className: 'nowrap',
      //   // sorter: true,
      //   render: rowData => {
      //     return <>{rowData ? t(rowData) : ''}</>
      //   },
      // },
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
    userInfo,
    creationDate,
    logInTime,
    logOutTime,
    active,
    ...jobData
  }) => {
    return [
      { label: 'job_Id', value: id },
      { label: 'job_EmployeeName', value: userInfo?.lastName },
      {
        label: 'job_ShiftDate',
        value: creationDate
          ? dayJs(creationDate).format(DISPLAY_DATE_FORMAT)
          : '-',
      },
      {
        label: 'job_ShiftType',
        value: jobData?.shiftType,
      },
      {
        label: `${t('job_LoginTime')} (EST)`,
        value: logInTime
          ? estDateFormat(dayJs(logInTime)).format(`HH:mm`)
          : '-',
      },
      {
        label: `${t('job_LogoutTime')} (EST)`,
        value: logOutTime
          ? estDateFormat(dayJs(logOutTime)).format(`HH:mm`)
          : '-',
        hidden: !isEqual(active, false),
      },
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
