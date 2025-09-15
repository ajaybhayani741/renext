import React from 'react'

import DashboardWrapper from './DashboardWrapper'
import students from '../container/students.container'

const StudentsDashboard = () => {
  const { options, selectedColumn, handleCloseModal } = students()
  return (
    <DashboardWrapper
      {...{
        chartOptions: { options, constructorType: 'stockChart' },
        data: selectedColumn,
        handleCloseModal,
      }}
    />
  )
}

export default StudentsDashboard
