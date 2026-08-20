import { useEffect } from 'react'

import useRedux from './useRedux'
import { getMandalsApi } from '../components/userManagement/user.api'
import { setMandalDetails } from '../redux/user_management/reducer'
import { formatDistrict } from '../utils/customFunctions'

const useMandalDetails = () => {
  const { dispatch, selector } = useRedux()
  const district = selector(state =>
    formatDistrict(state.user?.profile_details?.district),
  )
  const mandalDetails = selector(
    state => state.user?.mandalDetails?.[district],
  )

  useEffect(() => {
    if (!district || mandalDetails !== undefined) return

    const getMandalDetails = async () => {
      const response = await getMandalsApi({ district })
      dispatch(
        setMandalDetails({ district, mandals: response?.data?.list || [] }),
      )
    }

    getMandalDetails()
  }, [dispatch, district, mandalDetails])

  return mandalDetails || []
}

export default useMandalDetails
