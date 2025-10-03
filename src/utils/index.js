import { Tag } from 'antd'

import { childUsers } from './constant'
import { dayJs } from './dayjs'
import {
  resetFiscalYearToDefault,
  getDefaultFiscalYear,
  isDateRangeDefault,
} from './fiscalYearUtils'
import { entries, isEqual, ternary } from './javascript'
import { sidebarMenus } from '../components/layout/sidebar.description'

const addressFormat = data => {
  if (data?.pincode || data?.address) {
    return `${data?.address ? data?.address + ',' : ''} ${
      data?.pincode ? data?.pincode : ''
    }`
  } else {
    return '-'
  }
}

const nameParam = ({ roleId, searchByEmail }) =>
  ternary(
    searchByEmail,
    'emailId',
    ternary(childUsers.includes(roleId), 'name', 'businessName'),
  )

const getAddEditRoles = pathName =>
  sidebarMenus.find(({ key }) => isEqual(key, pathName))?.addEdit || []

const apiParams = ({ params, pageNo }) => {
  let tempParams = ''
  if (pageNo) {
    tempParams += `${pageNo}`
  }
  entries(params)?.forEach(([key, value], i) => {
    tempParams += `${ternary(isEqual(i, 0), '?', '&')}${key}=${value}`
  })
  return tempParams
}

