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
import { setJobActiveTab } from '../redux/jobs/reducer'
import { profileDetails } from '../redux/user_management/reducer'
import { userWiseRole } from '../utils/constant'
import { include, isEqual } from '../utils/javascript'
import { getItem, removeItem, setItem } from '../utils/localstorage'

const ProtectedRoute = ({ children }) => {
  const isAuth = getItem('token')
  const adminId = getItem('adminId')
  const userId = getItem('userId')
  const isUrlAuthLogin = getItem('urlAuthLogin')
  const { navigate, queryParams } = useRouter()
  const code = queryParams.get('code')
  let navigatePath = pathName.LANDING
  const userData = JSON.parse(getItem('userData'))
  const { dispatch } = useRedux()

  const { admin, inspectionOfficer, storeEmployee, storeManager } = userWiseRole

  useEffect(() => {
    const getProfile = async () => {
      const response = await getUserProfileApi({
        id: userData?.id || userId,
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
        if (isUrlAuthLogin) {
          removeItem('urlAuthLogin')
          if (isEqual(response?.data?.data?.roleId, inspectionOfficer)) {
            dispatch(
              setJobActiveTab({
                status: tabKeys.active,
                type: tabKeys.inspection,
              }),
            )
            navigate(pathName.JOBS, { replace: true })
            return
          }
          navigate(pathName.HOME, { replace: true })
          return
        }
        if (include([storeEmployee, storeManager], response?.data?.data?.roleId)) {
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
