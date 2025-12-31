import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import ANTDTable from '../../../shared/antd/ANTDTable'
import ANTDTag from '../../../shared/antd/ANTDTag'
import { include, isEqual, length, ternary } from '../../../utils/javascript'
import jobTable from '../container/jobTable.container'
import { jobStatusList } from '../jobs.description'

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
  const { t, columns, isDesktop, cardViewFn, actionButtons } = jobTable({
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
                className={`list-card-view `}
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
                              <td className="d-flex">
                                <p>: </p>&nbsp;
                                <p>
                                  {isEqual(label, 'job_Status') ? (
                                    <>
                                      {' '}
                                      <ANTDTag
                                        color={
                                          include(value, 'INPROGRESS')
                                            ? '#FA8128'
                                            : '#40A368'
                                        }
                                      >
                                        {t(jobStatusList?.[value])}
                                      </ANTDTag>
                                    </>
                                  ) : (
                                    ternary(value, value, '-')
                                  )}
                                </p>
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
    </>
  )
}

export default JobTable
