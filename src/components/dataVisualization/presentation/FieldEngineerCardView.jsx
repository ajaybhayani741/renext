import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDTable, {
  ANTDTableCell,
  ANTDTableRow,
} from '../../../shared/antd/ANTDTable'
import { feColumn } from '../container/visualizationColumns'

function FieldEngineerCardView({ brandLoader, fieldTableData, totalFE }) {
  const { t } = useTranslations()
  return (
    <>
      <ANTDCard className="h-100 overflowY-auto">
        <h3>{t('dvz_ClosedRepairJobByBrand')}</h3>
        <ANTDTable
          id="fe-table"
          className="refrigerant-table field-engineer-table mt-20"
          columns={feColumn()}
          dataSource={fieldTableData?.list?.map((value, index) => ({
            ...value,
            key: index,
          }))}
          loading={brandLoader}
          pagination={false}
          scroll={{ y: 300 }}
          bordered
          summary={() => {
            return (
              <ANTDTableRow className="text-center">
                <ANTDTableCell>{t('dvz_Total')}</ANTDTableCell>
                <ANTDTableCell>
                  {totalFE?.totalRepairJobsClosed || 0}
                </ANTDTableCell>
              </ANTDTableRow>
            )
          }}
        />
      </ANTDCard>
    </>
  )
}

export default FieldEngineerCardView
