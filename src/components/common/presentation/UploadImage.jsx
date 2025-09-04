import Webcam from 'react-webcam'

import PreviewImage from './PreviewImage'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDUpload from '../../../shared/antd/ANTDUpload'
import { CameraOutlined, flipIcon } from '../../../utils/icons'
import { length, ternary } from '../../../utils/javascript'
import '../common.scss'
import uploadImage from '../container/uploadImage.container'

function UploadImage({
  acceptFileTypes,
  uploadSingle,
  fileList,
  setFileList,
  onFileUpload,
  onFileRemove,
  ...rest
}) {
  const {
    t,
    fileData,
    imagePreview,
    beforeUpload,
    handlePreview,
    onProfileDelete,
    handleCancelPreview,
    takePhoto,
    handleTakePhoto,
    handleCapture,
    handleSwitchCam,
    facingMode,
    videoConstraints,
    videoElement,
    handleError,
    isDesktop,
    handleIconRender,
  } = uploadImage({
    fileList,
    setFileList,
    onFileUpload,
    onFileRemove,
    ...rest,
  })
  const uploadMoreCondition = ternary(
    uploadSingle,
    length(fileData) < 1,
    !rest?.max || length(fileData) < rest?.max,
  )

  return (
    <>
      <ANTDUpload
        name="avatar"
        accept={acceptFileTypes}
        listType="picture-card"
        fileList={fileData}
        onPreview={handlePreview}
        iconRender={file => handleIconRender(acceptFileTypes, file)}
        beforeUpload={beforeUpload}
        className="upload-image"
        onRemove={onProfileDelete}
        maxCount={rest?.max}
      >
        {uploadMoreCondition ? (
          <div className="ant-badge">{t('txt_Upload')}</div>
        ) : null}
      </ANTDUpload>
      {!rest?.takePhotoFlag && (
        <div>
          <ANTDButton
            type="primary"
            className="btn mt-5"
            onClick={handleTakePhoto}
            disabled={!uploadMoreCondition}
          >
            <CameraOutlined />
            <span>{t('btn_TakePhoto')}</span>
          </ANTDButton>
        </div>
      )}
      <PreviewImage {...{ imagePreview, handleCancel: handleCancelPreview }} />

      {/* take photo Feature */}
      {takePhoto.flag && (
        <ANTDModal
          width="800px"
          footer={
            takePhoto.valid
              ? [
                  <ANTDButton key="back" onClick={handleTakePhoto}>
                    {t('msg_Cancel')}
                  </ANTDButton>,
                ]
              : [
                  !isDesktop ? (
                    <ANTDButton
                      className="view-flip"
                      key="back"
                      onClick={() => handleSwitchCam()}
                    >
                      <img
                        src={flipIcon}
                        width="25px"
                        height="20px"
                        alt="flip"
                      />
                    </ANTDButton>
                  ) : (
                    ''
                  ),
                  <ANTDButton key="cancel" onClick={handleTakePhoto}>
                    {t('msg_Cancel')}
                  </ANTDButton>,
                  <ANTDButton key="ok" onClick={handleCapture}>
                    {t('msg_OK')}
                  </ANTDButton>,
                ]
          }
          className="take-image-modal"
          closable={false}
          open={takePhoto.flag}
        >
          {takePhoto.valid ? (
            <div className="text-center scanner-not-connect">
              <h2> {takePhoto.valid}</h2>
            </div>
          ) : (
            <Webcam
              screenshotFormat="image/png"
              audio={false}
              videoConstraints={{ ...videoConstraints, facingMode }}
              ref={videoElement}
              style={{ width: '100%', height: '600px' }}
              onUserMediaError={handleError}
            />
          )}
        </ANTDModal>
      )}
    </>
  )
}

export default UploadImage
