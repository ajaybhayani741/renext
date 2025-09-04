import '../bookKeeping.scss'

import useTranslations from '../../../hooks/useTranslations'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDTable from '../../../shared/antd/ANTDTable'
import { dayJs, DISPLAY_DATE_FORMAT, estDateFormat } from '../../../utils/dayjs'
import { isEqual, keys, length } from '../../../utils/javascript'

const ShiftInfoView = ({ details }) => {
  const { t } = useTranslations()
  const isCompleted = isEqual(details?.active, false) //compare with boolean false

  const dateFormat = rowData =>
    rowData ? dayJs(rowData).format(DISPLAY_DATE_FORMAT) : '-'

  const timeFormat = rowData =>
    rowData ? estDateFormat(dayJs(rowData)).format('HH:mm') : '-'

  const partitions = [
    [
      { label: 'job_Id', value: details?.id },
      { label: 'job_EmployeeName', value: details?.userInfo?.lastName },
      { label: 'job_ShiftType', value: details?.shiftType },
    ],
    [
      { label: 'job_ShiftDate', value: dateFormat(details?.creationDate) },
      {
        label: `${t('job_LoginTime')} (EST)`,
        value: timeFormat(details?.logInTime),
      },
      {
        label: `${t('job_LogoutTime')} (EST)`,
        value: timeFormat(details?.logOutTime),
        hidden: !isCompleted,
      },
    ],
  ]

  const columns = [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      render: rowData => <b>{t(rowData)}</b>,
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '49%',
    },
  ]

  if (!length(keys(details))) return null

  return (
    <ANTDRow gutter={10} className="shift-view-info">
      {partitions.map((dataSource, i) => (
        <ANTDColumn lg={12} xs={24} key={i}>
          <ANTDTable
            className="tebuler-table"
            dataSource={dataSource?.filter(item => !item.hidden)}
            columns={columns}
            pagination={false}
            bordered
            size="small"
          />
        </ANTDColumn>
      ))}
    </ANTDRow>
  )
}

export default ShiftInfoView
