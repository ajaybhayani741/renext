import React from 'react'

import BuildingDetailsView from './BuildingDetailsView'
import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDTable, {
  ANTDTableCell,
  ANTDTableRow,
} from '../../../shared/antd/ANTDTable'
import { isEqual } from '../../../utils/javascript'
import { finalProductColumn } from '../container/visualizationColumns'
import { finalProductList } from '../visualization.description'

const FinalProductCardView = ({ currentSelectedType, formData }) => {
  const { t } = useTranslations()
  const footer = {
    totalAmount: [11570, 9102],
    totalCo2Avoided: 1920,
  }
  return (
    <div>
      <>
        <ANTDCard className={`h-100 overflowY-auto`}>
          {/* <h3 className="mb-15">
          {t('Current Usage (With Refrigerant Traceability)')}
        </h3>
        <h3 className="mb-15">{t('Refrigerant Amount (Kg) :')}</h3> */}
          {isEqual(currentSelectedType, 'user_Site') ? (
            <BuildingDetailsView
              {...{
                details: {},
                formData,
              }}
            />
          ) : null}
          <ANTDTable
            id="equipment-table"
            className="refrigerant-table mt-20"
            columns={finalProductColumn(t)}
            dataSource={finalProductList}
            // scroll={{ y: 300 }}
            pagination={false}
            bordered
            summary={() => {
              return (
                <>
                  <ANTDTableRow>
                    <ANTDTableCell className="text-center" colSpan={2}>
                      {t('dvz_Total')}
                    </ANTDTableCell>
                    {footer.totalAmount.map((val, ind) => (
                      <ANTDTableCell key={ind}>{val || 0}</ANTDTableCell>
                    ))}
                  </ANTDTableRow>

                  <ANTDTableRow>
                    <ANTDTableCell
                      colSpan={2}
                      className="text-center color-red"
                    >
                      {t('dsv_TotalCO2AvoidedKG')}
                    </ANTDTableCell>
                    <ANTDTableCell
                      className="text-center color-red"
                      colSpan={5}
                    >
                      {footer.totalCo2Avoided}
                    </ANTDTableCell>
                  </ANTDTableRow>
                </>
              )
            }}
          />
        </ANTDCard>
      </>
    </div>
  )
}

export default FinalProductCardView
