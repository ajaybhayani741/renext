import React, { useEffect, useRef, useState } from 'react'

import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { DASHBOARD_TXT, PHOTOS } from '../../../routing/pathName.constant'
import ANTDBreadcrumb from '../../../shared/antd/ANTDBreadcrumb'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDUpload from '../../../shared/antd/ANTDUpload'
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
    const el = listRef?.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
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
      const photosList = response?.data?.list
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
      setPhotosList(prev => ({
        ...prev,
        list: isEqual(pageNo, 1) ? photosList : [...prev?.list, ...photosList],
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

  const handleOnClick = path => (path ? navigate(path) : null)

  const getCurrentPath = () => {
    const currentData = cardList.find(card => isEqual(card.key, PHOTOS))
    let pathItems = [
      {
        title: t('job_Dashboard'),
        className: 'cursor-pointer text-underline',
        onClick: () => handleOnClick(DASHBOARD_TXT),
      },
      {
        title: t(currentData?.label),
        className: 'cursor-pointer text-underline',
        onClick: () => handleOnClick(`${DASHBOARD_TXT}/${PHOTOS}`),
      },
      ...(currentData?.subLabel ? [{ title: t(currentData?.subLabel) }] : []),
      ...(params?.photoType ? [{ title: t(params?.photoType) }] : []),
    ]
    return <ANTDBreadcrumb separator=">" items={pathItems} />
  }

  const handlePreview = data => {
    setImagePreview({
      ...imagePreview,
      isPreview: true,
      data: data,
    })
  }
  return (
    <div className="dashboard-view">
      <div className="breadCrumb">{getCurrentPath()}</div>
      <div className="photo-dashboard-container" ref={listRef}>
        {!photosList?.list && photosList?.loader ? (
          <div className="loader">{t('txt_Loading')}</div>
        ) : (
          <div className="photos-list text-center">
            <ANTDUpload
              name="form-upload"
              listType="picture-card"
              showUploadList={{
                showRemoveIcon: false,
                showDownloadIcon: false,
                showPreviewIcon: true,
                previewIcon: <EyeOutlined />,
              }}
              beforeUpload={() => false}
              onPreview={handlePreview}
              fileList={photosList?.list || []}
            />
            {photosList?.list && photosList?.loader && (
              <div className="loader">{t('txt_Loading')}</div>
            )}
          </div>
        )}
      </div>
      {imagePreview?.isPreview && (
        <ANTDModal
          title={t('job_Preview')}
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
          className="image-preview-modal"
        >
          <img
            src={imagePreview?.data?.url}
            alt={t('job_Preview')}
            className="image-preview"
          />
          <div className="mt-20 justify-items-center">
            <tr className="basic-table-user-info">
              <td>
                <b>{t('job_hostelName')}</b>
              </td>
              : <td>{imagePreview?.data?.hostelName || '-'}</td>
            </tr>
            <tr className="basic-table-user-info">
              <td>
                <b>{t('dash_DateOfInspectionCompletion')}</b>
              </td>
              : <td>{imagePreview?.data?.inspectionDate || '-'}</td>
            </tr>
          </div>
        </ANTDModal>
      )}
    </div>
  )
}

export default SelectedPhotoDashboard
