import React from 'react'
import { CameraOutlined } from '@ant-design/icons'
import useTranslations from '../../../hooks/useTranslations'
import { keys } from '../../../utils/javascript'
import photos from '../container/photos.container'
import { photosDashboardData } from '../dashboard.description'

const PhotosDashboard = () => {
  const { t } = useTranslations()
  const { handlePhotosCardClick } = photos()

  return (
    <div className="p-4 md:p-8 min-h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys(photosDashboardData)?.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => handlePhotosCardClick(item)}
              className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-500 transform hover:-translate-y-1"
            >
              <div className="h-2 bg-blue-500 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <CameraOutlined />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 m-0 group-hover:text-blue-600 transition-colors">
                    {t(item)}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 mb-0">
                    View and manage photo documentation
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PhotosDashboard
