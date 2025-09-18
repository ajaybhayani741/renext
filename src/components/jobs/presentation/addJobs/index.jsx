import '../../jobs.scss'

import { useEffect, useState } from 'react'

import InspectionJob from './inspection'
import useRouter from '../../../../hooks/useRouter'
import useTranslations from '../../../../hooks/useTranslations'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import { ternary, include } from '../../../../utils/javascript'
import PageNotFound from '../../../PageNotFound'
import { getJobDetailApi } from '../../jobs.api'
import { tabKeys as jobTabKeys, payloadType } from '../../jobs.description'

const AddEditJobs = () => {
  const { t } = useTranslations()
  const { params } = useRouter()
  const [editData, setEditData] = useState(null)
  const [loader, setLoader] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const isEdit = !!params?.jobId

  useEffect(() => {
    if (isEdit) {
      getEditJobData()
    }
  }, [])

  const getEditJobData = async () => {
    setLoader(true)
    const resp = await getJobDetailApi({
      params: {
        id: params?.jobId,
        jobType: payloadType[params?.jobType],
      },
    })
    setLoader(false)
    if (!resp?.data?.id || include(resp?.data?.status, 'COMPLETED')) {
      return setNotFound(true)
    }
    setEditData({ ...resp?.data })
  }

  const getJobComponent = type => {
    const props = { jobType: type, editData }

    switch (type) {
      case jobTabKeys.inspection:
        return <InspectionJob {...props} />

      default:
        return <PageNotFound />
    }
  }

  return (
    <>
      {loader && (
        <div className="job-apiLoader">
          <ANTDSpin size="large" />
        </div>
      )}
      <h2>{ternary(isEdit, t('job_EditJob'), t('job_AddJob'))}</h2>
      {notFound ? (
        <PageNotFound />
      ) : (isEdit && !editData) || loader ? null : (
        getJobComponent(params?.jobType)
      )}
    </>
  )
}

export default AddEditJobs
