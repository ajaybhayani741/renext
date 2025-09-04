import { useCallback } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'

const MachineDetailView = ({ title }) => {
  const { t } = useTranslations()

  const infoData = [
    [
      { label: 'user_Manufacturer', value: 'Virginia Lottery' },
      { label: 'inv_PurchaseInvoice', value: '1234' },
      { label: 'inv_DateOfManufacture', value: '03/14/2012' },
    ],
    [
      { label: 'inv_ManufacturerContact', value: '+1 (623) 2452' },
      { label: 'inv_ModelNameNumber', value: '' },
      { label: 'inv_DateOfPurchase', value: '05/06/2015' },
    ],
    [
      { label: 'inv_WarrantyNumber', value: '1829121' },
      { label: 'inv_WarrantyExpiry', value: '03/23/2029' },
      { label: 'inv_MaintenanceContact', value: '+1 (224) 2712' },
    ],
  ]

  const tableViewUI = useCallback(
    ({ info }) =>
      info?.map((arr, ind) => (
        <div className="machine-detail-row" key={ind}>
          {arr?.map(
            ({ label, value, img, hidden, colSpan }, i) =>
              !hidden && (
                <div className="machine-detail-info" key={i} colSpan={colSpan}>
                  <p>{t(label)}</p>
                  {img ? (
                    <div className="d-flex align-center">
                      <div>
                        <img className="flag-wrapper" src={img} alt="" />
                      </div>
                      <span>{value}</span>
                    </div>
                  ) : (
                    <span>{value}</span>
                  )}
                </div>
              ),
          )}
        </div>
      )),
    [],
  )

  return (
    <ANTDCard title={title}>
      <div className="machine-view-info">
        <div className="machine-view-box">
          {tableViewUI({ info: infoData })}
        </div>
        {/* <div className="machine-view-box">
          {tableViewUI({ info: infoData2 })}
        </div> */}
      </div>
    </ANTDCard>
  )
}

export default MachineDetailView
