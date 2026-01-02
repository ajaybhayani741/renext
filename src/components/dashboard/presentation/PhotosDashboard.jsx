import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import { keys } from '../../../utils/javascript'
import photos from '../container/photos.container'
import { photosDashboardData } from '../dashboard.description'

const PhotosDashboard = () => {
  const { t } = useTranslations()
  const { handlePhotosCardClick } = photos()

  return (
    <ANTDRow className="">
      {keys(photosDashboardData)?.map((item, index) => {
        return (
          <ANTDColumn key={index + 1} md={12} xs={24}>
            <ANTDCard
              className="photo-card"
              onClick={() => handlePhotosCardClick(item)}
            >
              {t(item)}
            </ANTDCard>
          </ANTDColumn>
        )
      })}
    </ANTDRow>
  )
}

export default PhotosDashboard
