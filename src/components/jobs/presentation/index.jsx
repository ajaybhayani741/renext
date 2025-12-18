import '../jobs.scss'

import withRouteAuth from '../../../hoc/withRouteAuth'
import pathName from '../../../routing/pathName.constant'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCheckbox, {
  ANTDCheckboxGroup,
} from '../../../shared/antd/ANTDCheckbox'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import { ANTDDateRange } from '../../../shared/antd/ANTDDatePicker'
import ANTDDivider from '../../../shared/antd/ANTDDivider'
import { ANTDSearch } from '../../../shared/antd/ANTDInput'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTab from '../../../shared/antd/ANTDTab'
import Label from '../../../shared/Label'
import PopUpConfirm from '../../../shared/PopUpConfirm'
import { entries, include, isEqual } from '../../../utils/javascript'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import StoreSelect from '../../common/presentation/StoreSelect'
import { sidebarMenus } from '../../layout/sidebar.description'
import jobs from '../container/jobs.container'
import { exportExcelOptions, searchByKeys, tabKeys } from '../jobs.description'
import JobTable from './JobTable'
import ViewJob from './viewJobs'
import UnassignedHostels from './viewJobs/UnassignedHostels'

const JobManagement = ({ userView = false, userId, userJobType }) => {
  const {
    t,
    data,
    tabList,
    jobModel,
    // isDesktop,
    activeTab,
    columnFilters,
    searchByProps,
    // columnFilterProps,
    selectExportColModal,
    loading,
    searchSelectOptions,
    apiCall,
    onSearch,
    handleViewClick,
    handleCloseModel,
    handleTabChange,
    handleTableChange,
    checkEditPermission,
    onExportToExcel,
    // exportExcelProps,
    onSelectExportCol,
    onSelectColumn,
    onSelectAllColumn,
    disAssociateHostel,
    handleDisAssociateModal,
    handleConfirmDisAssociate,
  } = jobs({ userView, userId, userJobType })

  const { type: jobType, status } = { ...activeTab }
  const isUnassignHostelTab = isEqual(status, tabKeys.unassignHostel)

  return (
    <>
      {userView ? (
        <JobTable
          displayColKeys={columnFilters}
          tableData={data}
          onChange={handleTableChange}
          onViewClick={handleViewClick}
          checkEditPermission={checkEditPermission}
          jobType={jobType}
          handleDisAssociateModal={handleDisAssociateModal}
          userView={userView}
        />
      ) : (
        <>
          <div className="d-flex flex-wrap space-between">
            {/* <h2 className="page-title">{t('menu_Jobs')}</h2> */}
            <StoreSelect />
          </div>
          {entries(tabList)?.map(([key, value]) =>
            value && value.length > 0 ? (
              <ANTDTab
                size="small"
                key={key}
                activeKey={activeTab?.[key]}
                className={isEqual(key, 'status') ? 'jobs-status-tab' : ''}
                items={value?.map(({ label, ...item }) => ({
                  ...item,
                  label: isEqual(key, 'status')
                    ? t(label)?.toUpperCase()
                    : t(label),
                }))}
                centered
                onChange={tab => handleTabChange({ [key]: tab })}
              />
            ) : null,
          )}
          {include([tabKeys.smeltingRequest, tabKeys.recovery], jobType) &&
            isEqual(tabKeys.complete, status) && (
              <div
                className="text-end mt-20 d-flex justify-content-end"
                style={{
                  border: '1px solid #d9d9d9',
                  padding: '8px',
                  maxWidth: 'max-content',
                  marginLeft: 'auto',
                  borderRadius: '10px',
                }}
              >
                <div className="mr-10">
                  <ANTDDateRange format="YYYY/MM/DD" />
                </div>
                <div className="mr-10">
                  {/* <ANTDSelect className="w-100" {...exportExcelProps} /> */}
                  <ANTDButton
                    type="primary"
                    onClick={onSelectExportCol}
                    loading={loading}
                  >
                    {t('job_SelectColumnsForExport')}
                  </ANTDButton>
                </div>
                <div>
                  <ANTDButton
                    type="primary"
                    onClick={onExportToExcel}
                    loading={loading}
                  >
                    {t('inv_ExportToExcel')}
                  </ANTDButton>
                </div>
              </div>
            )}
          {!isUnassignHostelTab && (
            <>
              <div className="d-flex flex-end">
                <FiscalYearSelect
                  onDateChange={(from, to) => apiCall(1, { from, to })}
                />
              </div>
              <ANTDRow gutter={10} className="mt-5">
                <ANTDColumn md={12} lg={12} xs={24}>
                  <Label text={t('job_SearchBy')} />
                  <ANTDSelect className="w-100 mb-5" {...searchByProps} />
                </ANTDColumn>
                <ANTDColumn md={12} lg={12} xs={24}>
                  <Label text={t('txt_Search')} />
                  {include(
                    [searchByKeys.recoverySource],
                    searchByProps.value,
                  ) ? (
                    <ANTDSelect
                      className="w-100 mb-5"
                      options={searchSelectOptions}
                      onChange={val => onSearch({ target: val })}
                    />
                  ) : (
                    <ANTDSearch
                      className="mb-5"
                      placeholder={t('user_Name')}
                      onChange={onSearch}
                    />
                  )}
                </ANTDColumn>
              </ANTDRow>

              {/* {isDesktop && (
                <>
                  <Label text={t('job_ColumnFilter')} />
                  <ANTDSelect className="w-100" {...columnFilterProps} />
                </>
              )} */}
            </>
          )}
          {isUnassignHostelTab ? (
            <UnassignedHostels />
          ) : (
            <JobTable
              displayColKeys={columnFilters}
              tableData={data}
              onChange={handleTableChange}
              onViewClick={handleViewClick}
              checkEditPermission={checkEditPermission}
              jobType={jobType}
              handleDisAssociateModal={handleDisAssociateModal}
            />
          )}
        </>
      )}
      {jobModel?.open && (
        <ANTDModal
          title={t('txt_Details')}
          centered
          open={jobModel?.open}
          onCancel={handleCloseModel}
          footer={false}
          width={1100}
        >
          <ViewJob
            data={jobModel?.data}
            jobType={jobType}
            loader={jobModel?.loader}
          />
        </ANTDModal>
      )}
      {selectExportColModal?.open && (
        <ANTDModal
          title={t('job_ColumnsForExport')}
          centered
          open={selectExportColModal?.open}
          onCancel={onSelectExportCol}
          footer={false}
          width={1100}
        >
          <ANTDCheckbox
            value={selectExportColModal?.selectedColumn}
            onChange={onSelectAllColumn}
            className="ml-15 "
          >
            {t('job_SelectAll')}
          </ANTDCheckbox>
          <ANTDDivider />
          <ANTDCheckboxGroup
            onChange={onSelectColumn}
            value={selectExportColModal?.selectedColumn}
          >
            <ul className="export-columns">
              {exportExcelOptions.map(({ label, value }, ind) => (
                <li key={ind}>
                  <ANTDCheckbox value={value}> {t(label)}</ANTDCheckbox>
                </li>
              ))}
            </ul>
          </ANTDCheckboxGroup>

          <div className="mt-20 text-center">
            <ANTDButton
              type="primary"
              onClick={onSelectExportCol}
              loading={loading}
            >
              {t('btn_Save')}
            </ANTDButton>
          </div>
        </ANTDModal>
      )}
      {disAssociateHostel?.open && (
        <PopUpConfirm
          isOpen={disAssociateHostel?.open}
          onCancelModel={handleDisAssociateModal}
          onAccept={handleConfirmDisAssociate}
          onReject={handleDisAssociateModal}
          description={t('msg_disassociateUser')}
        />
      )}
    </>
  )
}

const validRoles = sidebarMenus.find(({ key }) =>
  isEqual(key, pathName.JOBS),
)?.sidebar

export default withRouteAuth(JobManagement, validRoles)
