import '../common.scss'
import { FolderOpenOutlined } from '@ant-design/icons'

import PreviewImage from './PreviewImage'
import TakePhoto from './TakePhoto'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDUpload, { ANTDUploadDragger } from '../../../shared/antd/ANTDUpload'
import { CameraOutlined } from '../../../utils/icons'
import { length } from '../../../utils/javascript'
import formUpload from '../container/formUpload.container'

const FormUpload = ({
  takePhotoFlag = true,
  acceptFileTypes,
  value,
  max = 1,
  form,
  listType = 'picture-card',
  className = '',
  uploadDragger,
  isPreview = true,
  hasApiCall = true,
  uploadText,
  disabled,
  filePath,
  apiCall,
  disableGalleryUpload = false,
  ...props
}) => {
  const { t } = useTranslations()
  const {
    imagePreview,
    handlePreview,
    handleCancelPreview,
    takePhoto,
    isDesktop,
    facingMode,
    videoElement,
    videoConstraints,
    handleError,
    handleCapture,
    handleSwitchCam,
    handleTakePhoto,
    handleIconRender,
  } = formUpload({ hasApiCall, filePath, apiCall })

  const uploadMoreCondition = length(value?.fileList) < max

  return (
    <>
      {uploadDragger ? (
        <ANTDUploadDragger
          uploadText={t(uploadText)}
          beforeUpload={() => false}
          acceptFileTypes={acceptFileTypes}
          fileList={value?.fileList}
          onPreview={() => false}
          name="form-upload"
          disabled={disabled}
          {...props}
        />
      ) : (
        <ANTDUpload
          name="form-upload"
          className="upload-image"
          listType={listType}
          accept={acceptFileTypes}
          beforeUpload={() => false}
          iconRender={file => handleIconRender(file)}
          onPreview={isPreview ? handlePreview : false}
          fileList={value?.fileList}
          disabled={disabled}
          openFileDialogOnClick={!disableGalleryUpload}
          {...props}
        >
          {props?.directory ? (
            <div className="upload-folder-icon">
              <FolderOpenOutlined width={190} height={190} />
            </div>
          ) : (
            uploadMoreCondition && (
              <div className={`ant-badge ${className}`}>
                {t(
                  props?.uploadText || !disableGalleryUpload
                    ? 'txt_Upload'
                    : '',
                )}
              </div>
            )
          )}
        </ANTDUpload>
      )}
      {takePhotoFlag && (
        <ANTDButton
          type="primary"
          className="btn mt-10"
          onClick={handleTakePhoto}
          disabled={disabled || !uploadMoreCondition}
        >
          <CameraOutlined />
          <span>{t('btn_TakePhoto')}</span>
        </ANTDButton>
      )}

      <PreviewImage {...{ imagePreview, handleCancel: handleCancelPreview }} />
      <TakePhoto
        {...{
          takePhoto,
          isDesktop,
          facingMode,
          videoElement,
          videoConstraints,
          handleError,
          handleCapture,
          handleTakePhoto,
          handleSwitchCam,
          fileList: value?.fileList,
        }}
      />
    </>
  )
}

export default FormUpload
