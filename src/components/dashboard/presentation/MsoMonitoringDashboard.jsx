import {
  CheckCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import { useEffect, useMemo, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import pathName from '../../../routing/pathName.constant'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../utils/constant'
import { getItem } from '../../../utils/localstorage'
import { getJobListApi } from '../../jobs/jobs.api'
import { payloadType, tabKeys } from '../../jobs/jobs.description'
import { getUserList } from '../../userManagement/user.api'
import { userRelationKey } from '../../userManagement/user.description'

const initialInstitutions = [
  {
    name: 'ZPHS Model School',
    mandal: 'Uppal',
    type: 'Residential',
    totalUnits: '12 Hostels',
    done: 8,
    pending: 0,
    lastSync: '2 hours ago',
    associatedHostels: [
      {
        id: 101,
        businessName: 'ZPHS Boys Hostel',
        name: 'ZPHS Boys Hostel',
        email: 'boys@zphs.in',
        contact: '98765 41001',
        address: 'Uppal, Hyderabad',
        lastInspection: '2026/07/01',
      },
      {
        id: 102,
        businessName: 'ZPHS Girls Hostel',
        name: 'ZPHS Girls Hostel',
        email: 'girls@zphs.in',
        contact: '98765 41002',
        address: 'Uppal, Hyderabad',
        lastInspection: '2026/07/03',
      },
    ],
    associatedInspectionOfficers: [
      {
        id: 201,
        name: 'K. Ramesh',
        designation: 'Inspection Officer',
        contact: '98765 43210',
        placeOfPosting: 'Uppal',
      },
    ],
  },
  {
    name: 'KV Central Residency',
    mandal: 'L.B. Nagar',
    type: 'Hostel',
    totalUnits: '05 Hostels',
    done: 5,
    pending: 0,
    lastSync: 'Yesterday',
    associatedHostels: [
      {
        id: 103,
        businessName: 'KV Central Hostel A',
        name: 'KV Central Hostel A',
        email: 'hostela@kvcentral.in',
        contact: '98765 41003',
        address: 'L.B. Nagar, Hyderabad',
        lastInspection: '2026/06/28',
      },
    ],
    associatedInspectionOfficers: [
      {
        id: 202,
        name: 'M. Prasad',
        designation: 'Inspection Officer',
        contact: '98765 43212',
        placeOfPosting: 'L.B. Nagar',
      },
    ],
  },
  {
    name: 'Govt Girls High School',
    mandal: 'Secunderabad',
    type: 'Residential',
    totalUnits: '08 Hostels',
    done: 0,
    pending: 2,
    lastSync: '2 days ago',
    associatedHostels: [
      {
        id: 104,
        businessName: 'Govt Girls Main Hostel',
        name: 'Govt Girls Main Hostel',
        email: 'main@gghs.in',
        contact: '98765 41004',
        address: 'Secunderabad, Hyderabad',
        lastInspection: 'Pending',
      },
    ],
    associatedInspectionOfficers: [
      {
        id: 203,
        name: 'P. Anitha',
        designation: 'Inspection Officer',
        contact: '98765 43213',
        placeOfPosting: 'Secunderabad',
      },
    ],
  },
  {
    name: 'Social Welfare School B',
    mandal: 'Malkajgiri',
    type: 'Residential',
    totalUnits: '15 Hostels',
    done: 12,
    pending: 0,
    lastSync: 'Just now',
    associatedHostels: [
      {
        id: 105,
        businessName: 'Social Welfare Hostel North',
        name: 'Social Welfare Hostel North',
        email: 'north@swsb.in',
        contact: '98765 41005',
        address: 'Malkajgiri, Hyderabad',
        lastInspection: '2026/07/10',
      },
    ],
    associatedInspectionOfficers: [
      {
        id: 204,
        name: 'D. Suresh',
        designation: 'Inspection Officer',
        contact: '98765 43215',
        placeOfPosting: 'Malkajgiri',
      },
    ],
  },
]

const hostelPool = [
  ...initialInstitutions.flatMap(item => item.associatedHostels),
  {
    id: 106,
    businessName: 'SD_hostel',
    name: 'SD_hostel',
    email: '-',
    contact: '-',
    address: 'Asifnagar, Telangana',
    lastInspection: '2026/07/08',
  },
  {
    id: 107,
    businessName: 'JB_hostel_dp',
    name: 'JB_hostel_dp',
    email: 'jb@yopmail.com',
    contact: '-',
    address: 'Hyderabad, Telangana',
    lastInspection: '2026/07/05',
  },
  {
    id: 108,
    businessName: 'state_hostel_dept',
    name: 'State Hostel Dept',
    email: '-',
    contact: '-',
    address: 'Warangal, Telangana',
    lastInspection: '2026/06/25',
  },
]

const officerPool = [
  ...initialInstitutions.flatMap(item => item.associatedInspectionOfficers),
  {
    id: 205,
    name: 'B. Kavitha',
    designation: 'Assistant Inspection Officer',
    contact: '98765 43216',
    placeOfPosting: 'Malkajgiri',
  },
  {
    id: 206,
    name: 'R. Naveen',
    designation: 'Field Inspection Officer',
    contact: '98765 43214',
    placeOfPosting: 'Secunderabad',
  },
  {
    id: 207,
    name: 'S. Lakshmi',
    designation: 'Assistant Inspection Officer',
    contact: '98765 43211',
    placeOfPosting: 'Uppal',
  },
]

const MsoMonitoringDashboard = () => {
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const { navigate } = useRouter()
  const loginUser = JSON.parse(getItem('userData') || '{}')
  const [associatedHostelCount, setAssociatedHostelCount] = useState(0)
  const [completedJobCount, setCompletedJobCount] = useState(0)
  const [institutions, setInstitutions] = useState(initialInstitutions)
  const [selectedInstitutionName, setSelectedInstitutionName] = useState(null)
  const [associationModal, setAssociationModal] = useState(null)
  const [selectedRowIds, setSelectedRowIds] = useState([])
  const fiscalYear = selector(state => state?.app?.fiscalYear?.value)
  const { hostel } = userWiseRole

  useEffect(() => {
    const getAssociatedHostelCount = async () => {
      const params = `1?roleId=${hostel}&userId=${loginUser?.id}&relationType=${userRelationKey.associate}`
      const response = await getUserList({ params })
      setAssociatedHostelCount(response?.data?.fullCount || 0)
    }

    if (loginUser?.id) {
      getAssociatedHostelCount()
    }
  }, [hostel, loginUser?.id])

  useEffect(() => {
    const getCompletedJobCount = async () => {
      const response = await getJobListApi({
        pageNo: 1,
        params: {
          jobType: payloadType[tabKeys.inspection],
          fiscalYear,
          active: false,
        },
      })
      setCompletedJobCount(response?.data?.fullCount || 0)
    }

    if (fiscalYear) {
      getCompletedJobCount()
    }
  }, [fiscalYear])

  const selectedInstitution = useMemo(
    () => institutions.find(item => item.name === selectedInstitutionName),
    [institutions, selectedInstitutionName],
  )

  const associationRows = useMemo(() => {
    if (!selectedInstitution || !associationModal) return []

    const source = associationModal === 'hostels' ? hostelPool : officerPool
    const associatedIds = new Set(
      (associationModal === 'hostels'
        ? selectedInstitution.associatedHostels
        : selectedInstitution.associatedInspectionOfficers
      ).map(item => item.id),
    )

    return source.filter(item => !associatedIds.has(item.id))
  }, [associationModal, selectedInstitution])

  const hostelSuccessPercentage = associatedHostelCount
    ? Math.round((completedJobCount / associatedHostelCount) * 100)
    : 0

  const handleCloseViewModal = () => {
    setSelectedInstitutionName(null)
    setAssociationModal(null)
    setSelectedRowIds([])
  }

  const handleCompletedJobsClick = event => {
    event.preventDefault()
    dispatch(
      setJobActiveTab({
        status: tabKeys.complete,
        type: tabKeys.inspection,
      }),
    )
    navigate(pathName.JOBS)
  }

  const openAssociationModal = type => {
    setAssociationModal(type)
    setSelectedRowIds([])
  }

  const closeAssociationModal = () => {
    setAssociationModal(null)
    setSelectedRowIds([])
  }

  const handleRowCheck = id => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    )
  }

  const handleAssociateSelected = () => {
    if (!selectedInstitution || !associationModal || !selectedRowIds.length) {
      closeAssociationModal()
      return
    }

    const key =
      associationModal === 'hostels'
        ? 'associatedHostels'
        : 'associatedInspectionOfficers'
    const selectedRows = associationRows.filter(item =>
      selectedRowIds.includes(item.id),
    )

    setInstitutions(prev =>
      prev.map(item =>
        item.name === selectedInstitution.name
          ? { ...item, [key]: [...item[key], ...selectedRows] }
          : item,
      ),
    )
    closeAssociationModal()
  }

  const modalTitle =
    associationModal === 'hostels'
      ? t('mso_StateHostelDepartment')
      : t('user_InspectionOfficer')

  return (
    <div className="mso-dashboard">
      <div className="mso-summary-grid">
        <section className="mso-summary-card">
          <div className="mso-card-title-row">
            <span>{t('mso_TotalCountMandalWise')}</span>
            <SnippetsOutlined />
          </div>
          <div className="mso-total-counts">
            <strong>
              {associatedHostelCount} {t('mso_Hostels')}
            </strong>
          </div>
          <p>{t('mso_TotalRegisteredInstitutions')}</p>
          <div className="mso-card-metrics">
            <span>
              <strong>{t('mso_Active')}</strong>
              {t('mso_Status')}
            </span>
          </div>
        </section>

        <section className="mso-summary-card">
          <div className="mso-card-title-row">
            <span>{t('mso_InspectionStatus')}</span>
            <CheckCircleOutlined />
          </div>
          <div className="mso-total-counts">
            <strong>
              <a href={pathName.JOBS} onClick={handleCompletedJobsClick}>
                {completedJobCount} {t('mso_CompletedJobs')}
              </a>
            </strong>
          </div>
          <p>{t('mso_SuccessfullyCompletedAndFiled')}</p>
          <div className="mso-card-metrics">
            <span>
              <strong>{hostelSuccessPercentage}%</strong>
              {t('mso_HostelSuccess')}
            </span>
          </div>
        </section>
      </div>


      <ANTDModal
        centered
        className="mso-view-modal"
        footer={null}
        open={Boolean(selectedInstitution)}
        title={selectedInstitution?.name}
        width={980}
        onCancel={handleCloseViewModal}
        destroyOnClose
      >
        {selectedInstitution ? (
          <div className="mso-view-modal-body">
            <div className="mso-modal-summary">
              <span>{selectedInstitution.mandal}</span>
              <span>{selectedInstitution.type}</span>
              <span>{selectedInstitution.totalUnits}</span>
            </div>

            <AssociationSection
              title={t('mso_AssociatedStateHostelDepartment')}
              onAdd={() => openAssociationModal('hostels')}
              t={t}
            >
              <table className="mso-association-table">
                <thead>
                  <tr>
                    <th>{t('mso_ID')}</th>
                    <th>{t('mso_Image')}</th>
                    <th>{t('mso_BusinessName')}</th>
                    <th>{t('mso_Name')}</th>
                    <th>{t('mso_Email')}</th>
                    <th>{t('mso_Contact')}</th>
                    <th>{t('mso_Address')}</th>
                    <th>{t('mso_LastInspection')}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInstitution.associatedHostels.map(hostel => (
                    <tr key={hostel.id}>
                      <td>{hostel.id}</td>
                      <td>
                        <span className="mso-table-avatar">{hostel.name[0]}</span>
                      </td>
                      <td>{hostel.businessName}</td>
                      <td>{hostel.name}</td>
                      <td>{hostel.email}</td>
                      <td>{hostel.contact}</td>
                      <td>{hostel.address}</td>
                      <td>{hostel.lastInspection}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </AssociationSection>

            <AssociationSection
              title={t('user_InspectionOfficer')}
              onAdd={() => openAssociationModal('officers')}
              t={t}
            >
              <table className="mso-association-table">
                <thead>
                  <tr>
                    <th>{t('mso_ID')}</th>
                    <th>{t('mso_Image')}</th>
                    <th>{t('mso_Name')}</th>
                    <th>{t('mso_Designation')}</th>
                    <th>{t('mso_Contact')}</th>
                    <th>{t('mso_PlaceOfPosting')}</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInstitution.associatedInspectionOfficers.map(
                    officer => (
                      <tr key={officer.id}>
                        <td>{officer.id}</td>
                        <td>
                          <span className="mso-table-avatar">
                            {officer.name[0]}
                          </span>
                        </td>
                        <td>{officer.name}</td>
                        <td>{officer.designation}</td>
                        <td>{officer.contact}</td>
                        <td>{officer.placeOfPosting}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </AssociationSection>
          </div>
        ) : null}
      </ANTDModal>

      <ANTDModal
        centered
        className="mso-add-association-modal"
        footer={null}
        open={Boolean(associationModal)}
        title={modalTitle}
        width={1000}
        onCancel={closeAssociationModal}
        destroyOnClose
      >
        <div className="mso-add-modal-actions">
          <button
            type="button"
            className="mso-association-ok-button"
            onClick={handleAssociateSelected}
          >
            {t('mso_OK')}
          </button>
        </div>
        <label className="mso-modal-search">
          <input placeholder={t('mso_BusinessName')} />
          <button type="button" aria-label={t('mso_Search')}>
            <SearchOutlined />
          </button>
        </label>
        <div className="mso-table-scroll">
          {associationModal === 'hostels' ? (
            <SelectableHostelTable
              rows={associationRows}
              selectedRowIds={selectedRowIds}
              onCheck={handleRowCheck}
            />
          ) : (
            <SelectableOfficerTable
              rows={associationRows}
              selectedRowIds={selectedRowIds}
              onCheck={handleRowCheck}
            />
          )}
        </div>
      </ANTDModal>
    </div>
  )
}

const AssociationSection = ({ title, onAdd, children, t }) => (
  <section className="mso-association-section">
    <div className="mso-association-heading">
      <h3>{title}</h3>
      <button type="button" onClick={onAdd}>
        {t('btn_Add')} <PlusOutlined />
      </button>
    </div>
    <div className="mso-association-table-wrap">{children}</div>
  </section>
)

const SelectableHostelTable = ({ rows, selectedRowIds, onCheck }) => {
  const { t } = useTranslations()

  return (
    <table className="mso-association-table mso-selection-table">
      <thead>
        <tr>
          <th>{t('mso_Select')}</th>
          <th>{t('mso_ID')}</th>
          <th>{t('mso_Image')}</th>
          <th>{t('mso_BusinessName')}</th>
          <th>{t('mso_Name')}</th>
          <th>{t('mso_Email')}</th>
          <th>{t('mso_Contact')}</th>
          <th>{t('mso_Action')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map(row => (
            <tr key={row.id}>
              <td>
                <input
                  checked={selectedRowIds.includes(row.id)}
                  type="checkbox"
                  onChange={() => onCheck(row.id)}
                />
              </td>
              <td>{row.id}</td>
              <td>
                <span className="mso-table-avatar">{row.name[0]}</span>
              </td>
              <td>{row.businessName}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>{row.contact}</td>
              <td>
                <button type="button" className="mso-table-view-action">
                  {t('btn_View')}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="mso-no-data">
              {t('txt_NoData')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

const SelectableOfficerTable = ({ rows, selectedRowIds, onCheck }) => {
  const { t } = useTranslations()

  return (
    <table className="mso-association-table mso-selection-table">
      <thead>
        <tr>
          <th>{t('mso_Select')}</th>
          <th>{t('mso_ID')}</th>
          <th>{t('mso_Image')}</th>
          <th>{t('mso_Name')}</th>
          <th>{t('mso_Designation')}</th>
          <th>{t('mso_Contact')}</th>
          <th>{t('mso_PlaceOfPosting')}</th>
          <th>{t('mso_Action')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length ? (
          rows.map(row => (
            <tr key={row.id}>
              <td>
                <input
                  checked={selectedRowIds.includes(row.id)}
                  type="checkbox"
                  onChange={() => onCheck(row.id)}
                />
              </td>
              <td>{row.id}</td>
              <td>
                <span className="mso-table-avatar">{row.name[0]}</span>
              </td>
              <td>{row.name}</td>
              <td>{row.designation}</td>
              <td>{row.contact}</td>
              <td>{row.placeOfPosting}</td>
              <td>
                <button type="button" className="mso-table-view-action">
                  {t('btn_View')}
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="mso-no-data">
              {t('txt_NoData')}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default MsoMonitoringDashboard

