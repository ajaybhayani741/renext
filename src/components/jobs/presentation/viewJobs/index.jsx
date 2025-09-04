import ShiftJobView from './ShiftJobView'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import PageNotFound from '../../../PageNotFound'
import { tabKeys as jobTypes } from '../../jobs.description'

const ViewJob = ({ jobType, data, loader }) => {
  const getViewComponent = type => {
    switch (type) {
      case jobTypes.shift:
        return <ShiftJobView details={data} loader={loader} />

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
