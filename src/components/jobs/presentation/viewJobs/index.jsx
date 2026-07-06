import InspectionJobView from './InspectionJobView'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import PageNotFound from '../../../PageNotFound'
import { tabKeys as jobTypes } from '../../jobs.description'

const ViewJob = ({
  jobType,
  data,
  loader,
  highlightSection,
  highlightCategoryColor,
}) => {
  const getViewComponent = type => {
    switch (type) {
      case jobTypes.inspection:
        return (
          <InspectionJobView
            data={data}
            highlightSection={highlightSection}
            highlightCategoryColor={highlightCategoryColor}
          />
        )

      default:
        return <PageNotFound />
    }
  }

  return (
    <>
      {loader ? (
        <div className="view-loader">
          <ANTDSpin size="medium" />
        </div>
      ) : (
        getViewComponent(jobType)
      )}
    </>
  )
}

export default ViewJob
