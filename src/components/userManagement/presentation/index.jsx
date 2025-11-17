import '../user.scss'

import UserList from './UserList'
import withUserRoute from '../../../hoc/withUserRoute'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { userWiseRole } from '../../../utils/constant'
import { include, length } from '../../../utils/javascript'
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
  } = userManagement()
  const { t } = useTranslations()
  const { hostel, inspectionOfficer } = userWiseRole

  return (
    <div>
      <h2 className="page-title">{t(userTitle)}</h2>
      <div className="text-end mt-10">
        {permission && (
          <ANTDButton type="primary" className="btn mb-10" onClick={handleAdd}>
            {`${t('btn_Add')}${include([hostel, inspectionOfficer], pathRoleId) ? ` ${t(userTitle)}` : ''} `}
          </ANTDButton>
        )}
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
    </div>
  )
}

export default withUserRoute(UserManagement)
