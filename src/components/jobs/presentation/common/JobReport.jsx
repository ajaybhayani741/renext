import React from 'react'

import JobReportUI from './JobReportUI'
import ReportView from './ReportView'
import ShareReport from './ShareReport'
import UpdateReport from './UpdateReport'
import ANTDSpin from '../../../../shared/antd/ANTDSpin'
import { include, ternary } from '../../../../utils/javascript'
import { getItem } from '../../../../utils/localstorage'
import { countryLabels } from '../../../userManagement/addressData'
import jobReport from '../../container/jobReport.container'

const JobReport = ({
  tags,
  reportList,
  jobType,
  jobId,
  isUpdatedDate = true,
  hideShareUpdate,
  apiCall,
  userUpdationReport,
  updateReportAttr,
}) => {
  const {
    shareReport,
    reportTypes,
    reportView,
    updateReport,
    shareCertificateForm,
    loader,
    onPdfClick,
    setReportView,
    onShareClick,
    setShareReport,
    setUpdateReport,
    onUpdateClick,
    onFinish,
    onValuesChange,
    onUpdateFormSubmit,
  } = jobReport({
    jobType,
    jobId,
    apiCall,
  })
  const currentReport = userUpdationReport?.[reportTypes?.[0]?.type]
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const {
    customerBusinessName,
    customerPhoneNumber,
    buildingName,
    buildingAddress,
    buildingCity,
    buildingState,
    buildingCountry,
    buildingPincode,
    customerAddress,
    customerCity,
    customerState,
    customerCountry,
    customerPincode,
  } = {
    ...currentReport,
  }

  const addressConcat = (...arg) => {
    const addressStr = arg.filter(val => val).join(', ')
    return ternary(addressStr, `${addressStr}.`, '-')
  }

  const repairJob = {
    job_CustomerBusinessName: {
      type: 'text',
      key: 'customerBusinessName',
      currentValue: customerBusinessName,
    },
    job_CustomerAddress: {
      type: 'address',
      key: 'customer',
      currentValue: addressConcat(
        customerAddress,
        customerCity,
        customerState,
        countryLabels?.[customerCountry],
        customerPincode,
      ),
    },
    job_CustomerContactNumber: {
      type: 'customerPhoneNumber',
      key: 'customerPhoneNumber',
      currentValue: customerPhoneNumber,
      validate: true,
    },
    job_SiteAddress: {
      type: 'address',
      key: 'building',
      currentValue: addressConcat(
        buildingAddress,
        buildingCity,
        buildingState,
        countryLabels?.[buildingCountry],
        buildingPincode,
      ),
    },
    job_SiteName: {
      type: 'text',
      key: 'buildingName',
      currentValue: buildingName,
    },
  }

  return (
    <div className="report-list-wrapper">
      {reportList?.isLoading && (
        <div className="job-apiLoader">
          <ANTDSpin />
        </div>
      )}
      {reportTypes?.map(
        (val, index) =>
          !include(val?.hidden, roleId) && (
            <div className="report-list" key={index}>
              <JobReportUI
                {...{
                  val,
                  onPdfClick,
                  // reportLink: reportList?.data?.[val?.type],
                  reportLink: reportList?.data,
                  isUpdatedDate,
                  onShareClick,
                  hideShareUpdate,
                  onUpdateClick,
                  tags,
                }}
              />
            </div>
          ),
      )}
      {reportView?.isOpen && <ReportView {...{ reportView, setReportView }} />}
      {shareReport?.isOpen && (
        <ShareReport
          {...{
            shareReport,
            setShareReport,
            onFinish,
            onValuesChange,
            shareCertificateForm,
            loader,
          }}
        />
      )}
      {updateReport?.isOpen && (
        <UpdateReport
          formAttr={updateReportAttr || repairJob}
          updateReport={updateReport}
          setUpdateReport={setUpdateReport}
          onSubmit={onUpdateFormSubmit}
          loader={loader?.updateCert}
        />
      )}
    </div>
  )
}

export default JobReport
