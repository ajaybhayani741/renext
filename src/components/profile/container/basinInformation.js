import { useState } from 'react'

import useRedux from '../../../hooks/useRedux'

const basinInformation = () => {
  const [editInfo, setEditInfo] = useState({ flag: false, data: {} })
  const { selector } = useRedux()
  const userDetails = selector(state => state.user?.profile_details)

  const handleEdit = () => {
    setEditInfo({ flag: true, data: userDetails })
  }

  const handleCancelEdit = () => {
    setEditInfo({ flag: false, data: {} })
  }

  return { editInfo, userDetails, handleEdit, handleCancelEdit }
}

export default basinInformation
