import { useCallback, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { useFormInstanceFn } from '../../../shared/antd/ANTDForm'
import { getBase64 } from '../../../utils'
import { MAX_FILE_SIZE } from '../../../utils/constant'
import { pdfImage, videoFileImage } from '../../../utils/icons'
import { include, isEqual } from '../../../utils/javascript'
import { getImageFileApi } from '../common.api'
import {
  FACING_MODE_ENVIRONMENT,
  FACING_MODE_USER,
} from '../common.description'

const formUpload = ({ hasApiCall, filePath, apiCall }) => {
  const form = useFormInstanceFn()
  const { t } = useTranslations()

  const { selector } = useRedux()
  const isDesktop = selector(state => state.app.isDesktop)
  const [imagePreview, setImagePreview] = useState({
    visible: false,
    image: '',
    type: '',
  })
  const [takePhoto, setTakePhoto] = useState({
    flag: false,
    valid: '',
  })

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER)
  const videoElement = useRef(null)
  const videoConstraints = {
    facingMode: FACING_MODE_USER,
  }

  const handleTakePhoto = () => {
    setTakePhoto(prev => ({
      ...prev,
      flag: !prev.flag,
    }))
  }

  const handlePreview = async file => {
    const viewType = file?.type
    let url
    if (file?.originFileObj) {
      url = await getBase64(file?.originFileObj)
    } else if (file?.url) {
      url = file.url
    }
    url &&
      setImagePreview({
        visible: true,
        image: url,
        type: viewType,
      })
  }

  const handleCancelPreview = () => {
    setImagePreview({ visible: false, image: '', type: '' })
  }

  const handleSwitchCam = useCallback(() => {
    setFacingMode(prevState =>
      isEqual(prevState, FACING_MODE_USER)
        ? FACING_MODE_ENVIRONMENT
        : FACING_MODE_USER,
    )
  }, [])

  const handleError = err => {
    setTakePhoto(prev => ({
      ...prev,
      valid: t('msg_YourCameraIsNotConnected'),
    }))
  }

  const dataURLtoFile = dataUrl => {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${Date.now()}.png`, { type: mime })
  }

  const onFileUpload = async ({ file }) => {
    const isLt5MB = file?.size < MAX_FILE_SIZE
    if (!isLt5MB) {
      return notifyMethod.warning({
        message: t('msg_MaximumSizeAllowed', {
          maxSize: MAX_FILE_SIZE / 1024 / 1024,
        }),
      })
    }
    const formData = new FormData()
    formData.append('file', file)
    const resp = await getImageFileApi({
      params: '?source=USER',
      payload: formData,
    })
    return resp?.data?.dmsId
  }

  const handleCapture = async () => {
    const imageSrc = videoElement.current.getScreenshot()
    let file = dataURLtoFile(imageSrc)
    const fileList = form.getFieldValue(filePath)?.fileList || []
    setTakePhoto(prev => ({ ...prev, flag: false }))
    if (!hasApiCall) {
      form.setFieldValue(filePath, {
        fileList: [...(fileList || []), { ...file, originFileObj: file }],
      })
    } else {
      const dmsId = await onFileUpload({ file })
      if (dmsId) {
        form.setFieldValue(filePath, {
          fileList: [
            ...(fileList || []),
            { ...file, dmsId, uid: dmsId, originFileObj: file },
          ],
        })
      }
    }
    apiCall && apiCall({})
  }

  const handleIconRender = file => {
    const fileType = file?.type || /\.\w+$/.exec(file?.url)?.[0]
    const videoType = [
      '.mp4',
      '.mov',
      '.avi',
      '.wmv',
      '.avchd',
      '.webm',
      '.flv',
    ]
    if (include(fileType, 'pdf')) {
      return <img src={pdfImage} alt="pdfIcon" />
    } else if (videoType.some(v => include(fileType, v))) {
      return <img src={videoFileImage} alt="videoIcon" />
    } else {
      return <img src={file?.url} alt="pic" />
    }
  }

  return {
    takePhoto,
    isDesktop,
    facingMode,
    imagePreview,
    videoElement,
    videoConstraints,
    handleError,
    handleCapture,
    handlePreview,
    handleSwitchCam,
    handleTakePhoto,
    handleCancelPreview,
    handleIconRender,
  }
}

export default formUpload
