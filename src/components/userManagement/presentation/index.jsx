import '../user.scss'

import UserList from './UserList'
import ViewPreviousRequests from './ViewPreviousRequests'
import withUserRoute from '../../../hoc/withUserRoute'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { userWiseRole } from '../../../utils/constant'
import { include, isEqual, length } from '../../../utils/javascript'
import userManagement from '../container/userManagement.container'

const UserManagement = () => {
  const {
    adminId,
    userTitle,
    permission,
    defaultPayload,
    currentUserView,
    handleAdd,
    pathRoleId,
    onExportToExcel,
    onViewPreviousRequests,
    viewRequestsModal,
    excelLoader,
  } = userManagement()
  const { t } = useTranslations()
  const { hostel, inspectionOfficer } = userWiseRole

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-10" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <h2 className="page-title" style={{ margin: 0 }}>{t(userTitle)}</h2>
        <div className="text-end d-flex justify-content-end" style={{ gap: '10px' }}>
          {isEqual(defaultPayload?.roleId, hostel) ? (
            <>
              {/* <FiscalYearSelect className="ml-auto mb-10" setDefault={false} /> */}
              <div className="d-flex justify-content-end">
                <ANTDButton
                  type="primary"
                  className="btn"
                  onClick={onExportToExcel}
                  loading={excelLoader}
                >
                  {t('dash_ExportToExcel')}
                </ANTDButton>
                <ANTDButton
                  type="primary"
                  className="btn mx-3"
                  onClick={onViewPreviousRequests}
                >
                  {t('job_ViewPreviousRequests')}
                </ANTDButton>
              </div>
            </>
          ) : null}
          {permission && (
            <ANTDButton type="primary" className="btn" onClick={handleAdd}>
              {`${t('btn_Add')}${include([hostel, inspectionOfficer], pathRoleId) ? ` ${t(userTitle)}` : ''} `}
            </ANTDButton>
          )}
        </div>
      </div>
      {length(currentUserView) ? (
        currentUserView?.map((item, index) => {
          const { payload, subTitle, needParent } = { ...item }

          return (
            <UserList
              key={`${userTitle}+${index}`}
              isSearch={true}
              {...{
                permission,
                payload: { ...payload, ...(needParent && { userId: adminId }) },
                subTitle,
              }}
            />
          )
        })
      ) : (
        <UserList
          key={userTitle}
          isSearch={true}
          {...{
            permission,
            payload: defaultPayload,
          }}
        />
      )}
      {viewRequestsModal?.open && (
        <ANTDModal
          title={t('job_ViewPreviousRequests')}
          centered
          open={viewRequestsModal?.open}
          onCancel={onViewPreviousRequests}
          footer={false}
          width={900}
        >
          <ViewPreviousRequests modal={viewRequestsModal} />
        </ANTDModal>
      )}
    </div>
  )
}

export default withUserRoute(UserManagement)
