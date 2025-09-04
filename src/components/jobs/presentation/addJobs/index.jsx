import '../../jobs.scss'

import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import { ternary } from '../../../../utils/javascript'
import PageNotFound from '../../../PageNotFound'

const AddEditJobs = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const isEdit = !!params?.jobId

  const getJobComponent = type => {
    switch (type) {
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
