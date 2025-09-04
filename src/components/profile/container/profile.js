import { useState } from 'react'

import { tabKeys } from '../profile.description'

const profile = () => {
  const [currentTab, setCurrentTab] = useState(tabKeys.basicInfo)

  const handleTabChange = value => {
    setCurrentTab(value)
  }

  return { currentTab, handleTabChange }
}

export default profile
