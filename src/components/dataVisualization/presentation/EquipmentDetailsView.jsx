import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDSkeleton from '../../../shared/antd/ANTDSkeleton'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { equipmentIconAC } from '../../../utils/icons'
import { length } from '../../../utils/javascript'

const EquipmentDetailsView = ({ details }) => {
  const { t } = useTranslations()
  const allDealers = details?.allDealerDetails
  const shownDealers =
    allDealers && length(allDealers) ? allDealers.slice(0, 3) : []
  const otherDealers =
    allDealers && length(allDealers) && length(allDealers) > 3
      ? allDealers.slice(3, length(allDealers))
      : []
  return (
    <div>
      <h3 className="mb-10">{t('txt_Equipment')}</h3>
      <ANTDSkeleton loading={details?.loading} active avatar>
        <div className="d-flex space-between text-left mt-3">
          <img width="80" height="80" src={equipmentIconAC} alt="AcIcon" />
          <div className="info-detail text-start">
            <h4 className="text-underline primary-color">
              {t('dvz_EquipmentInfo')}
            </h4>
            <li>- {details?.equipmentDetails?.userEinInfo?.name || '-'}</li>
            <li>- {details?.equipmentDetails?.modelInfo?.name || '-'}</li>
            <li>
              - {details?.equipmentDetails?.productSeriesInfo?.name || '-'}
            </li>
            <li>- {details?.equipmentDetails?.brandInfo?.name || '-'}</li>
          </div>
          <div className="info-detail text-start customer-detail">
            <h4 className="text-underline primary-color">
              {t('dvz_CustomerDetails')}
            </h4>
            <li>{details?.customerDetails?.businessName}</li>
          </div>
          <div
            className="px-3 text-start job-detail"
            style={{ paddingLeft: 10 }}
          >
            <h4 className="text-underline primary-color">
              {t('dvz_LastJobDetails')}
            </h4>
            <div>
              <li>
                <b>{t('dvz_Time')}: </b>
                {dayJs(details?.lastJobDetails?.creationDate).format(
                  DISPLAY_DATE_FORMAT,
                ) || '-'}
              </li>
              <li>
                <b>{t('user_Contractor')}: </b>
                {details?.lastJobDetails?.contractorInfo?.businessName || '-'}
              </li>
              {
                <li>
                  <b>{t('user_Dealer')}: </b>
                  {shownDealers && length(shownDealers)
                    ? shownDealers?.map((v, i) => (
                        <li key={i}>{v?.businessName}</li>
                      ))
                    : '-'}
                </li>
              }
              <li className="primary-color">
                {length(otherDealers)
                  ? `...${length(otherDealers)} ${t('dvz_MoreDealerAttached')}`
                  : null}
              </li>
            </div>
          </div>
        </div>
      </ANTDSkeleton>
    </div>
  )
}

export default EquipmentDetailsView
