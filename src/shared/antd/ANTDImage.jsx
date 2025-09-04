import { Image } from 'antd'
import React from 'react'

function ANTDImage({ ...props }) {
  return <Image {...props} />
}

const ANTDImageGroup = ({ ...props }) => {
  return <Image.PreviewGroup {...props} />
}

export { ANTDImageGroup }
export default ANTDImage
