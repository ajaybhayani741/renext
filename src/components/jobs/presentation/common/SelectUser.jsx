import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDCheckbox from '../../../../shared/antd/ANTDCheckbox'
import { ANTDDatePicker } from '../../../../shared/antd/ANTDDatePicker'
import { dayJs } from '../../../../utils/dayjs'
import { keys, length, ternary } from '../../../../utils/javascript'
import UserTable from '../../../userManagement/presentation/UserTable'

function SelectUser({
  selectTitle,
  isSelect,
  isClear,
  agreeDealer,
  userData,
  handleSelectUserPopup,
  index,
  onContractDealerChange,
  onUserClear,
  isBuilding,
  customerInfo,
  removeEditBtn,
  payload,
  searchByEmail,
  isCardView,
  ...rest
}) {
  const { t } = useTranslations()
  return (
    <>
      <div className="mb-20 select-user-card">
        <div className="mb-10 d-flex space-between title">
          <h3>{t(selectTitle)}</h3>
          {isSelect && (
            <ANTDButton
              type="primary"
              className="btn"
              onClick={() =>
                handleSelectUserPopup({
                  userId: rest?.userId,
                  index,
                  parent: true,
                })
              }
            >
              {t('btn_Select')}
            </ANTDButton>
          )}
        </div>
        {agreeDealer && (
          <>
            <p>
              <ANTDCheckbox
                className="mb-10"
                onChange={e => onContractDealerChange(e, index)}
                checked={userData?.[0]?.contract || false}
              >
                {t('job_DealerAgreesToContractToDealer', {
                  first: index,
                  second: index + 1,
                })}
              </ANTDCheckbox>
            </p>
            <ANTDDatePicker
              className="mb-10"
              value={ternary(
                userData?.[0]?.date,
                dayJs(userData?.[0]?.date),
                '',
              )}
              onChange={(_, date) => onContractDealerChange(date, index)}
            />
          </>
        )}
        <UserTable
          userData={{
            loader: false,
            list: length(keys(userData?.[0]))
              ? userData?.map(data => ({ ...data, key: data?.id }))
              : [],
          }}
          isBuilding={isBuilding}
          customerInfo={customerInfo}
          permission={false}
          pagination={false}
          removeEditBtn={removeEditBtn}
          payload={payload}
          searchByEmail={searchByEmail}
          isCardView={isCardView}
          className="user-card"
        />
        {isClear && (
          <div className="mt-10">
            <ANTDButton
              type="primary"
              className="btn"
              onClick={() => onUserClear(rest?.userId, index)}
            >
              {t('txt_Clear')}
            </ANTDButton>
          </div>
        )}
      </div>
    </>
  )
}

export default SelectUser
