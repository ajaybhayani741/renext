import { Typography } from 'antd'
import React from 'react'

const ANTDTypography = ({ ...props }) => {
  return <Typography {...props} />
}

const { Title, Paragraph } = Typography

const ANTDTitle = ({ ...props }) => {
  return <Title {...props} />
}

const ANTDParagraph = ({ ...props }) => {
  return <Paragraph {...props} />
}

export { ANTDTitle, ANTDParagraph }

export default ANTDTypography
