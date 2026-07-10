import {
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'
import { useMemo, useState } from 'react'

import ANTDModal from '../../../shared/antd/ANTDModal'

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

const dateFilters = ['Weekly', 'Monthly', 'Yearly']

const MsoMonitoringDashboard = () => {
  const [institutions, setInstitutions] = useState(initialInstitutions)
  const [selectedInstitutionName, setSelectedInstitutionName] = useState(null)
  const [associationModal, setAssociationModal] = useState(null)
  const [selectedRowIds, setSelectedRowIds] = useState([])

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

  const handleCloseViewModal = () => {
    setSelectedInstitutionName(null)
    setAssociationModal(null)
    setSelectedRowIds([])
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
      ? 'State Hostel Department'
      : 'Inspection Officer'

  return (
    <div className="mso-dashboard">
      <div className="mso-date-filter" aria-label="Date filter">
        {dateFilters.map((filter, index) => (
          <button
            type="button"
            className={index === 0 ? 'active' : ''}
            key={filter}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mso-summary-grid">
        <section className="mso-summary-card">
          <div className="mso-card-title-row">
            <span>Total Count Mandal Wise</span>
            <SnippetsOutlined />
          </div>
          <div className="mso-total-counts">
            <strong>112 Hostels</strong>
          </div>
          <p>Total registered institutions</p>
          <div className="mso-card-metrics">
            <span>
              <strong>100%</strong>
              Coverage
            </span>
            <span>
              <strong>Active</strong>
              Status
            </span>
          </div>
        </section>

        <section className="mso-summary-card">
          <div className="mso-card-title-row">
            <span>Inspection Status</span>
            <CheckCircleOutlined />
          </div>
          <div className="mso-total-counts">
            <strong>25 Hostels</strong>
          </div>
          <p>Successfully completed and filed</p>
          <div className="mso-card-metrics">
            <span>
              <strong>62%</strong>
              Hostel Success
            </span>
          </div>
        </section>
      </div>

      <section className="mso-table-panel">
        <div className="mso-toolbar">
          <label className="mso-search">
            <SearchOutlined />
            <input placeholder="Search by School or Mandal Name..." />
          </label>
          <button type="button" className="mso-light-button">
            <FilterOutlined />
            Filters
          </button>
          <button type="button" className="mso-link-button">
            <DownloadOutlined />
            Export CSV
          </button>
          <button type="button" className="mso-dark-button">
            Generate Report
          </button>
        </div>

        <div className="mso-table-scroll">
          <table className="mso-institution-table">
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Mandal</th>
                <th>Type</th>
                <th>Total Units</th>
                <th>Inspection Done</th>
                <th>Last Sync</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map(item => (
                <tr key={item.name}>
                  <td>
                    <div className="mso-institution-name">
                      <span>{item.name.charAt(0)}</span>
                      <strong>{item.name}</strong>
                    </div>
                  </td>
                  <td>{item.mandal}</td>
                  <td>
                    <span className="mso-type-pill">{item.type}</span>
                  </td>
                  <td>{item.totalUnits}</td>
                  <td>
                    {item.done ? (
                      <span className="mso-done">{item.done} Done</span>
                    ) : (
                      <span className="mso-pending">
                        {item.pending} Pending
                      </span>
                    )}
                  </td>
                  <td>{item.lastSync}</td>
                  <td>
                    <button
                      type="button"
                      className="mso-view-button"
                      aria-label={`View ${item.name}`}
                      onClick={() => setSelectedInstitutionName(item.name)}
                    >
                      <EyeOutlined />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mso-table-footer">
          <span>Showing 1-4 of 48 institutions</span>
          <div className="mso-pagination">
            <button type="button" className="active">
              1
            </button>
            <button type="button">2</button>
            <button type="button">3</button>
          </div>
        </div>
      </section>

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
              title="Associated State Hostel Department"
              onAdd={() => openAssociationModal('hostels')}
            >
              <table className="mso-association-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Business Name</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Last Inspection</th>
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
              title="Inspection Officer"
              onAdd={() => openAssociationModal('officers')}
            >
              <table className="mso-association-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Contact</th>
                    <th>Place of Posting</th>
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
            OK
          </button>
        </div>
        <label className="mso-modal-search">
          <input placeholder="Business Name" />
          <button type="button" aria-label="Search">
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

const AssociationSection = ({ title, onAdd, children }) => (
  <section className="mso-association-section">
    <div className="mso-association-heading">
      <h3>{title}</h3>
      <button type="button" onClick={onAdd}>
        Add <PlusOutlined />
      </button>
    </div>
    <div className="mso-association-table-wrap">{children}</div>
  </section>
)

const SelectableHostelTable = ({ rows, selectedRowIds, onCheck }) => (
  <table className="mso-association-table mso-selection-table">
    <thead>
      <tr>
        <th>Select</th>
        <th>ID</th>
        <th>Image</th>
        <th>Business Name</th>
        <th>Name</th>
        <th>Email</th>
        <th>Contact</th>
        <th>Action</th>
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
                View
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="mso-no-data">
            No Data
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

const SelectableOfficerTable = ({ rows, selectedRowIds, onCheck }) => (
  <table className="mso-association-table mso-selection-table">
    <thead>
      <tr>
        <th>Select</th>
        <th>ID</th>
        <th>Image</th>
        <th>Name</th>
        <th>Designation</th>
        <th>Contact</th>
        <th>Place of Posting</th>
        <th>Action</th>
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
                View
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="mso-no-data">
            No Data
          </td>
        </tr>
      )}
    </tbody>
  </table>
)

export default MsoMonitoringDashboard
