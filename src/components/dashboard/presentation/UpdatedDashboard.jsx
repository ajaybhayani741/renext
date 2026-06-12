const IFRAME_SRC = 'https://stupendous-blini-a6fcba.netlify.app/'

const UpdatedDashboard = () => {
  return (
    <div
      className="-mx-4 md:-mx-8 -mt-4"
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <iframe
        src={IFRAME_SRC}
        title="dashboard"
        width="100%"
        height="100%"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  )
}

export default UpdatedDashboard
