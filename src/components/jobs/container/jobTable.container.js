import { useMemo } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
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
  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)

  const actionButtons = rowData => (
    <>
      <ANTDButton className="bg-view" onClick={() => onViewClick(rowData?.id)}>
        {t('btn_View')}
      </ANTDButton>
    </>
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
    return [{ label: 'job_Id', value: id }].filter(item => !item.hidden)
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