const dateDaysDifference = (date1, date2) => {
  const startDate = dayJs(date1).startOf('day')
  const endDate = dayJs(date2).startOf('day')
  return endDate.diff(startDate, 'day')
}

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const inventoryTags = ({ t, inventoryType, text }) => {
  const tagFn = ({ type }) => {
    switch (type) {
      case 'PROCESSED_ACTUAL':
        return (
          <Tag
            color="#354e8b"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_ProcessedActual')}
          </Tag>
        )
      case 'LEFT_OVER':
        return (
          <Tag
            color="#ff4d4f"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_LeftOver')}
          </Tag>
        )
      case 'BUCKET_NAME':
        return (
          <Tag
            color="#6686d3"
            className="tag-style text-center mb-8 white-color"
          >
            {t(text)}
          </Tag>
        )
      case 'SCRAP_RECOVERED':
        return (
          <Tag
            color="#add8e6"
            className="tag-style text-center mb-8 black-color"
          >
            {t('tag_ScrapRecovered')}
          </Tag>
        )
      case 'ELV_RECOVERED':
        return (
          <Tag
            color="#add8e6"
            className="tag-style text-center mb-8 black-color"
          >
            {t('inv_ELVRecovered')}
          </Tag>
        )
      case 'OEM_RECOVERED':
        return (
          <Tag
            color="#add8e6"
            className="tag-style text-center mb-8 black-color"
          >
            {t('inv_OEMRecovered')}
          </Tag>
        )
      case 'PROCESSED':
        return (
          <Tag
            color="#87ad4a"
            className="tag-style text-center mb-8 black-color"
          >
            {t('inv_Processed')}
          </Tag>
        )
      case 'MATERIAL_RECOVERED':
        return (
          <Tag
            color="#add8e6"
            className="tag-style text-center mb-8 black-color"
          >
            {t('inv_MaterialRecovered')}
          </Tag>
        )
      case 'PART_RECOVERED':
        return (
          <Tag
            color="#add8e6"
            className="tag-style text-center mb-8 black-color"
          >
            {t('tag_PartRecovered')}
          </Tag>
        )
      case 'RECYCLE_REQUESTED':
        return (
          <Tag
            color="#2eb62e"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_RecycleRequest')}
          </Tag>
        )
      case 'PRE_RECYCLE':
        return (
          <Tag
            color="#90ee90"
            className="tag-style text-center mb-8  black-color"
          >
            {t('tag_PreRecycle')}
          </Tag>
        )
      case 'POST_RECYCLE':
        return (
          <Tag
            color="#008000"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_PostRecycle')}
          </Tag>
        )
      case 'REFURBISHMENT_REQUESTED':
        return (
          <Tag
            color="#ff5a00"
            className="tag-style text-center mb-8  black-color"
          >
            {t('tag_RefurbishmentRequest')}
          </Tag>
        )
      case 'PRE_REFURBISHMENT':
      case 'POST_REFURBISHMENT_VIRGIN':
        return (
          <Tag
            color="#ff9a00"
            className="tag-style text-center mb-8  black-color"
          >
            {t('tag_PreRefurbishment')}
          </Tag>
        )
      case 'POST_REFURBISHMENT':
        return (
          <Tag
            color="#ff5a00"
            className="tag-style text-center mb-8  black-color"
          >
            {t('tag_PostRefurbishment')}
          </Tag>
        )
      case 'FINAL_PRODUCT':
        return (
          <Tag
            color="#547a1d"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_FinalProduct')}
          </Tag>
        )
      case 'FORGED_PARTS':
        return (
          <Tag
            color="#547a1d"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_ForgedParts')}
          </Tag>
        )
      case 'BARS':
        return (
          <Tag
            color="#a1a7ad"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_Bars')}
          </Tag>
        )
      case 'PRE_PART_PRODUCTION':
        return (
          <Tag
            color="#a1a7ad"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_PrePartProduction')}
          </Tag>
        )
      case 'READY_TO_SALES':
      case 'FORGED_PARTS_READY':
      case 'POST_REFURBISHMENT_READY':
        return (
          <Tag
            color="#c85c51"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_ReadyToSale')}
          </Tag>
        )
      case 'SOLD':
      case 'SOLD_REFURBISHMENT':
      case 'FORGED_PARTS_SOLD':
        return (
          <Tag
            color="#4e90cc"
            className="tag-style text-center mb-8 white-color"
          >
            {t('tag_Sold')}
          </Tag>
        )
      case '3RD_PARTY_RECYCLE':
        return (
          <Tag
            color="#46647e"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_3rdPartyRecycle')}
          </Tag>
        )
      case 'REUSE':
        return (
          <Tag
            color="#547a1d"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_Reuse')}
          </Tag>
        )
      case 'DESTROY':
        return (
          <Tag
            color="#c64d42"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_Destroy')}
          </Tag>
        )
      case 'REUSE_REQUEST':
        return (
          <Tag
            color="#547a1d"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_ReuseRequest')}
          </Tag>
        )
      case 'DESTRUCTION_REQUEST':
        return (
          <Tag
            color="#c64d42"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_DestructionRequest')}
          </Tag>
        )
      case 'REFURBISH':
        return (
          <Tag
            color="#fd7447"
            className="tag-style text-center mb-8  black-color"
          >
            {t('inv_Refurbish')}
          </Tag>
        )
      case 'SELF_RECYCLE':
        return (
          <Tag
            color="#6ecb6e"
            className="tag-style text-center mb-8  black-color"
          >
            {t('inv_SelfRecycle')}
          </Tag>
        )
      case 'DISCARDED':
        return (
          <Tag
            color="#c64d42"
            className="tag-style text-center mb-8 white-color"
          >
            {t('inv_Discarded')}
          </Tag>
        )
      case 'TO_BE_SHREDDED':
        return (
          <Tag
            color="#ff9a00"
            className="tag-style text-center mb-8 white-color"
          >
            {t('job_ToBeShredded')}
          </Tag>
        )
      case 'POST_SHREDDING':
        return (
          <Tag
            color="#ff5a00"
            className="tag-style text-center mb-8 white-color"
          >
            {t('job_PostShredding')}
          </Tag>
        )
      default:
        return null
    }
  }
  return tagFn({ type: inventoryType })
}

export {
  addressFormat,
  nameParam,
  getAddEditRoles,
  apiParams,
  dateDaysDifference,
  getBase64,
  inventoryTags,
  resetFiscalYearToDefault,
  getDefaultFiscalYear,
  isDateRangeDefault,
}
