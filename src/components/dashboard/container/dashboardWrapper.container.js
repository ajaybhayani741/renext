import { useState } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { getJobDetailApi } from '../../jobs/jobs.api'
import { payloadType } from '../../jobs/jobs.description'

const dashboardWrapper = ({ title, pageNo, jobType }) => {
  const { t } = useTranslations()
  const [jobModel, setJobModel] = useState({
    open: false,
    loader: false,
    data: null,
  })
  // const condition = include(
  //   [
  //     'job_HostelAuthority',
  //     'job_RecordMaintenance',
  //     'dash_LocationBedsMattresses',
  //     'dash_WasteManagement',
  //     'dash_ToiletsSufficiency',
  //     'job_DrinkingWater',
  //     'job_MedicalCare',
  //     'dash_IsTheStaffNurseAvailableInTheHostel',
  //     'dash_EducationRequirements',
  //     'job_FoodProvisions',
  //     'dash_PrecautionaryMeasures',
  //     'dash_AnimalThreat',
  //     'dash_PrincipalHWOSpecialOfficer',
  //     'job_NatureOfCookingFuel',
  //   ],
  //   title,
  // )

  const columns = [
    {
      title: '',
      key: 'id',
      render: (_, __, index) => {
        return (pageNo - 1) * 10 + index + 1
      },
    },
    {
      title: t('user_Hostel'),
      key: 'lastName',
      render: rowData =>
        rowData?.businessName ?? rowData?.lastName ?? rowData?.name ?? '-',
      // hidden: !condition,
    },
    {
      title: t('txt_Action'),
      key: 'viewJob',
      render: rowData => {
        return (
          <ANTDButton
            type="primary"
            size="small"
            onClick={() => handleHostelClick(rowData)}
          >
            {t('txt_ViewJob')}
          </ANTDButton>
        )
      },
    },
    // {
    //   title: '',
    //   // dataIndex: ['hostel', 'name'],
    //   key: 'hostel',
    //   colSpan: 0,
    //   render: rowData => rowData?.lastName ?? rowData?.name ?? '-',
    //   hidden: condition,
    // },
    // {
    //   title: t('dash_Students'),
    //   dataIndex: 'total_students',
    //   key: 'students',
    //   render: rowData => (rowData ? `${rowData}` : '-'),
    //   hidden: condition,
    // },
  ].filter(item => !item.hidden)

  const handleCloseJobModel = () => {
    setJobModel({ ...jobModel, open: false, data: null })
  }

  const handleHostelClick = async rowData => {
    setJobModel({
      ...jobModel,
      loader: true,
    })
    const resp = await getJobDetailApi({
      params: {
        id: rowData?.jobId,
        jobType: payloadType[jobType],
      },
    })
    setJobModel({
      ...jobModel,
      data: resp?.data,
      open: true,
      loader: false,
    })
  }

  return { columns, jobModel, handleCloseJobModel, handleHostelClick }
}

export default dashboardWrapper
