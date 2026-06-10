import { FolderOpenOutlined } from '@ant-design/icons'

import useTranslations from '../../../hooks/useTranslations'
import { keys } from '../../../utils/javascript'
import photos from '../container/photos.container'
import { photosDashboardData } from '../dashboard.description'

const PhotosDashboard = () => {
  const { t } = useTranslations()
  const { handlePhotosCardClick } = photos()

  return (
    <div className="dashboard-module-surface dashboard-photos-surface">
      <h2 className="dashboard-photo-heading">Photo Folders</h2>
      <div className="dashboard-photo-folder-grid">
        {keys(photosDashboardData)?.map((item, index) => {
          return (
            <button
              key={index}
              onClick={() => handlePhotosCardClick(item)}
              className="dashboard-photo-folder-card"
              type="button"
            >
              <span className="dashboard-photo-folder-icon">
                <FolderOpenOutlined />
              </span>
              <span className="dashboard-photo-folder-title">{t(item)}</span>
              <span className="dashboard-photo-folder-count">Photos</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default PhotosDashboard
