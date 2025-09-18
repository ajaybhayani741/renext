import { useCallback, useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import usePromise from '../../../hooks/usePromise'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { getBase64 } from '../../../utils'
import { MAX_FILE_SIZE, userWiseRole } from '../../../utils/constant'
import { getLocation } from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import debounce from '../../../utils/debounce'
import {
  entries,
  include,
  isEqual,
  keys,
  length,
  nullOrUndefined,
  values,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { addJobPostApi, updateJobPatchApi } from '../jobs.api'
import data from '../recoveryJobDataUpload.xlsx'
import inspectionFieldAttr from './inspectionFieldAttr.container'
import { payloadType, tabKeys } from '../jobs.description'

const inspection = ({
  editData,
  selectedUsers,
  setSelectedUsers,
  onFileUploadOrRemove,
  roleId,
  setNextBtnLoader,
  getPayloadForUserList,
  onSelectUser,
  onUserClear,
}) => {
  const { t } = useTranslations()
  const form = useFormFn()
  // eslint-disable-next-line no-unused-vars
  const { navigate, params } = useRouter()
  const { dispatch } = useRedux()
  // eslint-disable-next-line no-unused-vars
  const { createPromise, resolvePromise } = usePromise()
  const [jobId, setJobId] = useState(null)
  const [current, setCurrent] = useState(0)
  const [loader, setLoader] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [activeKeys, setActiveKeys] = useState([])
  const [confirmModel, setConfirmModel] = useState({
    open: false,
    description: '',
  })
  const locationRef = useRef(null)
  const inspectionInitialValues = {
    inspectionDate: dayJs(new Date()),
    managementNumber: '',
    remark: '',
    jobType: 'INSPECTION',
  }
  const isEdit = !!params?.jobId
  const showSave = isEdit || include([1], current)
  const { inspectionOfficer, hostel } = userWiseRole
  const userData = JSON.parse(getItem('userData'))

  const {
    hostelAdministrationAttrFn,
    hostelInfraRoomsAttrFn,
    hostelInfraSanitationAttrFn,
    medicalCareAttrFn,
    educationFacilitiesAttrFn,
    foodProvisionAttrFn,
    safetyAndSecurityAttrFn,
    conductionMeetingsAttrFn,
    feedbackAttrFn,
    findingsAttrFn,
  } = inspectionFieldAttr()

  useEffect(() => {
    if (isEdit) {
      setEditApiDataToForm()
    } else {
      setSelectedUsers({
        ...selectedUsers,
        [inspectionOfficer]: [userData],
      })
    }
    const getCurrentLocation = async () => {
      const data = await getLocation()
      locationRef.current = data
      form.setFieldsValue({
        ...form.getFieldsValue(),
        locationInspection: `${data?.latitude?.toFixed(4)},${data?.longitude?.toFixed(4)}`,
      })
    }
    getCurrentLocation()
  }, [])

  const setEditApiDataToForm = async () => {
    setJobId(params?.jobId)

    const dateToDayJs = date => (date ? dayJs(date, 'DD/MM/YYYY') : null)

    const formValueFromResponse = (details, formAttr) => {
      const data = {}
      entries(details)?.forEach(([key, value]) => {
        if (!formAttr?.[key]) return
        const fieldType = formAttr?.[key]?.inputType

        if (isEqual(key, 'categoryId')) {
          data[key] = details?.categoryId?.id
        } else if (isEqual(fieldType, 'dateTimePicker')) {
          data[key] = dateToDayJs(value)
        } else {
          data[key] = value
        }
      })
      return data
    }

    const inspectionDetails = {
      hostelAdministrationRequestDto: {
        ...formValueFromResponse(editData, hostelAdministrationAttrFn()),
        // uploadRc: {
        //     fileList: modifyFileListKeys(
        //       fileUploadSectionResponseDto?.registrationCertFileDetails,
        //     ),
        //   },
      },
      hostelInfraRoomsRequestDto: {
        ...formValueFromResponse(editData, hostelInfraRoomsAttrFn()),
      },
      hostelInfraSanitationRequestDto: {
        ...formValueFromResponse(editData, hostelInfraSanitationAttrFn()),
      },
      medicalCareRequestDto: {
        ...formValueFromResponse(editData, medicalCareAttrFn()),
      },
      educationFacilitiesRequestDto: {
        ...formValueFromResponse(editData, educationFacilitiesAttrFn()),
      },
      foodProvisionRequestDto: {
        ...formValueFromResponse(editData, foodProvisionAttrFn()),
      },
      safetyAndSecurityRequestDto: {
        ...formValueFromResponse(editData, safetyAndSecurityAttrFn()),
      },
      conductionMeetingsRequestDto: {
        ...formValueFromResponse(editData, conductionMeetingsAttrFn()),
      },
      feedbackRequestDto: {
        ...formValueFromResponse(editData, feedbackAttrFn()),
      },
    }

    const preFormValues = {
      inspectionList: [inspectionDetails],
      findingsRequestDto: {
        ...formValueFromResponse(editData, findingsAttrFn()),
      },
    }

    setSelectedUsers(pre => ({
      ...pre,
      [inspectionOfficer]: [editData?.userInfo],
      [hostel]: [editData?.hostelInfo],
    }))
    form.setFieldsValue(preFormValues)
  }

  const payloadConverter = (values, fieldsAttr) => {
    const data = {}
    entries(values)?.forEach(([key, value]) => {
      const fieldType = fieldsAttr?.[key]?.inputType
      if (
        !fieldsAttr?.[key] ||
        include(fieldsAttr?.[key]?.maskedForRole, roleId)
      )
        return

      if (isEqual(fieldType, 'dateTimePicker')) {
        data[key] = value ? dayJs(value)?.format('DD/MM/YYYY') : null
      } else if (isEqual('formUpload', fieldType)) {
        data[key] = value?.fileList?.map(({ dmsId }) => dmsId)
      } else {
        data[key] = value
      }
    })
    return data
  }

  const apiCall = async ({
    isComplete,
    showMsg,
    redirect,
    confirm = false,
    isLoading = false,
  } = {}) => {
    if (isApiRunning && !jobId) return
    setIsApiRunning(true)

    const formData = { ...form.getFieldValue() }
    const latLng = formData.locationInspection
      ? formData.locationInspection?.split(',')
      : []

    const payload = {
      id: jobId,
      jobType: payloadType?.[tabKeys?.inspection],
      inspectionDate: formData.inspectionDate.format('DD/MM/YYYY HH:MM'),
      hostelId: selectedUsers?.[userWiseRole?.hostel]?.[0]?.id,
      latitude: latLng?.[0] || null,
      longitude: latLng?.[1] || null,
    }

    const inspectionDetails = formData?.inspectionList?.[0]
    Object.assign(payload, {
      ...payloadConverter(
        inspectionDetails?.hostelAdministrationRequestDto,
        hostelAdministrationAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.hostelInfraRoomsRequestDto,
        hostelInfraRoomsAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.hostelInfraSanitationRequestDto,
        hostelInfraSanitationAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.medicalCareRequestDto,
        medicalCareAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.educationFacilitiesRequestDto,
        educationFacilitiesAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.foodProvisionRequestDto,
        foodProvisionAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.safetyAndSecurityRequestDto,
        safetyAndSecurityAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.conductionMeetingsRequestDto,
        conductionMeetingsAttrFn(),
      ),
      ...payloadConverter(
        inspectionDetails?.feedbackRequestDto,
        feedbackAttrFn(),
      ),
      ...payloadConverter(formData?.findingsRequestDto, findingsAttrFn()),
    })

    setNextBtnLoader(isLoading)
    if (!payload?.id || isComplete) {
      const response = await addJobPostApi({ payload })
      setNextBtnLoader(false)
      if (response?.data?.data) {
        if (!payload?.id && !isComplete) {
          notifyMethod.success({
            message: t('msg_JobCreatedSuccessfully', {
              jobId: response?.data?.data?.id,
            }),
          })
          setJobId(response?.data?.data?.id)
          form.setFieldValue('jobId', response?.data?.data?.id)
        }
        if (!isComplete) {
          Object.assign(payload, { id: response?.data?.data?.id })
          const res = await updateJobPatchApi({ payload })
          setNextBtnLoader(false)
          setLoader(false)
          setIsApiRunning(false)
          if (!res?.data?.data) return false
        }
      }
      setIsApiRunning(false)
      setLoader(false)
    } else {
      const res = await updateJobPatchApi({ payload })
      setNextBtnLoader(false)
      setLoader(false)
      setIsApiRunning(false)
      if (!res?.data?.data) return false
      if (res?.data?.data && showMsg) {
        notifyMethod.success({
          message: t('msg_JobUpdatedSuccessfully', {
            jobId: res?.data?.data?.id,
          }),
        })
      }
    }

    if (confirm) {
      // reportPolling()
    }
    // if (redirect) {
    //   dispatch(
    //     setJobActiveTab({
    //       status: jobTabKeys.active,
    //       type: jobTabKeys.recovery,
    //     }),
    //   )
    //   navigate(pathName.JOBS)
    // }
    return true
  }

  const debounceApiCall = useCallback(debounce(apiCall, 700), [
    jobId,
    isApiRunning,
    selectedUsers,
  ])

  // const handleOCRScan = async ({ file, source, elvIndex }) => {
  //   const isLt5MB =
  //     !(file?.file?.size || file?.file?.originFileObj?.size) ||
  //     Number(file?.file?.size || file?.file?.originFileObj?.size) <
  //       MAX_FILE_SIZE

  //   if (!isLt5MB) {
  //     notifyMethod.warning({
  //       message: t('msg_MaximumSizeAllowed', {
  //         maxSize: MAX_FILE_SIZE / 1024 / 1024,
  //       }),
  //     })
  //     return null
  //   }

  //   const systemId = form.getFieldValue(['inspectionList', elvIndex, 'systemId'])
  //   setLoader(true)
  //   if (!jobId || !systemId) {
  //     const isSuccess = await apiCall({})
  //     if (!isSuccess) {
  //       setLoader(false)
  //       return null
  //     }
  //   }
  //   const dmsId = await onFileUploadOrRemove({ file, source: 'OCR' })

  //   if (!dmsId) {
  //     setLoader(false)
  //     return null
  //   }

  //   const payload = {
  //     jobType: 'RECOVERY',
  //     source,
  //     jobId: form.getFieldValue('jobId'),
  //     scrapId: form.getFieldValue(['inspectionList', elvIndex, 'systemId']),
  //     dmsId,
  //   }

  //   const response = await getOcrDataApi({ payload })
  //   setLoader(false)
  //   return response?.data
  // }

  const handleFileUpload = async ({ file, fileList, filePath }) => {
    const isLt5MB =
      !(file?.file?.size || file?.file?.originFileObj?.size) ||
      Number(file?.file?.size || file?.file?.originFileObj?.size) <
        MAX_FILE_SIZE

    if (!isLt5MB) {
      notifyMethod.warning({
        message: t('msg_MaximumSizeAllowed', {
          maxSize: MAX_FILE_SIZE / 1024 / 1024,
        }),
      })
      return form.setFieldValue(filePath, {
        fileList: fileList?.slice(0, -1),
      })
    }
    const dmsId = await onFileUploadOrRemove({ file })
    if (dmsId) {
      const fileDetails = fileList[length(fileList) - 1]
      fileList[length(fileList) - 1] = {
        url: await getBase64(fileDetails?.originFileObj),
        uid: fileDetails?.uid,
        type: fileDetails?.type,
        dmsId,
      }
      form.setFieldValue(filePath, {
        fileList,
      })
    }
    jobId && debounceApiCall({})
  }

  const onValuesChange = async value => {
    const formValues = form.getFieldValue()

    if (value?.inspectionList) {
      const changeIndex = value.inspectionList?.findIndex(val => val)
      const changedKey = keys(value?.inspectionList?.[changeIndex])?.[0]
      const changedValue = value?.inspectionList?.[changeIndex]?.[changedKey]
      const nestedKey = keys(changedValue)?.[0]
      // const nestedChangedValue = changedValue?.[nestedKey]
      const updatedValues = formValues?.inspectionList || []
      const nestedUpdatedValues = updatedValues[changeIndex]

      if (isEqual('foodProvisionRequestDto', changedKey)) {
        if (
          include(
            ['riceStockRegisterKg', 'riceStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          const riceStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.riceStockRegisterKg
          const riceStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.riceStockGroundBalanceKg
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInRice:
              nullOrUndefined(riceStockAsPerRegisterVal) &&
              nullOrUndefined(riceStockGroundBalanceVal)
                ? null
                : (riceStockAsPerRegisterVal || 0) -
                  (riceStockGroundBalanceVal || 0),
          }
        } else if (
          include(['dalStockRegisterKg', 'dalStockGroundBalanceKg'], nestedKey)
        ) {
          const dalStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.dalStockRegisterKg
          const dalStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.dalStockGroundBalanceKg
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInDal:
              nullOrUndefined(dalStockAsPerRegisterVal) &&
              nullOrUndefined(dalStockGroundBalanceVal)
                ? null
                : (dalStockAsPerRegisterVal || 0) -
                  (dalStockGroundBalanceVal || 0),
          }
        } else if (
          include(
            ['cookingOilStockRegisterKg', 'cookingOilStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          const cookingOilStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.cookingOilStockRegisterKg
          const cookingOilStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.cookingOilStockGroundBalanceKg
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInCookingOil:
              nullOrUndefined(cookingOilStockAsPerRegisterVal) &&
              nullOrUndefined(cookingOilStockGroundBalanceVal)
                ? null
                : (cookingOilStockAsPerRegisterVal || 0) -
                  (cookingOilStockGroundBalanceVal || 0),
          }
        } else if (
          include(
            ['sugarStockRegisterKg', 'sugarStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          const sugarStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.sugarStockRegisterKg
          const sugarStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.sugarStockGroundBalanceKg
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInSugar:
              nullOrUndefined(sugarStockAsPerRegisterVal) &&
              nullOrUndefined(sugarStockGroundBalanceVal)
                ? null
                : (sugarStockAsPerRegisterVal || 0) -
                  (sugarStockGroundBalanceVal || 0),
          }
        } else if (
          include(
            ['idliRavaStockRegister', 'idliRavaStockGroundBalance'],
            nestedKey,
          )
        ) {
          const idliRavaStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.idliRavaStockRegister
          const idliRavaStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.idliRavaStockGroundBalance
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInIdliRava:
              nullOrUndefined(idliRavaStockAsPerRegisterVal) &&
              nullOrUndefined(idliRavaStockGroundBalanceVal)
                ? null
                : (idliRavaStockAsPerRegisterVal || 0) -
                  (idliRavaStockGroundBalanceVal || 0),
          }
        } else if (
          include(
            ['ragiMaltStockRegisterKg', 'ragiMaltStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          const ragiMaltStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.ragiMaltStockRegisterKg
          const ragiMaltStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.ragiMaltStockGroundBalanceKg
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInRagiMalt:
              nullOrUndefined(ragiMaltStockAsPerRegisterVal) &&
              nullOrUndefined(ragiMaltStockGroundBalanceVal)
                ? null
                : (ragiMaltStockAsPerRegisterVal || 0) -
                  (ragiMaltStockGroundBalanceVal || 0),
          }
        } else if (
          include(
            ['foodStorageVegetablesPhoto', 'foodStorageDryItemsPhoto'],
            nestedKey,
          )
        ) {
          const file = changedValue?.[nestedKey]
          const fileList =
            nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

          handleFileUpload({
            file,
            fileList,
            filePath: ['inspectionList', changeIndex, changedKey, nestedKey],
          })
        }
      } else if (isEqual('hostelInfraSanitationRequestDto', changedKey)) {
        if (
          include(
            ['numberOfToiletsAvailable', 'numberOfToiletsFunctioning'],
            nestedKey,
          )
        ) {
          const numberOfToiletsAvailable =
            nestedUpdatedValues?.[changedKey]?.numberOfToiletsAvailable
          const numberOfToiletsFunctioning =
            nestedUpdatedValues?.[changedKey]?.numberOfToiletsFunctioning
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            percentageOfToiletFunctioning:
              nullOrUndefined(numberOfToiletsAvailable) ||
              nullOrUndefined(numberOfToiletsFunctioning)
                ? null
                : (
                    ((numberOfToiletsFunctioning || 0) /
                      (numberOfToiletsAvailable || 0)) *
                    100
                  ).toFixed(2),
          }
        } else if (
          include(
            ['toiletsBathroomsPhoto1', 'toiletsBathroomsPhoto2'],
            nestedKey,
          )
        ) {
          const file = changedValue?.[nestedKey]
          const fileList =
            nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

          handleFileUpload({
            file,
            fileList: fileList && length(fileList) ? fileList : null,
            filePath: ['inspectionList', changeIndex, changedKey, nestedKey],
          })
        }
      }

      form.setFieldsValue({
        inspectionList: updatedValues,
      })
    }
    if (value?.findingsRequestDto) {
      const nestedUpdatedValues = formValues

      const changedKey = keys(value)?.[0]
      const changedValue = value?.[changedKey]
      const nestedKey = keys(changedValue)?.[0]
      if (
        include(
          [
            'inspectingOfficerWithStaffPhoto',
            'inspectingOfficerWithChildrenPhoto',
            'hostelPhoto1',
            'hostelPhoto2',
            'hostelPhoto3',
          ],
          nestedKey,
        )
      ) {
        const file = changedValue?.[nestedKey]
        const fileList =
          nestedUpdatedValues?.[changedKey]?.[nestedKey]?.fileList

        handleFileUpload({
          file,
          fileList,
          filePath: [changedKey, nestedKey],
        })
      }
      form.setFieldsValue({
        findingsRequestDto: nestedUpdatedValues?.findingsRequestDto,
      })
    }
  }

  // eslint-disable-next-line no-unused-vars
  const checkUserSelection = () => {
    const inspectionList = form.getFieldValue('inspectionList')

    const messages = {
      producer: [],
      consumer: [],
      collectionCenter: [],
      dealer: [],
    }
    inspectionList?.forEach((value, index) => {
      // const checkUser = (role, idx) => selectedUsers?.[role]?.[idx]?.id

      // // producer is required for all vehicle types
      // if (!checkUser(producer, index)) {
      //   messages.producer.push(index + 1)
      // }

      return false
    })

    const hasInvalidUserSelection = values(messages)?.flat(1)?.length
    if (hasInvalidUserSelection) {
      const msgByUser = {
        producer: 'msg_PleaseSelectProducerAtELV',
        consumer: 'msg_PleaseSelectConsumerAtELV',
        collectionCenter: 'msg_PleaseSelectCollectionCenterAtELV',
        dealer: 'msg_PleaseSelectDealerAtELV',
      }
      const msgArr = []
      entries(messages)?.forEach(([key, value]) => {
        if (value?.length) {
          msgArr.push(t(msgByUser[key], { number: value?.join(', ') }))
        }
      })
      dispatch(
        setPopupMessageModel({
          open: true,
          msgList: msgArr,
        }),
      )
    }
    return !hasInvalidUserSelection
  }

  const validatorFn = async ({ validateAll, onSave, validateOnly }) => {
    const inspectionList = form.getFieldValue(['inspectionList'])
    try {
      if (validateAll && !onSave) {
        await form.validateFields(['inspectionList'], {
          recursive: true,
          validateOnly,
        })
      }
    } catch (error) {
      const inspectionValid = inspectionList?.every((_, index) => {
        const errorFieldName = error?.errorFields?.[index]?.name
        if (length(errorFieldName)) {
          if (!validateOnly) {
            // eslint-disable-next-line no-unused-vars
            let [_, hostelNumber, dtoKey] = errorFieldName
            if (!include(activeKeys?.[hostelNumber], dtoKey)) {
              setActiveKeys(prev => {
                const clonePrev = [...(prev || [])]
                clonePrev[hostelNumber] = [
                  ...(prev?.[hostelNumber] || []),
                  dtoKey,
                ]
                return clonePrev
              })
            }
            setTimeout(() => {
              form.scrollToField(errorFieldName)
            }, 300)
          }
          return false
        }
        return true
      })
      if (!inspectionValid) return false
    }
    return true
  }

  const validationFn = async ({ onSave, validateAll }) => {
    switch (current) {
      case 1:
        const hostelId = selectedUsers?.[userWiseRole?.hostel]?.[0]?.id
        if (!hostelId) {
          dispatch(
            setPopupMessageModel({
              open: true,
              message: ['msg_PleaseSelectHostel'],
            }),
          )
          return false
        }
        try {
          return await validatorFn({ onSave, validateAll })
        } catch (error) {
          return false
        }
      case 2:
        try {
          return await form.validateFields()
        } catch (error) {
          return false
        }
      default:
        return true
    }
  }

  const handleNext = async () => {
    let isValid = await validationFn({ validateAll: true })
    // let isValid = true
    if (!isValid) return
    if (include([1, 2], current)) {
      isValid = apiCall({
        showMsg: true,
      })
    } else if (isEqual(current, 3)) {
      isValid = apiCall({
        showMsg: true,
        isComplete: true,
      })
    }
    if (!isValid) return

    return setCurrent(current + 1)
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = async ({ redirect = true } = {}) => {
    const isValid = await validationFn({ onSave: true })
    if (!isValid) return
    setLoader(true)
    apiCall({
      showMsg: true,
      redirect,
    })
  }

  const onDownloadTemplate = async () => {
    try {
      let link = document.createElement('a')
      link.href = data
      link.download = `Recovery_Job_Data_Upload_template`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {}
  }

  const onActiveKeysChange = (keys, index) => {
    setActiveKeys(prev => {
      const clonePrev = [...(prev || [])]
      clonePrev[index] = keys
      return clonePrev
    })
  }

  const onConfirmModelClose = () => {
    resolvePromise(false)
    setConfirmModel({ open: false, description: '' })
  }

  const onAcceptConfirmation = () => {
    setConfirmModel({ open: false, description: '' })
    resolvePromise(true)
  }

  const inspectionFormFieldsAttr = {
    hostelAdministrationAttrFn,
    hostelInfraRoomsAttrFn,
    hostelInfraSanitationAttrFn,
    medicalCareAttrFn,
    educationFacilitiesAttrFn,
    foodProvisionAttrFn,
    safetyAndSecurityAttrFn,
    conductionMeetingsAttrFn,
    feedbackAttrFn,
  }

  return {
    form,
    loader,
    current,
    showSave,
    inspectionInitialValues,
    inspectionFormFieldsAttr,
    activeKeys,
    confirmModel,
    handleNext,
    handleSave,
    handlePrevious,
    onValuesChange,
    onDownloadTemplate,
    onActiveKeysChange,
    onConfirmModelClose,
    onAcceptConfirmation,
    findingsAttrFn,
  }
}

export default inspection
