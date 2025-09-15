import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import recordMaintenance from '../container/recordMaintenance.container'

const RecordMaintenanceDashboard = () => {
  const { options, selectedColumn, handleCloseModal } = recordMaintenance()

  return (
    <DashboardWrapper
      {...{
        chartOptions: { options },
        data: selectedColumn,
        handleCloseModal,
        chartClassName: 'w-100',
      }}
    />
  )
}

export default RecordMaintenanceDashboard
