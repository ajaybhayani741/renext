import { useEffect, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setShiftDetails, setStoreDetails } from '../../../redux/app/reducer'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import { userWiseRole } from '../../../utils/constant'
import { dayJs, estDateFormat } from '../../../utils/dayjs'
import { entries, isEqual } from '../../../utils/javascript'
import { postJobApi } from '../../jobs/jobs.api'
import { getUserList } from '../../userManagement/user.api'

const Clock = () => {
  const [time, setTime] = useState(dayJs())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayJs())
    }, 1000) // update every second
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="digital-clock">
      {estDateFormat(time).format('MM/DD/YYYY HH:mm')} EST
    </div>
  )
}

const DigitalClockWithShift = ({ showShiftSelector }) => {
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const loginUserDetails = selector(state => state.user?.profile_details)
  const storeId = selector(state => state?.app?.store?.selected)
  const shiftDetails = selector(state => state?.app?.shift)
  const { shiftId, shiftType } = shiftDetails

  useEffect(() => {
    if (showShiftSelector) {
      const getStoreListApiCall = async ({ pageNo = 1 } = {}) => {
        let params = `${pageNo}`

        const payload = { roleId: userWiseRole.store }
        entries(payload).forEach(([key, val], i) => {
          params += `${isEqual(i, 0) ? '?' : '&'}${key}=${val}`
        })
        const response = await getUserList({ params })

        dispatch(
          setStoreDetails({
            ...response?.data,
            selected: response?.data?.list?.[0]?.id,
          }),
        )
      }
      getStoreListApiCall()
    }
  }, [showShiftSelector])

  const addShiftCall = async () => {
    if (!shiftType)
      return notifyMethod.error({ message: 'msg_PleaseSelectShiftType' })
    const payload = {
      jobType: 'SHIFT_JOB',
      shiftType,
      storeId,
      userId: loginUserDetails?.id,
    }
    const resp = await postJobApi({ payload })
    if (resp?.data?.success) {
      notifyMethod.success({
        message: 'msg_ShiftStartedSuccessfully',
      })
      dispatch(setShiftDetails({ shiftId: resp?.data?.id }))
    }
  }

  const handleCloseShift = async () => {
    if (!shiftId)
      return notifyMethod.error({ message: 'msg_ThereIsNoActiveShift' })
    const payload = {
      jobType: 'SHIFT_JOB',
      shiftId,
      storeId,
      userId: loginUserDetails?.id,
    }
    const resp = await postJobApi({ payload })
    if (resp?.data?.success) {
      notifyMethod.success({
        message: 'msg_ShiftEndedSuccessfully',
      })

      dispatch(
        setShiftDetails({
          shiftType: null,
          shiftId: null,
        }),
      )
    }
  }

  const shiftOptions = [
    {
      value: 'AM1',
      label: 'AM1',
    },
    {
      value: 'AM2',
      label: 'AM2',
    },
    {
      value: 'PM1',
      label: 'PM1',
    },
    {
      value: 'PM2',
      label: 'PM2',
    },
  ]

  const handleSelectChange = value =>
    dispatch(setShiftDetails({ shiftType: value }))

  return (
    <div className="clock-shift-wrapper">
      <Clock />
      {showShiftSelector && (
        <div className="d-flex">
          <ANTDSelect
            popupMatchSelectWidth={false}
            className="shift-selector"
            placement="bottomRight"
            placeholder={t('txt_Shift')}
            options={shiftOptions}
            value={shiftType}
            onSelect={handleSelectChange}
          />
          <ANTDButton
            variant="outlined"
            className="btn"
            onClick={shiftId ? handleCloseShift : addShiftCall}
          >
            {t(shiftId ? 'btn_EndShift' : 'btn_StartShift')}
          </ANTDButton>
        </div>
      )}
    </div>
  )
}

export default DigitalClockWithShift
