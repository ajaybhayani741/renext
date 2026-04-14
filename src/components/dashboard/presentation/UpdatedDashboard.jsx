const IFRAME_SRC = 'https://lucent-sable-32f7b5.netlify.app/'

const UpdatedDashboard = () => {
  return (
    <iframe
      src={IFRAME_SRC}
      title="dashboard"
      width="100%"
      height="100%"
      style={{ border: 'none', minHeight: '100vh' }}
    />
  )
}

export default UpdatedDashboard
