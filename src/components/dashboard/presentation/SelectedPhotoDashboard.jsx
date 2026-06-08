import React, { useEffect, useRef, useState } from 'react'

import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { DASHBOARD_TXT, PHOTOS } from '../../../routing/pathName.constant'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { EyeOutlined } from '../../../utils/icons'
import { entries, isEqual } from '../../../utils/javascript'
import { getDashboardPhotosApi } from '../dashboard.api'
import { cardList, photosDashboardData } from '../dashboard.description'

const SelectedPhotoDashboard = () => {
  const { t } = useTranslations()
  const { navigate, params } = useRouter()
  const listRef = useRef(null)
  const [photosList, setPhotosList] = useState({ loader: false, hasMore: true })
  const [lastFetchedPage, setLastFetchedPage] = useState(0)
  const [imagePreview, setImagePreview] = useState({
    isPreview: false,
    url: '',
    data: {},
  })

  const getPhotoType = () => {
    const currentKeyData = entries(photosDashboardData)?.find(([_, value]) =>
      isEqual(value?.key, params?.photoType),
    )
    return currentKeyData
  }

  useEffect(() => {
    const el = listRef?.current
    if (!el) return

    const hasScroll = el.scrollHeight > el.clientHeight
    if (!hasScroll && photosList?.hasMore && !photosList?.loader) {
      const type = getPhotoType()?.[1]?.type
      getPhotosList({ type, pageNo: photosList?.currentPage + 1 || 1 })
    }
  }, [lastFetchedPage])

  useEffect(() => {
    const el = window;
    
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (isAtBottom && photosList?.hasMore && !photosList?.loader) {
        const type = getPhotoType()?.[1]?.type
        getPhotosList({ type, pageNo: photosList?.currentPage + 1 || 1 })
      }
    }

    el.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      el.removeEventListener('scroll', handleScroll)
    }
  }, [
    lastFetchedPage,
    photosList?.hasMore,
    photosList?.loader,
    photosList?.currentPage,
  ])

  const getPhotosList = async ({ type, pageNo = 1 } = {}) => {
    setPhotosList(prev => ({ ...prev, loader: true }))
    const response = await getDashboardPhotosApi({ pageNo, params: { type } })
    if (response?.data) {
      const newPhotos = response?.data?.list
        ?.map(item => {
          const currentPhotos = item?.photos?.map(photo => ({
            id: photo?.dmsId,
            status: 'done',
            name: photo?.fileName,
            url: photo?.fileUrl,
            hostelName: item?.hostelInfo?.lastName,
            inspectionDate: item?.inspectionJobCompletionDate,
          }))
          return currentPhotos
        })
        ?.flat()
        ?.filter(Boolean)
        
      setPhotosList(prev => ({
        ...prev,
        list: isEqual(pageNo, 1) ? newPhotos : [...(prev?.list || []), ...newPhotos],
        lastPage: response?.data?.lastPage,
        hasMore: response?.data?.hasMore,
        currentPage: response?.data?.pageNo,
        loader: false,
      }))
      setLastFetchedPage(response?.data?.pageNo)
    } else {
      setPhotosList(prev => ({ ...prev, loader: false }))
    }
  }

  const handlePreview = data => {
    setImagePreview({
      ...imagePreview,
      isPreview: true,
      data: data,
    })
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 m-0">
          {t(params?.photoType)} {t('txt_Gallery', 'Gallery')}
        </h2>
      </div>

      <div ref={listRef}>
        {!photosList?.list && photosList?.loader ? (
          <div className="flex justify-center py-20 text-slate-500 font-medium">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            {t('txt_Loading', 'Loading photos...')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-[200px]">
            {photosList?.list?.map((photo, i) => (
              <div 
                key={`${photo.id}-${i}`}
                onClick={() => handlePreview(photo)}
                className="group relative rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-slate-200"
              >
                <img 
                  src={photo.url} 
                  alt={photo.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x400?text=Image+Unavailable";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <EyeOutlined className="text-white text-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 drop-shadow-md" />
                  <p className="text-white text-sm font-medium m-0 truncate drop-shadow-md">
                    {photo.hostelName || 'Unknown Location'}
                  </p>
                  <p className="text-white/80 text-xs m-0 truncate">
                    {photo.inspectionDate ? dayJs(photo.inspectionDate).format(DISPLAY_DATE_FORMAT) : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {photosList?.list?.length > 0 && photosList?.loader && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {imagePreview?.isPreview && (
        <ANTDModal
          title={null}
          centered
          open={imagePreview?.isPreview}
          onCancel={() =>
            setImagePreview({
              ...imagePreview,
              isPreview: false,
              data: null,
            })
          }
          footer={false}
          width={800}
          className="gallery-preview-modal overflow-hidden"
          bodyStyle={{ padding: 0 }}
          closeIcon={<div className="bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 transition-colors"><span className="text-lg">×</span></div>}
        >
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <div className="w-full h-[60vh] flex items-center justify-center bg-black">
              <img
                src={imagePreview?.data?.url}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/800x600?text=Image+Unavailable";
                }}
              />
            </div>
            <div className="p-6 bg-white">
              <h3 className="text-xl font-bold text-slate-800 m-0 mb-4">{t('txt_PhotoDetails', 'Photo Details')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold m-0 mb-1">{t('job_hostelName', 'Hostel Name')}</p>
                  <p className="text-sm text-slate-800 font-medium m-0">{imagePreview?.data?.hostelName || '-'}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold m-0 mb-1">{t('dash_DateOfInspectionCompletion', 'Inspection Date')}</p>
                  <p className="text-sm text-slate-800 font-medium m-0">
                    {imagePreview?.data?.inspectionDate
                      ? dayJs(imagePreview?.data?.inspectionDate).format(DISPLAY_DATE_FORMAT)
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ANTDModal>
      )}
    </div>
  )
}

export default SelectedPhotoDashboard
