import { Fragment } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import { dayJs, DISPLAY_DATE_FORMAT } from '../../../../utils/dayjs'
import { keys, length, entries } from '../../../../utils/javascript'
import UserTable from '../../../userManagement/presentation/UserTable'
import InspectionDetailsView from '../addJobs/inspection/InspectionDetailsView'
import DetailListView from '../common/DetailListView'

const InspectionJobView = ({ data, loader }) => {
  const { t } = useTranslations()

  const infoData = {
    user_BasicInformation: [
      { label: 'user_ID', value: data?.id },
      { label: 'job_DateOfInspectionAndTime', value: data?.inspectionDate },
      {
        label: 'user_CreationDate',
        value: data?.creationDate
          ? dayJs(data?.creationDate).format(DISPLAY_DATE_FORMAT)
          : '-',
      },
      { label: 'job_Status', value: t(data?.status) },
    ],
  }

  const userInfo = {
    user_InspectionOfficer: data?.userInfo,
  }

  const inspectionData = [
    {
      hostel: data?.hostelInfo,
    },
  ]

  return (
    <>
      <DetailListView infoData={infoData} title="job_InspectionJob" />

      {entries(userInfo).map(([key, userData]) => (
        <Fragment key={key}>
          <h2 className="content-title">{t(key)}</h2>
          <UserTable
            className="mb-15"
            userData={{
              loader: false,
              list: length(keys(userData)) ? [userData] : [],
            }}
            permission={false}
            pagination={false}
          />
        </Fragment>
      ))}

      <InspectionDetailsView inspectionData={inspectionData} />
    </>
  )
}

export default InspectionJobView
