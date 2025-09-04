import PageNotFound from '../components/PageNotFound'
import { include, ternary } from '../utils/javascript'
import { getItem } from '../utils/localstorage'

const withRouteAuth = (Component, validRoles) => {
  return props => {
    const userData = JSON.parse(getItem('userData'))
    const { roleId } = { ...userData }
    const isValid = include(validRoles, roleId)

    return <>{ternary(isValid, <Component {...props} />, <PageNotFound />)}</>
  }
}

export default withRouteAuth
