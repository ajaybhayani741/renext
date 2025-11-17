import { useState } from 'react'

import { notifyMethod } from '../../../App'
import useTranslations from '../../../hooks/useTranslations'
import { userWiseRole } from '../../../utils/constant'
import { isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { tabKeys } from '../profile.description'

const profile = () => {
  const { t } = useTranslations()
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const { inspectionOfficer } = userWiseRole
  const [currentTab, setCurrentTab] = useState(tabKeys.basicInfo)

  const handleTabChange = value => {
    if (
      isEqual(roleId, inspectionOfficer) &&
      isEqual(value, tabKeys.password)
    ) {
      notifyMethod.warning({
        message: t('msg_PasswordCannotBeChanged'),
      })
      return
    }
    setCurrentTab(value)
  }

  return { currentTab, handleTabChange }
}

export default profile
