import { useState } from 'react'

import DashboardWrapper from './DashboardWrapper'
import administrationGovernance from '../container/administrationGovernance.container'
import InspectionAssessmentPieChart from '../shared/InspectionAssessmentPieChart'
import ModuleFilters from '../shared/ModuleFilters'

const AdministrationGovernanceDashboard = () => {
  const [districtFilter, setDistrictFilter] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const {
    pieData,
    handleChartClick,
    selectedColumn,
    handleCloseModal,
    handleTableChange,
    hostelsData,
    questionOptions,
    questionName,
    setQuestionName,
  } = administrationGovernance({
    hostelFilter,
    moduleName: 'ADMINISTRATION_GOVERNANCE',
  })

  return (
    <DashboardWrapper
      {...{ handleCloseModal, selectedColumn, handleTableChange, hostelsData }}
    >
      <div className="dashboard-module-surface dashboard-authority-surface">
        <ModuleFilters
          districtFilter={districtFilter}
          setDistrictFilter={setDistrictFilter}
          hostelFilter={hostelFilter}
          setHostelFilter={setHostelFilter}
          questionOptions={questionOptions}
          questionName={questionName}
          onQuestionChange={setQuestionName}
        />
        <div className="dashboard-single-chart-grid">
          <InspectionAssessmentPieChart
            data={pieData}
            handleChartClick={handleChartClick}
            name="dash_AdministrationGovernance"
          />
        </div>
      </div>
    </DashboardWrapper>
  )
}

export default AdministrationGovernanceDashboard
