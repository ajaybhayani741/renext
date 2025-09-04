import '../common.scss'

import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import { setStoreDetails } from '../../../redux/app/reducer'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import { userWiseRole } from '../../../utils/constant'
import { entries, include, isEqual } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { getUserList } from '../../userManagement/user.api'

const StoreSelectUI = () => {
  const { t } = useTranslations()
  const { dispatch, selector } = useRedux()
  const storeDetails = selector(state => state?.app?.store)
  const [loader, setLoader] = useState(false)

  const { list, selected } = storeDetails || {}

  useEffect(() => {
    getStoreListApiCall()
  }, [])

  const getStoreListApiCall = async ({ pageNo = 1 } = {}) => {
    let params = `${pageNo}`
    setLoader(true)

    const payload = { roleId: userWiseRole.store }
    entries(payload).forEach(([key, val], i) => {
      params += `${isEqual(i, 0) ? '?' : '&'}${key}=${val}`
    })
    const response = await getUserList({ params })

    setLoader(false)
    dispatch(
      setStoreDetails({
        ...response?.data,
        selected: selected || response?.data?.list?.[0]?.id,
        storeCode: response?.data?.list?.[0]?.storeCode,
        companyCode: response?.data?.list?.[0]?.parentDetails?.companyCode,
      }),
    )
  }

  const handleSelectChange = value => {
    dispatch(
      setStoreDetails({
        selected: value,
        storeCode: list?.find(({ id }) => isEqual(id, value))?.storeCode,
        companyCode: list?.find(({ id }) => isEqual(id, value))?.parentDetails
          ?.companyCode,
      }),
    )
  }

  return (
    <>
      <ANTDSelect
        className="store-selector"
        placement="bottomRight"
        placeholder={t('user_Store')}
        loading={loader}
        value={selected}
        options={list?.map(({ id, businessName }) => ({
          value: id,
          label: businessName,
        }))}
        onSelect={handleSelectChange}
      />
    </>
  )
}

const StoreSelect = () => {
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const permission = include([userWiseRole.storeOwner], roleId)

  if (!permission) {
    return null
  }
  return permission ? <StoreSelectUI /> : null
}

export default StoreSelect
