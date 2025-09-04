import { useCallback, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { b64toFile } from '../../../utils/customFunctions'
import { pdfImage, videoFileImage } from '../../../utils/icons'
import { include, isArray, isEqual, notEqual } from '../../../utils/javascript'
import { deleteImageFileApi, getImageFileApi } from '../common.api'
import {
  FACING_MODE_ENVIRONMENT,
  FACING_MODE_USER,
} from '../common.description'

const uploadImage = ({
  fileList,
  setFileList,
  onFileUpload,
  onFileRemove,
  ...rest
}) => {
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

  const handleFileUpload = async file => {
    const params = `?source=BRAND`
    const formData = new FormData()
    formData.append(
      'file',
      b64toFile(file?.url.split('base64,')[1], file?.type),
    )
    const response = await getImageFileApi({ params, payload: formData })
    return response
  }

  const beforeUpload = async file => {
    const preview = await getBase64(file)
    const maxFileSizeInBytes = rest?.maxSize
      ? rest?.maxSize * 1024 * 1024
      : null
    if ((rest?.maxSize && file.size <= maxFileSizeInBytes) || !rest?.maxSize) {
      const fileObj = { uid: file?.uid, url: preview, type: file?.type }
      if (onFileUpload) {
        const {
          data: { dmsId },
        } = await handleFileUpload({
          url: preview,
          type: file?.type,
        })
        onFileUpload({
          key: rest?.keyType,
          file: { ...fileObj, uid: dmsId },
        })
        return false
      }
      if (isArray(fileList)) {
        setFileList([...fileList, fileObj])
      } else {
        setFileList({
          ...fileList,
          [rest?.keyType]: [...(fileList?.[rest?.keyType] || []), fileObj],
        })
      }
    } else {
      notifyMethod.warning({
        message: `Maximum file size allowed is ${rest?.maxSize}MB`,
      })
    }
    return false
  }

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
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

  const onProfileDelete = async file => {
    if (onFileRemove) {
      const currentDmsId = file?.uid
      await deleteImageFileApi({ params: `?dmsId=${currentDmsId}` })
      onFileRemove({ dmsId: currentDmsId, key: rest?.keyType })
      return
    }
    const tempFile =
      (isArray(fileList) ? fileList : fileList?.[rest?.keyType]) || []
    const removedList = tempFile
      .slice()
      .filter(item => notEqual(item?.uid, file?.uid))
    if (isArray(fileList)) {
      setFileList(removedList)
    } else {
      setFileList({ ...fileList, [rest?.keyType]: removedList })
    }
    if (rest?.removedDsmID && isEqual(typeof file?.uid, 'number')) {
      rest.setRemovedDsmID([...rest?.removedDsmID, file?.uid])
    }
  }

  const handleCancelPreview = () => {
    setImagePreview({ visible: false, image: '', type: '' })
  }

  // take photo Feature
  const handleTakePhoto = () => {
    setTakePhoto(prev => ({
      ...prev,
      flag: !prev.flag,
    }))
  }

  const dataURLtoFile = (dataUrl, filename) => {
    let arr = dataUrl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }

  const handleCapture = async () => {
    const imageSrc = videoElement.current.getScreenshot()
    if (imageSrc) {
      let file = dataURLtoFile(imageSrc, 'hello.png')
      const preview = await getBase64(file)
      if (onFileUpload) {
        const fileObj = { url: preview, type: file?.type }
        const {
          data: { dmsId },
        } = await handleFileUpload({
          url: preview,
          type: file?.type,
        })
        onFileUpload({
          dmsId,
          key: rest?.keyType,
          file: { ...fileObj, uid: dmsId },
        })
      } else {
        if (isArray(fileList)) {
          setFileList([
            ...fileList,
            { uid: file?.uid, url: preview, type: file?.type },
          ])
        } else {
          setFileList({
            ...fileList,
            [rest?.keyType]: [
              ...fileList?.[rest?.keyType],
              { uid: file?.uid, url: preview, type: file?.type },
            ],
          })
        }
      }
      setTakePhoto(prev => ({ ...prev, flag: false }))
    }
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

  const handleIconRender = (fileType, file) => {
    const videoType = [
      '.mp4',
      '.mov',
      '.avi',
      '.wmv',
      '.avchd',
      '.webm',
      '.flv',
    ]
    if (isEqual(fileType, '.pdf')) {
      return <img src={pdfImage} alt="pdfIcon" />
    } else if (videoType.some(v => include(fileType, v))) {
      return <img src={videoFileImage} alt="videoIcon" />
    } else {
      return <img src={file?.url} alt="pic" />
    }
  }

  return {
    t,
    isDesktop,
    fileData: isArray(fileList) ? fileList : fileList?.[rest?.keyType],
    fileList,
    imagePreview,
    facingMode,
    videoConstraints,
    videoElement,
    takePhoto,
    handleIconRender,
    beforeUpload,
    handlePreview,
    onProfileDelete,
    handleCancelPreview,
    setTakePhoto,
    handleTakePhoto,
    handleCapture,
    handleSwitchCam,
    handleError,
  }
}

export default uploadImage
