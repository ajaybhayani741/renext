import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDSkeleton from '../../../shared/antd/ANTDSkeleton'
import { addressFormat } from '../../../utils'
import { dayJs } from '../../../utils/dayjs'
import { buildingIcon } from '../../../utils/icons'
import { buildingDetails, customerNames } from '../visualization.description'

const BuildingDetailsView = ({ details, formData }) => {
  const { t } = useTranslations()

  return (
    <div>
      <h3 className="mb-10">{t('user_Site')}</h3>
      <ANTDSkeleton loading={details?.loading} active avatar>
        <div className="d-flex mt-3">
          <img
            width="80"
            height="80"
            src={details?.buildingDetail?.buildingImage || buildingIcon}
            alt="BuildingIcon"
          />
          <div className="info-detail">
            <h4 className="text-underline primary-color">
              {t('dvz_BuildingInfo')}
            </h4>
            <li>- {buildingDetails[formData.user_Site.selected.name]?.name}</li>
            <li>
              -{' '}
              {addressFormat(buildingDetails[formData.user_Site.selected.name])}
            </li>
          </div>
          <div className="mr-10 info-detail customer-detail">
            <h4 className="text-underline primary-color">
              {t('dvz_CustomerDetails')}
            </h4>
            <li>- {customerNames[0]}</li>
          </div>
          <div style={{ paddingLeft: 10 }} className="job-detail">
            <h4 className="text-underline primary-color">
              {t('dvz_LastJobDetails')}
            </h4>
            <div>
              <li>
                <b>{t('dvz_Time')}: </b>
                {dayJs().format('YYYY/MM/DD') || '-'}
              </li>
            </div>
          </div>
        </div>
      </ANTDSkeleton>
    </div>
  )
}

export default BuildingDetailsView
