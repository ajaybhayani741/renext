import { Fragment, memo } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDCard from '../../../shared/antd/ANTDCard'
import ANTDCheckbox from '../../../shared/antd/ANTDCheckbox'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDPagination from '../../../shared/antd/ANTDPagination'
import ANTDSpin from '../../../shared/antd/ANTDSpin'
import { noImage } from '../../../utils/icons'
import { include, length, ternary } from '../../../utils/javascript'

const UserTableCard = ({
  data,
  actionButtons,
  cardViewFn,
  pageSize,
  onChange,
  loader,
  selectedUsers,
  handleSelectChange,
}) => {
  const { t } = useTranslations()
  const scrollElem = document.querySelector('.main-layout > main')
  const usersList = selectedUsers?.map(v => v?.id)

  return (
    <>
      {loader && (
        <div className="opacity-loader fixed-loader">
          <ANTDSpin size="large" />
        </div>
      )}
      {length(data?.list) ? (
        data?.list?.map(item => (
          <Fragment key={item.id}>
            <ANTDCard
              key={item.id}
              className="list-card-view"
              title={
                <>
                  {ternary(
                    handleSelectChange,
                    <ANTDCheckbox
                      value={item}
                      onChange={handleSelectChange}
                      checked={include(usersList, item?.id)}
                    >
                      {`${t('user_ID')} : ${item?.id}`}
                    </ANTDCheckbox>,
                    `${t('user_ID')} : ${item?.id}`,
                  )}
                </>
              }
              extra={<>{actionButtons(item)}</>}
            >
              <div className="card-details-container d-flex flex-wrap space-between flex-row-reverse">
                <ANTDColumn sm={5} xs={24}>
                  <div className="card-img-wrap">
                    <img src={item?.profileUrl || noImage} alt={'profile'} />
                  </div>
                </ANTDColumn>
                <ANTDColumn sm={19} xs={24}>
                  <div>
                    <table>
                      <tbody>
                        {cardViewFn(item)?.map(({ label, value }, index) => (
                          <tr key={index}>
                            <td>
                              <b>{t(label)}</b>
                            </td>
                            <td> : {ternary(value, value, '-')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ANTDColumn>
              </div>
            </ANTDCard>
          </Fragment>
        ))
      ) : (
        <ANTDCard className="list-card-view">
          <h4 className="text-center">{t('txt_NoData')}</h4>
        </ANTDCard>
      )}
      <div className="pagination-container">
        <ANTDPagination
          current={data?.pageNo}
          pageSize={pageSize}
          total={(data?.lastPage || 0) * pageSize}
          showSizeChanger={false}
          responsive
          hideOnSinglePage
          onChange={current => {
            scrollElem?.scrollTo({ top: 0, behavior: 'auto' })
            onChange({ current })
          }}
        />
      </div>
    </>
  )
}

export default memo(UserTableCard)
