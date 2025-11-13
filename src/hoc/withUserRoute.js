import { sidebarMenus } from '../components/layout/sidebar.description'
import PageNotFound from '../components/PageNotFound'
import useRouter from '../hooks/useRouter'
import { USER_TXT, INSPECTION_OFFICER } from '../routing/pathName.constant'
import { userWiseRole } from '../utils/constant'
import { include, isEqual, ternary } from '../utils/javascript'
import { getItem } from '../utils/localstorage'

const withUserRoute = Component => {
  return props => {
    const { location } = useRouter()
    const userData = JSON.parse(getItem('userData'))
    const { roleId } = { ...userData }
    const { districtCollector } = userWiseRole

    const isValid = sidebarMenus
      .find(({ key }) => isEqual(key, USER_TXT))
      .children.some(menu => {
        if (isEqual(menu.key, location.pathname)) {
          return include(menu?.sidebar, roleId)
        }
        return null
      })

    return (
      <>
        {ternary(
          (isEqual(roleId, districtCollector) &&
            isEqual(location.pathname, `${USER_TXT}/${INSPECTION_OFFICER}`)) ||
            isValid,
          <Component {...props} />,
          <PageNotFound />,
        )}
      </>
    )
  }
}

export default withUserRoute
