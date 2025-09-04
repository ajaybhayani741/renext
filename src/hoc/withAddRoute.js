import { sidebarMenus } from '../components/layout/sidebar.description'
import PageNotFound from '../components/PageNotFound'
import useRouter from '../hooks/useRouter'
import { USER_TXT } from '../routing/pathName.constant'
import { include, isEqual, ternary } from '../utils/javascript'
import { getItem } from '../utils/localstorage'

const withAddRoute = Component => {
  return props => {
    const { location } = useRouter()
    const userData = JSON.parse(getItem('userData'))
    const { roleId } = { ...userData }
    const isValid = sidebarMenus
      .find(({ key }) => isEqual(key, USER_TXT))
      .children.some(menu => {
        if (isEqual(`${menu.key}/add`, location.pathname)) {
          return include(menu?.addEdit, roleId)
        }
        return null
      })

    return <>{ternary(isValid, <Component {...props} />, <PageNotFound />)}</>
  }
}

export default withAddRoute
