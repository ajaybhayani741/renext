import useRouter from '../../../hooks/useRouter'
import { include, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { userChildrenList } from '../../layout/sidebar.description'
import {
  associateKey,
  roleIdByPath,
  userTranslationKey,
} from '../user.description'

const userManagement = () => {
  const { params, location, navigate } = useRouter()
  const { userType } = params
  const pathRoleId = roleIdByPath[userType]
  const userTitle = pathRoleId && userTranslationKey[pathRoleId]
  const userDetails = JSON.parse(getItem('userData'))
  const { roleId, adminId } = { ...userDetails }
  let permission = false
  const userViewObj = userChildrenList.find(v =>
    isEqual(v?.userId, roleId),
  )?.userView
  const currentUserView =
    userViewObj?.[userTitle] || userViewObj?.[associateKey[userTitle]]

  const defaultPayload = { roleId: pathRoleId }

  userChildrenList.forEach(value => {
    if (isEqual(value?.label, userTitle)) {
      permission = include(value.addEdit, roleId)
    }
  })

  const handleAdd = () => {
    navigate(`${location.pathname}/add`)
  }

  return {
    adminId,
    userTitle,
    permission,
    defaultPayload,
    currentUserView,
    handleAdd,
    pathRoleId,
  }
}

export default userManagement
