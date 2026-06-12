import { Navigate } from 'react-router-dom'

import LanguageSelector from './LanguageSelector'
import banner from '../../../assets/auth-side-image.png'
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
    <ANTDRow className="banner-image-container auth-wrap">
      <ANTDColumn xs={0} lg={12} className="banner-image">
        <div className="auth-brand">
          <img className="auth-brand-bg" src={banner} alt="" aria-hidden="true" />
          <span className="auth-aurora a1" />
          <span className="auth-aurora a2" />
          <span className="auth-aurora a3" />

          <div className="auth-brand-top">
            <img className="auth-brand-logo" src={logo} alt={APP_NAME} />
          </div>

          <div className="auth-brand-mid">
            <h1>Oversight that keeps hostels safe.</h1>
            <p>
              A single, living view of every hostel — authority, students,
              infrastructure, health and food — all in one place.
            </p>
            <ul className="auth-brand-points">
              <li>
                <span className="pt-dot" />
                Real-time monitoring &amp; compliance
              </li>
              <li>
                <span className="pt-dot" />
                Live dashboards across welfare modules
              </li>
              <li>
                <span className="pt-dot" />
                Faster inspections, fewer blind spots
              </li>
            </ul>
          </div>

          <div className="auth-brand-foot">
            ©{new Date().getFullYear()} GenbaNEXT Limited
          </div>
        </div>
      </ANTDColumn>

      <ANTDColumn xs={24} lg={12} className="auth-form-side">
        <div className="language">
          <LanguageSelector />
        </div>
        <div className="auth-content-wrapper">
          <div className="form-container">
            <div
              className="banner-container mb-15 auth-form-logo"
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
