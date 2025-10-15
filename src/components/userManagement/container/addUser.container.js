import { useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import { profileDetails } from '../../../redux/user_management/reducer'
import { USER_TXT } from '../../../routing/pathName.constant'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { getBase64 } from '../../../utils'
import configData from '../../../utils/config'
import { childUsers, userWiseRole } from '../../../utils/constant'
import { formatDate } from '../../../utils/dayjs'
import debounce from '../../../utils/debounce'
import {
  entries,
  include,
  isEqual,
  keys,
  length,
  notEqual,
  ternary,
  values,
} from '../../../utils/javascript'
import { getItem, setItem } from '../../../utils/localstorage'
import { userChildrenList } from '../../layout/sidebar.description'
import {
  cityOptions,
  countryData,
  pincodeOptions,
  stateOptions,
} from '../addressData'
import {
  getUserList,
  addNewUserApi,
  getUserProfileApi,
  updateUserApi,
  userValidationApi,
} from '../user.api'
import {
  childUserFormFields,
  countriesList,
  roleIdByPath,
  userFormByRoleId,
  userFormFields,
} from '../user.description'

const addUser = ({
  t,
  editInfo,
  handleCancelEdit,
  userRoleId,
  successCallback,
}) => {
  const form = useFormFn()
  const { params, navigate, location } = useRouter()
  const { dispatch } = useRedux()
  const { country } = configData
  const { admin, hostel, stateAdminOfficer } = userWiseRole
  const userType = params?.userType
  const formRoleId =
    roleIdByPath[userType] ?? userRoleId ?? editInfo?.data?.roleId
  const [selectUser, setSelectUser] = useState({
    flag: false,
    data: {},
    list: {},
  })
  const [loader, setLoader] = useState(false)
  const [popup, setPopup] = useState({ open: false, message: '' })
  const userDetails = JSON.parse(getItem('userData'))
  const { roleId, id: loginUserId } = { ...userDetails }
  const formField =
    userFormByRoleId[formRoleId] ||
    (include(childUsers, formRoleId) ? childUserFormFields : userFormFields)

  const [userForm, setUserForm] = useState(
    JSON.parse(JSON.stringify(formField)),
  )
  const initialEditData = useRef({})
  const [currentAddress, setCurrentAddress] = useState('')
  const checkErrors = useRef({})

  useEffect(() => {
    if (currentUserDescription?.parent) {
      async function fetchData() {
        setLoader(true)
        const responseData = await getUsers({ page: 1 })
        setLoader(false)
        setSelectUser({
          ...selectUser,
          data: responseData?.list?.[0] || {},
          list: responseData,
        })
        if (include([stateAdminOfficer], formRoleId) && !editInfo?.data?.id) {
          handleSameAsParent(responseData?.list?.[0])
        }
      }
      if (isEqual(currentUserDescription?.parent?.id, roleId)) {
        setSelectUser(prev => ({ ...prev, data: userDetails }))
        if (include([stateAdminOfficer], formRoleId) && !editInfo?.data?.id) {
          handleSameAsParent(userDetails)
        }
      } else {
        fetchData()
      }
    }
    if (formRoleId === hostel) {
      const updatedForm = { ...userForm }
      delete updatedForm.username
      delete updatedForm.password
      setUserForm(updatedForm)
    }
  }, [])

  useEffect(() => {
    if (editInfo?.data?.id) {
      const getEmailList = data => {
        const emailList = []
        entries(data)?.forEach(([key, value]) => {
          if (include(key, 'emailId') && value) {
            emailList.push(value)
          }
        })
        return ternary(length(emailList), emailList, [''])
      }
      const modifyFileKeys = file =>
        ternary(
          file?.fileUrl,
          {
            fileList: [
              { name: file?.fileName, url: file?.fileUrl, uid: file?.dmsId },
            ],
          },
          null,
        )
      const setFormData = (formFields, data = {}) => {
        const formValues = {}
        const mapToData = fields => {
          entries(fields)?.forEach(([key, value]) => {
            if (value?.child) return mapToData(value?.child)
            const fieldValue = data[key]
            if (isEqual('dateTimePicker', value?.inputType)) {
              formValues[key] = formatDate(fieldValue, 'DD/MM/YYYY')
            } else if (isEqual('timePicker', value?.inputType)) {
              formValues[key] = formatDate(fieldValue, value?.format)
            } else if (isEqual('formUpload', value?.inputType)) {
              formValues[key] = modifyFileKeys(fieldValue)
            } else if (isEqual('emailId', key)) {
              formValues[key] = getEmailList(data)
            } else {
              formValues[key] = fieldValue
            }
          })
        }
        mapToData(formFields)
        return formValues
      }

      const formData = setFormData(userForm, editInfo?.data)
      form.setFieldsValue({
        ...formData,
        country: Object.keys(countriesList).find(key =>
          isEqual(countriesList[key], formData?.country),
        ),
      })
      initialEditData.current = {
        ...formData,
      }
      setUserForm(prevForm => {
        const { username, password, ...editForm } = prevForm || {}
        return editForm
      })
    }
  }, [editInfo])

  useEffect(() => {
    if (include(childUsers, formRoleId) && selectUser?.data?.id) {
      //Add same as parent button
      if (include([stateAdminOfficer], formRoleId)) {
        handleSameAsParent(selectUser?.data)
      }
      setUserForm(prev => {
        const updatedFormField = { ...prev }
        updatedFormField.sameAsParentBtn = {
          ...updatedFormField.sameAsParentBtn,
          hidden: false,
          children: t('btn_SameAsParent'),
          onClick: () => handleSameAsParent(selectUser?.data),
        }
        return updatedFormField
      })
    }
  }, [selectUser?.data])

  const currentUserDescription = userChildrenList.find(item =>
    isEqual(item?.userId, formRoleId),
  )
  const selectPermission = {
    // [inspectionOfficer]: [stateHostelDepartment],
    // [hostel]: [stateHostelDepartment],
  }
  const isSelect =
    isEqual(roleId, admin) || selectPermission[formRoleId]?.includes(roleId)

  const businessNameCheck = debounce(async ({ type, value }) => {
    const params = `?type=${type}&country=${country}&value=${value}`
    const response = await userValidationApi({ params })
    if (!response?.data?.success) {
      setPopup({ open: true, message: response?.error?.errorMsg })
      if (notEqual(type, 'BUSINESSNAME'))
        checkErrors.current = {
          ...checkErrors.current,
          [type]: response?.error?.errorMsg,
        }
    } else {
      if (notEqual(type, 'BUSINESSNAME')) {
        checkErrors.current = {
          ...checkErrors.current,
          [type]: '',
        }
      }
    }
  }, 400)

  const handleValuesChange = (val, data) => {
    const updatedForm = { ...userForm }

    let parentKey
    let currentKey
    let e
    entries(val).forEach(([k, v]) => {
      if (v && isEqual(typeof v, 'object')) {
        parentKey = k
        currentKey = keys(v)?.at(0)
        e = v
      } else {
        currentKey = k
        e = val
      }
    })
    const updatedFormData = { ...data }
    const formData = ternary(
      parentKey,
      updatedFormData?.[parentKey],
      updatedFormData,
    )

    const tempAddressAttr = ternary(
      parentKey,
      updatedForm?.[parentKey]?.child,
      updatedForm,
    )
    if (isEqual(currentKey, 'pincode') && !e?.pincode) {
      formData.city = null
      formData.state = null
      formData.country = null
      tempAddressAttr.state.options = stateOptions
      tempAddressAttr.city.options = cityOptions
      tempAddressAttr.pincode.options = pincodeOptions
    }
    if (e?.pincode) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) =>
          entries(cityObj).some(([cityKey, pinArr]) => {
            if (!include(pinArr, e.pincode)) return false
            if (!formData.country) {
              formData.country = countryKey
            }
            if (!formData.state) {
              formData.state = stateKey
              tempAddressAttr.state.options = keys(stateObj)?.map(v => ({
                label: v,
                value: v,
              }))
            }
            if (!formData.city) {
              formData.city = cityKey
              tempAddressAttr.city.options = keys(cityObj)?.map(v => ({
                label: v,
                value: v,
              }))
            }

            tempAddressAttr.pincode.options = pinArr?.map(v => ({
              label: v,
              value: v,
            }))
            return true
          }),
        ),
      )
    }
    if (e?.state) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) => {
          if (notEqual(stateKey, e?.state)) return false
          if (!formData.country) {
            formData.country = countryKey
          }
          formData.state = stateKey
          const stateOpt = keys(stateObj)?.map(v => ({
            label: v,
            value: v,
          }))
          const cityOpt = keys(cityObj)?.map(v => ({
            label: v,
            value: v,
          }))
          formData.city = cityOpt?.at(0)?.value
          const pincodeOpt = cityObj?.[formData.city]?.map(pin => ({
            label: pin,
            value: pin,
          }))
          formData.pincode = pincodeOpt?.at(0)?.value

          tempAddressAttr.state.options = stateOpt
          tempAddressAttr.city.options = cityOpt
          tempAddressAttr.pincode.options = pincodeOpt
          return true
        }),
      )
    }
    if (e?.city) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) =>
          entries(cityObj).some(([cityKey, pinArr]) => {
            if (notEqual(cityKey, e?.city)) return false
            if (!formData.country) {
              formData.country = countryKey
            }
            if (!formData.state) {
              formData.state = stateKey
              tempAddressAttr.state.options = keys(stateObj)?.map(v => ({
                label: v,
                value: v,
              }))
            }
            formData.city = cityKey
            tempAddressAttr.city.options = keys(cityObj)?.map(v => ({
              label: v,
              value: v,
            }))
            const pincodeOpt = pinArr?.map(pin => ({
              label: pin,
              value: pin,
            }))
            formData.pincode = pincodeOpt.at(0)?.value
            tempAddressAttr.pincode.options = pincodeOpt
            return true
          }),
        ),
      )
    }
    if (e?.country) {
      entries(countryData).some(([countryKey, stateObj]) => {
        if (notEqual(countryKey, e?.country)) return false
        formData.country = countryKey
        const stateOpt = keys(stateObj)?.map(v => ({
          label: v,
          value: v,
        }))
        formData.state = stateOpt?.at(0)?.value
        const cityOpt = keys(stateObj?.[formData?.state])?.map(v => ({
          label: v,
          value: v,
        }))
        formData.city = cityOpt?.at(0)?.value
        const pincodeOpt = stateObj?.[formData?.state]?.[formData?.city]?.map(
          pin => ({
            label: pin,
            value: pin,
          }),
        )
        formData.pincode = pincodeOpt?.at(0)?.value
        tempAddressAttr.state.options = stateOpt
        tempAddressAttr.city.options = cityOpt
        tempAddressAttr.pincode.options = pincodeOpt
        return true
      })
    }

    if (e?.businessName) {
      businessNameCheck({ type: 'BUSINESSNAME', value: e?.businessName })
    } else if (e?.employeeId) {
      businessNameCheck({ type: 'EMPLOYEE_ID', value: e?.employeeId })
      updatedFormData.username = e?.employeeId
    } else if (e?.storeCode) {
      businessNameCheck({ type: 'STORE_CODE', value: e?.storeCode })
    } else if (e?.companyCode) {
      businessNameCheck({ type: 'COMPANY_CODE', value: e?.companyCode })
    }

    if (
      include(['pincode', 'state', 'city', 'country', 'employeeId'], currentKey)
    ) {
      setUserForm(updatedForm)
      form.setFieldsValue(updatedFormData)
    }
  }

  const updateProfile = async () => {
    const pathName = location.pathname.split('/')
    if (isEqual(editInfo?.data?.id, loginUserId)) {
      const profileResponse = await getUserProfileApi({
        id: editInfo?.data?.id,
      })
      if (profileResponse?.data?.data) {
        dispatch(profileDetails(profileResponse?.data?.data))
        setItem('userData', JSON.stringify(profileResponse?.data?.data))
      }
    }
    if (isEqual(`/${pathName?.[1]}`, USER_TXT)) {
      navigate(`${USER_TXT}/${userType}`, {
        state: { renderUserAPI: true },
      })
    }
    setLoader(false)

    notifyMethod.success({ message: 'msg_UserUpdatedSuccessfully' })
    form.resetFields()
    editInfo?.flag && handleCancelEdit()
  }

  const createEmailPayload = (emailArr = []) => {
    return emailArr.reduce(
      (obj, email, index) => ({
        ...obj,
        [`emailId${index ? index : ''}`]: email,
      }),
      { emailId: '' },
    )
  }

  const filePayload = async (file, key) => {
    if (!file?.originFileObj)
      return {
        [`${key}Url`]: null,
        [`${key}Name`]: null,
      }
    return {
      [`${key}Url`]: await getBase64(file?.originFileObj),
      [`${key}Name`]: file?.originFileObj?.name,
    }
  }

  const onFinish = async () => {
    const checkErrorArr = values(checkErrors?.current)
    if (checkErrorArr?.some(err => err)) {
      return setPopup({ open: true, message: checkErrorArr?.find(err => err) })
    }
    let data = form.getFieldValue()
    const emailObj = createEmailPayload(data?.emailId)
    data = { ...data, ...emailObj, country: countriesList?.[data?.country] }
    if (editInfo?.data?.id) {
      setLoader(true)
      const payload = {
        userId: editInfo?.data?.id,
        country: editInfo?.data?.country,
      }
      keys(data).forEach(k => {
        if (include(k, ['profile'])) return
        if (include(k, 'emailId')) {
          if (notEqual(k, 'emailId')) return
          Array.from({ length: 11 }, (v, i) => `emailId${i || ''}`).forEach(
            elem => {
              if (!editInfo?.data?.[elem]) {
                payload[elem] = data?.[elem]
              } else {
                if (notEqual(editInfo?.data?.[elem], data?.[elem])) {
                  payload[elem] = data?.[elem] ?? ''
                }
              }
            },
          )
        } else if (isEqual('sameAsParentBtn', k)) {
        } else if (notEqual(data?.[k], editInfo?.data?.[k])) {
          payload[k] = data?.[k] ?? '-1' // -1 for removing or empty field value while editing
        }
      })

      if (
        data?.profile?.fileList?.[0] &&
        notEqual(
          editInfo?.data?.profile?.fileUrl,
          data?.profile?.fileList?.[0]?.url,
        )
      ) {
        Object.assign(
          payload,
          await filePayload(data?.profile?.fileList?.[0], 'profile'),
        )
      } else if (
        !data?.profile?.fileList?.[0] &&
        editInfo?.data?.profile?.fileUrl
      ) {
        //when removing a profile
        Object.assign(payload, { profileName: null, profileUrl: -1 })
      }

      //remove unnecessary payload
      delete payload.profile

      if (length(keys(payload)) > 2) {
        const response = await updateUserApi({
          payload,
        })
        if (response?.data?.data?.success) {
          await updateProfile()
        }
      } else {
        handleCancelEdit && handleCancelEdit()
      }
      setLoader(false)
    } else {
      if (isSelect || selectUser?.data?.id) {
        setLoader(true)
        const payload = {
          ...data,
          country: countriesList[data?.country],
          forRoleId: formRoleId,
          forUserId: currentUserDescription?.parent
            ? selectUser?.data?.id
            : loginUserId,
          ...(length(data?.profile?.fileList)
            ? await filePayload(data?.profile?.fileList?.[0], 'profile')
            : {}),
        }

        //remove unnecessary properties
        delete payload.profile

        const response = await addNewUserApi({ payload })
        setLoader(false)
        if (response?.data?.data?.success) {
          userType && navigate(`${USER_TXT}/${userType}`)
          successCallback && successCallback(response?.data?.data?.userInfo)
          // set success or failure message
          notifyMethod.success({ message: 'msg_UserAddedSuccessfully' })
        }
      } else {
        notifyMethod.warning({ message: 'msg_SelectUser' })
      }
    }
  }

  const handleSelectClick = async () => {
    setSelectUser({
      ...selectUser,
      list: notEqual(selectUser?.list?.pageNo, 1)
        ? await getUsers({ page: 1 })
        : selectUser?.list,
      flag: true,
    })
  }

  const handleSelectCancel = () => {
    setSelectUser({ ...selectUser, flag: false })
  }

  const getUsers = async ({ page }) => {
    let params = `${page}?roleId=${currentUserDescription?.parent?.id}`

    const response = await getUserList({
      params,
    })

    return response?.data
  }

  const handleTableChange = async pagination => {
    const { current } = pagination
    setSelectUser({ ...selectUser, list: await getUsers({ page: current }) })
  }

  const onSelectUser = data => {
    if (length(data)) {
      setSelectUser({ ...selectUser, data: data?.[0], flag: false })
    } else {
      notifyMethod.warning({ message: 'msg_SelectUser' })
    }
  }

  const handleClosePopup = () => {
    setPopup({ open: false, message: '' })
  }

  const handleSameAsParent = (parentData = {}) => {
    // const getEmailList = data => {
    //   const emailList = []
    //   entries(data)?.forEach(([key, value]) => {
    //     if (include(key, 'emailId') && value) {
    //       emailList.push(value)
    //     }
    //   })
    //   return ternary(length(emailList), emailList, [''])
    // }

    const dataList = [
      'pincode',
      'state',
      'city',
      'country',
      'address',
      // 'emailId',
    ]
    const data = {
      name: parentData?.businessName,
      contact: parentData?.phoneNumber,
    }

    dataList.forEach(value => {
      /*       if (isEqual(value, 'emailId')) {
        data[value] = getEmailList(parentData)
      } else  */ data[value] = parentData?.[value]
    })

    setUserForm(prev => {
      const tempForm = { ...prev }
      tempForm.pincode = {
        ...tempForm.pincode,
        options: pincodeOptions,
      }
      tempForm.city = {
        ...tempForm.city,
        options: cityOptions,
      }
      tempForm.state = {
        ...tempForm.state,
        options: stateOptions,
      }
      return tempForm
    })

    form.setFieldsValue(data)
  }

  const getAddressData = ({ currentAddress, googleAddress }) => {
    if (currentAddress || googleAddress) {
      setCurrentAddress(currentAddress)
      if (currentAddress) {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          address: currentAddress,
        })
      }
      if (googleAddress) {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          pincode: googleAddress?.pincode,
          city: googleAddress?.city,
          state: googleAddress?.state,
          country: googleAddress?.country,
        })
      }
    }
  }

  return {
    form,
    userForm,
    handleValuesChange,
    onFinish,
    currentUserDescription,
    handleSelectClick,
    selectUser,
    handleSelectCancel,
    handleTableChange,
    onSelectUser,
    isSelect,
    loader,
    popup,
    formRoleId,
    handleClosePopup,
    handleSameAsParent,
    getAddressData,
    currentAddress,
  }
}

export default addUser
