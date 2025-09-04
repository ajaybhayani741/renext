import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDToolTip from '../../../shared/antd/ANTDTooltip'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { include } from '../../../utils/javascript'

const WelcomeUser = () => {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const profileDetails = selector(state => state.user?.profile_details)
  const { businessName, roleId, lastName } = {
    ...profileDetails,
  }

  const { storeEmployee } = userWiseRole

  return (
    <div className="username">
      <span>{t('txt_Welcome')}</span>
      <span className="user_name">
        <ANTDToolTip>
          <span className="review-text">
            {include([...childUsers, storeEmployee], roleId)
              ? lastName
              : businessName}
          </span>
        </ANTDToolTip>
      </span>
    </div>
  )
}

export default WelcomeUser
