import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import pathName from './pathName.constant'
import { getJobListApi } from '../components/jobs/jobs.api'
import { payloadType, tabKeys } from '../components/jobs/jobs.description'
import {
  getUserList,
  getUserProfileApi,
} from '../components/userManagement/user.api'
import useRedux from '../hooks/useRedux'
import useRouter from '../hooks/useRouter'
import { setShiftDetails, setStoreDetails } from '../redux/app/reducer'
import { profileDetails } from '../redux/user_management/reducer'
import { userWiseRole } from '../utils/constant'
import { include } from '../utils/javascript'
import { getItem, setItem } from '../utils/localstorage'

const ProtectedRoute = ({ children }) => {
  const isAuth = getItem('token')
  const adminId = getItem('adminId')
  const { queryParams } = useRouter()
  const code = queryParams.get('code')
  let navigatePath = pathName.LANDING
  const userData = JSON.parse(getItem('userData'))
  const { dispatch } = useRedux()

  const { admin, storeEmployee, storeManager } = userWiseRole

  useEffect(() => {
    const getProfile = async () => {
      const response = await getUserProfileApi({
        id: userData?.id,
      })
      if (response?.data?.data) {
        setItem('userData', JSON.stringify(response?.data?.data))
        dispatch(profileDetails(response?.data?.data))
        if (!adminId) {
          const params = `${1}?roleId=${admin}`
          const resp = await getUserList({ params })
          if (resp?.data) {
            setItem('adminId', resp?.data?.list?.[0]?.id)
          }
        }
        if (include([storeEmployee, storeManager], userData?.roleId)) {
          const storeId = response?.data?.data?.parent?.id
          dispatch(
            setStoreDetails({
              selected: storeId,
            }),
          )

          const params = {
            storeId,
            jobType: payloadType[tabKeys.shift],
            fiscalYear: new Date().getFullYear(),
            active: true,
          }
          const resp = await getJobListApi({ params, pageNo: 1 })

          dispatch(
            setShiftDetails({
              shiftType: resp?.data?.list?.[0]?.shiftType,
              shiftId: resp?.data?.list?.[0]?.id,
            }),
          )
        }
      }
    }
    if (isAuth) getProfile()
  }, [])

  if (code) navigatePath += `?code=${code}`

  return isAuth ? children : <Navigate to={navigatePath} replace={true} />
}

export default ProtectedRoute
