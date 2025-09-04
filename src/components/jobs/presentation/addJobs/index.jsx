import '../../jobs.scss'

import InspectionJob from './inspection'
import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import { ternary } from '../../../../utils/javascript'
import PageNotFound from '../../../PageNotFound'
import { tabKeys as jobTabKeys } from '../../jobs.description'

const AddEditJobs = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const isEdit = !!params?.jobId

  const getJobComponent = type => {
    switch (type) {
      case jobTabKeys.inspection:
        return <InspectionJob />

      default:
        return <PageNotFound />
    }
  }

  return (
    <>
      <h2>{ternary(isEdit, t('job_EditJob'), t('job_AddJob'))}</h2>
      {getJobComponent(params?.jobType)}
    </>
  )
}

export default AddEditJobs
