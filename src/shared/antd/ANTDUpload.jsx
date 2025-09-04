import { FileSearchOutlined } from '@ant-design/icons'
import { Upload } from 'antd'
const { Dragger } = Upload
function ANTDUpload({ ...props }) {
  return <Upload {...props} />
}

export default ANTDUpload

const ANTDUploadDragger = ({ uploadText, ...props }) => {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <FileSearchOutlined />
      </p>
      <p className="ant-upload-text">{uploadText}</p>
    </Dragger>
  )
}

export { ANTDUploadDragger }
