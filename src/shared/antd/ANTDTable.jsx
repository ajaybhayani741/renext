import { Table } from 'antd'

import useTranslations from '../../hooks/useTranslations'

const ANTDTable = ({ pagination, ...props }) => {
  const { t } = useTranslations()
  return (
    <Table
      {...props}
      pagination={pagination && { showSizeChanger: false, ...pagination }}
      locale={{ emptyText: t('txt_NoData') }}
    />
  )
}

export default ANTDTable

const ANTDTableRow = ({ ...props }) => {
  return <Table.Summary.Row {...props} />
}
const ANTDTableCell = ({ ...props }) => {
  return <Table.Summary.Cell {...props} />
}
export { ANTDTableRow, ANTDTableCell }
