import ExcelIcon from '../../../assets/excel.png'
import PdfIcon from '../../../assets/pdfIcon.png'
import useRedux from '../../../hooks/useRedux'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDProgress from '../../../shared/antd/ANTDProgress'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import ANTDTable from '../../../shared/antd/ANTDTable'
import ANTDTag from '../../../shared/antd/ANTDTag'
import { include, isEqual, length, ternary } from '../../../utils/javascript'
import jobTable from '../container/jobTable.container'
import { jobStatusList, tabKeys } from '../jobs.description'

const JobTable = ({
  displayColKeys,
  tableData,
  onChange,
  onViewClick,
  checkEditPermission,
  jobType,
  selectedJobs,
  handleSelectChange,
  readyOnly,
  handleDisAssociateModal,
  userView,
}) => {
  const { selector } = useRedux()
  const {
    t,
    columns,
    isDesktop,
    cardViewFn,
    actionButtons,
    reportDownloadModal,
    handleDownloadReportModal,
    downloadReportFn,
  } = jobTable({
    displayColKeys,
    onViewClick,
    checkEditPermission,
    jobType,
    selectedJobs,
    handleSelectChange,
    readyOnly,
    handleDisAssociateModal,
    userView,
  })
  const pageSize = 10
  const { list, pageNo, lastPage, loader } = { ...tableData }
  // const isAnyUnread = length(list) && list?.some(record => !record?.read)
  const scrollElem = document.querySelector('.main-layout > main')
  const activeTab = selector(state => state?.jobs?.activeTab)

  return (
    <>
      {ternary(
        isDesktop,
        <ANTDTable
          className="mt-10 job-table"
          columns={columns}
          loading={loader}
          dataSource={list?.map(val => ({ ...val, key: val?.id })) || []}
          onChange={onChange}
          rowClassName={record => (!record?.read ? 'read-report' : '')}
          pagination={{
            lastFetched: pageNo,
            current: pageNo,
            pageSize: pageSize,
            total: lastPage * pageSize,
            responsive: true,
            hideOnSinglePage: true,
          }}
          scroll={{
            x: '100%',
          }}
        />,
        <div className="mt-20">
          {loader && (
            <div className="job-apiLoader fixed-loader">
              <ANTDSpin size="large" />
            </div>
          )}
          {length(list) ? (
            list?.map((item, index) => (
              <ANTDCard
                key={item.id}
                className={`list-card-view`}
                style={{
                  marginBottom: index === list?.length - 1 ? '0' : '',
                }}
                title={null}
                extra={
                  <div className="card-extra-buttons">
                    {!item?.read && (
                      <div className="blink-btn ml-10">
                        <ANTDButton>{t('txt_New')}</ANTDButton>
                      </div>
                    )}
                    {actionButtons(item)}
                  </div>
                }
              >
                <div className="card-details-container d-flex flex-wrap space-between flex-row-reverse">
                  {/* <ANTDColumn sm={5} xs={24}>
                    <div className="card-img-wrap">
                      <img
                        src={item?.contractorInfo?.profileUrl || noImage}
                        alt={'profile'}
                      />
                    </div>
                  </ANTDColumn> */}
                  <ANTDColumn xs={24}>
                    <div>
                      <table>
                        <tbody>
                          {cardViewFn(item)?.map(({ label, value }, index) => (
                            <tr key={index}>
                              <td>
                                <b>{t(label)}</b>
                              </td>
                              <td
                                className={`${isEqual(label, 'job_Status') ? 'status-progress' : ''}`}
                              >
                                :
                                {isEqual(label, 'job_Status') ? (
                                  <>
                                    {' '}
                                    {isEqual(
                                      activeTab?.status,
                                      tabKeys.active,
                                    ) ? (
                                      <ANTDProgress
                                        percent={
                                          Number(
                                            item?.progressPercentage || 0,
                                          ) || 0
                                        }
                                        percentPosition={{
                                          align: 'center',
                                          type: 'inner',
                                        }}
                                        size={[100, 20]}
                                        strokeColor="#FA8128"
                                      />
                                    ) : (
                                      <ANTDTag
                                        color={
                                          include(value, 'INPROGRESS')
                                            ? '#FA8128'
                                            : '#40A368'
                                        }
                                      >
                                        {t(jobStatusList?.[value])}
                                      </ANTDTag>
                                    )}
                                  </>
                                ) : (
                                  ternary(value, value, '-')
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ANTDColumn>
                </div>
              </ANTDCard>
            ))
          ) : (
            <ANTDCard className="list-card-view">
              <h4 className="text-center">{t('txt_NoData')}</h4>
            </ANTDCard>
          )}
          <div className="pagination-container">
            <ANTDPagination
              current={pageNo}
              pageSize={pageSize}
              total={(lastPage || 0) * pageSize}
              showSizeChanger={false}
              responsive
              hideOnSinglePage
              onChange={current => {
                scrollElem?.scrollTo({ top: 0, behavior: 'auto' })
                onChange({ current })
              }}
            />
          </div>
        </div>,
      )}
      {reportDownloadModal?.open && (
        <ANTDModal
          title={t('btn_Download')}
          open={reportDownloadModal?.open}
          onCancel={handleDownloadReportModal}
          centered
          width={300}
          footer={[]}
        >
          <div className="d-flex space-around mt-30 mb-20">
            <img
              src={ExcelIcon}
              alt="excel"
              width="70"
              height="80"
              className="cursor-pointer"
              onClick={() =>
                downloadReportFn(
                  reportDownloadModal?.data?.inspectionJobSheetDetails,
                  'xls',
                )
              }
            />
            <img
              src={PdfIcon}
              alt="pdf"
              width="70"
              height="80"
              className="cursor-pointer"
              onClick={() =>
                downloadReportFn(
                  reportDownloadModal?.data?.inspectionJobReportDetails,
                  'pdf',
                )
              }
            />
          </div>
        </ANTDModal>
      )}
    </>
  )
}

export default JobTable
