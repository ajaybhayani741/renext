import '../user.scss'

import UserList from './UserList'
import withUserRoute from '../../../hoc/withUserRoute'
import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { length } from '../../../utils/javascript'
import userManagement from '../container/userManagement.container'

const UserManagement = () => {
  const {
    adminId,
    userTitle,
    permission,
    defaultPayload,
    currentUserView,
    handleAdd,
  } = userManagement()
  const { t } = useTranslations()

  return (
    <div>
      <h2 className="page-title c-white">{t(userTitle)}</h2>
      <div className="text-end mt-10">
        {permission && (
          <ANTDButton type="primary" className="btn" onClick={handleAdd}>
            {t('btn_Add')}
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
