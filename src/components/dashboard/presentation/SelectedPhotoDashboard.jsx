import { ArrowLeftOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'

import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { DASHBOARD_TXT, PHOTOS } from '../../../routing/pathName.constant'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { EyeOutlined } from '../../../utils/icons'
import { entries, isEqual } from '../../../utils/javascript'
import { getDashboardPhotosApi } from '../dashboard.api'
import { photosDashboardData } from '../dashboard.description'

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
    <div className="dashboard-module-surface dashboard-photos-surface">
      <button
        className="dashboard-photo-folder-back"
        onClick={() => navigate(`${DASHBOARD_TXT}/${PHOTOS}`)}
        type="button"
      >
        <ArrowLeftOutlined />
        Back to Photo Folders
      </button>
      <div className="dashboard-selected-photo-heading">
        <FolderOpenOutlined />
        <h2>{t(params?.photoType)}</h2>
      </div>

      <div ref={listRef}>
        {!photosList?.list && photosList?.loader ? (
          <div className="dashboard-photo-loading">
            <div className="dashboard-photo-spinner"></div>
            {t('txt_Loading', 'Loading photos...')}
          </div>
        ) : (
          <div className="dashboard-photo-grid">
            {photosList?.list?.map((photo, i) => (
              <button
                key={`${photo.id}-${i}`}
                onClick={() => handlePreview(photo)}
                className="dashboard-photo-card"
                type="button"
              >
                <img 
                  src={photo.url} 
                  alt={photo.name} 
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400x400?text=Image+Unavailable";
                  }}
                />
                <span className="dashboard-photo-overlay">
                  <EyeOutlined />
                </span>
                <div className="dashboard-photo-meta">
                  <h3>{photo.name || t(params?.photoType)}</h3>
                  <p>Hostel: {photo.hostelName || '-'}</p>
                  <p>
                    Date:{' '}
                    {photo.inspectionDate
                      ? dayJs(photo.inspectionDate).format(DISPLAY_DATE_FORMAT)
                      : '-'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {photosList?.list?.length > 0 && photosList?.loader && (
          <div className="dashboard-photo-loading dashboard-photo-loading-inline">
            <div className="dashboard-photo-spinner"></div>
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
