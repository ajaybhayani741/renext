import { Navigate } from 'react-router-dom'

import LanguageSelector from './LanguageSelector'
import banner from '../../../assets/auth-side-image.jpg'
import useRouter from '../../../hooks/useRouter'
import pathName from '../../../routing/pathName.constant'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import configData from '../../../utils/config'
import { getItem } from '../../../utils/localstorage'
import '../../authentication/auth.scss'
import ForgotPassword from '../../authentication/presentation/ForgotPassword'
import Login from '../../authentication/presentation/Login'
import ResetPassword from '../../authentication/presentation/ResetPassword'

function Auth() {
  const { location } = useRouter()
  const { logo, APP_NAME } = configData
  const isAuth = getItem('token')
  const getComponent = () => {
    switch (location?.pathname) {
      case pathName.LOGIN:
        return Login
      case pathName.FORGOT_PASSWORD:
        return location?.search ? ResetPassword : ForgotPassword

      default:
        return Login
    }
  }
  const CurrentComponent = getComponent()

  return !isAuth ? (
    <ANTDRow className="banner-image-container">
      <ANTDColumn xs={0} lg={12} className="banner-image">
        <img src={banner} alt="banner" />
      </ANTDColumn>
      <ANTDColumn xs={24} lg={12}>
        <div className="language">
          <LanguageSelector />
        </div>
        <div className="auth-content-wrapper">
          <div className="form-container">
            <div
              className="banner-container mb-15"
              style={{ justifyItems: 'center' }}
            >
              <img src={logo} alt={APP_NAME} />
            </div>
            <CurrentComponent />
          </div>
        </div>
      </ANTDColumn>
    </ANTDRow>
  ) : (
    <Navigate to={pathName.HOME} replace={true} />
  )
}
export default Auth
