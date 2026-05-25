import { memo } from 'react'

const IccPortal = () => (
  <iframe
    title="HOST Intervention Portal"
    src="/icc.html"
    style={{
      display: 'block',
      width: '100%',
      height: '100vh',
      border: 'none',
    }}
  />
)

export default memo(IccPortal)
