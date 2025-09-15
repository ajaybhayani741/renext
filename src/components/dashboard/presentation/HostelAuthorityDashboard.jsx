import DashboardWrapper from './DashboardWrapper'
import hostelAuthority from '../container/hostelAuthority.container'

const HostelAuthorityDashboard = () => {
  const { options, selectedColumn, handleCloseModal } = hostelAuthority()

  return (
    <DashboardWrapper
      {...{ chartOptions: { options }, data: selectedColumn, handleCloseModal }}
    />
  )
}

export default HostelAuthorityDashboard
