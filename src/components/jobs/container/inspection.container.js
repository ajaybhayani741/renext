import { useCallback, useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../App'
import usePromise from '../../../hooks/usePromise'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { setJobActiveTab } from '../../../redux/jobs/reducer'
import pathName from '../../../routing/pathName.constant'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { getBase64 } from '../../../utils'
import { MAX_FILE_SIZE, userWiseRole } from '../../../utils/constant'
import { getLocation, modifyFileListKeys } from '../../../utils/customFunctions'
import { dayJs } from '../../../utils/dayjs'
import debounce from '../../../utils/debounce'
import {
  entries,
  include,
  isEqual,
  keys,
  length,
  notEqual,
  nullOrUndefined,
  values,
} from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import { addJobPostApi, updateJobPatchApi } from '../jobs.api'
import { payloadType, tabKeys } from '../jobs.description'
import data from '../recoveryJobDataUpload.xlsx'
import inspectionFieldAttr from './inspectionFieldAttr.container'

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
  const { navigate, params } = useRouter()
  const { dispatch, selector } = useRedux()
  // eslint-disable-next-line no-unused-vars
  const { createPromise, resolvePromise } = usePromise()
  const [jobId, setJobId] = useState(null)
  const isEdit = !!params?.jobId
  const [current, setCurrent] = useState(isEdit ? 1 : 0)
  const [loader, setLoader] = useState(false)
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [activeKeys, setActiveKeys] = useState([])
  const [confirmModel, setConfirmModel] = useState({
    open: false,
    description: '',
  })
  const [activeFormField, setActiveFormField] = useState({ isOpen: false })
  const [formFieldPercentage, setFormFieldPercentage] = useState({})
  const [completeConfirmation, setCompleteConfirmation] = useState({
    open: false,
  })
  const locationRef = useRef(null)
  const inspectionInitialValues = {
    inspectionDate: dayJs(new Date()),
    managementNumber: '',
    remark: '',
    jobType: payloadType?.[tabKeys?.inspection],
  }
  const showSave = isEdit || include([1], current)
  const { inspectionOfficer, hostel } = userWiseRole
  const userData = JSON.parse(getItem('userData'))
  const isMobile = selector(state => state.app.isMobile)

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
      setCurrent((editData?.stepNumber || 1) - 1)
      setEditApiDataToForm()
    } else {
      setSelectedUsers({
        ...selectedUsers,
        [inspectionOfficer]: [userData],
      })
    }
    setFieldsPercentageFn(editData)
  }, [])

  const getCurrentLocation = async () => {
    setConfirmModel({
      open: true,
      description:
        current === 3 ? t('msg_confirmEndLocation') : t('msg_confirmLocation'),
    })
    const isAccepted = await createPromise()
    if (isAccepted) {
      const data = await getLocation()
      locationRef.current = data
      form.setFieldsValue({
        ...form.getFieldsValue(),
        locationInspection: `${data?.latitude?.toFixed(4)},${data?.longitude?.toFixed(4)}`,
        ...(current === 3
          ? {
              endLocationInspection: `${data?.latitude?.toFixed(4)},${data?.longitude?.toFixed(4)}`,
            }
          : {}),
      })

      jobId && debounceApiCall({})
    }
  }

  const setEditApiDataToForm = async () => {
    setJobId(editData?.id)

    const dateToDayJs = date => (date ? dayJs(date, 'DD/MM/YYYY') : null)

    const formValueFromResponse = (details, formAttr) => {
      const data = {}
      entries(details)?.forEach(([key, value]) => {
        if (!formAttr?.[key]) return
        const fieldType = formAttr?.[key]?.inputType

        if (isEqual(fieldType, 'dateTimePicker')) {
          data[key] = dateToDayJs(value)
        } else if (isEqual(fieldType, 'formUpload')) {
          data[key] = length(details?.[`${key}Details`])
            ? {
                fileList: modifyFileListKeys(details?.[`${key}Details`]),
              }
            : null
        } else {
          data[key] = value
        }
      })
      return data
    }

    const inspectionDetails = {
      hostelAdministrationRequestDto: {
        ...formValueFromResponse(editData, hostelAdministrationAttrFn()),
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

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'riceStockRegisterKg',
      val2Key: 'riceStockGroundBalanceKg',
      accumulationKey: 'variationInRice',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'dalStockRegisterKg',
      val2Key: 'dalStockGroundBalanceKg',
      accumulationKey: 'variationInDal',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'cookingOilStockRegisterKg',
      val2Key: 'cookingOilStockGroundBalanceKg',
      accumulationKey: 'variationInCookingOil',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'sugarStockRegisterKg',
      val2Key: 'sugarStockGroundBalanceKg',
      accumulationKey: 'variationInSugar',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'idliRavaStockRegisterKg',
      val2Key: 'idliRavaStockGroundBalanceKg',
      accumulationKey: 'variationInIdliRava',
    })

    calDifferenceInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'foodProvisionRequestDto',
      val1Key: 'ragiMaltStockRegisterKg',
      val2Key: 'ragiMaltStockGroundBalanceKg',
      accumulationKey: 'variationInRagiMalt',
    })

    calPercentageInValue({
      nestedUpdatedValues: inspectionDetails,
      changedKey: 'hostelInfraSanitationRequestDto',
      val1Key: 'numberOfToiletsAvailable',
      val2Key: 'numberOfToiletsFunctioning',
      accumulationKey: 'percentageOfToiletFunctioning',
    })

    const preFormValues = {
      inspectionDate: editData?.inspectionDate
        ? dayJs(editData?.inspectionDate, 'DD/MM/YYYY HH:mm')
        : dayJs(new Date()),
      locationInspection:
        editData?.latitude && editData?.longitude
          ? `${editData?.latitude?.toFixed(4)},${editData?.longitude?.toFixed(4)}`
          : '',
      endLocationInspection:
        editData?.latitude2 && editData?.longitude2
          ? `${editData?.latitude2?.toFixed(4)},${editData?.longitude2?.toFixed(4)}`
          : '',
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

  const setFieldsPercentageFn = editData => {
    const calculatePercentage = formAttr => {
      const formFields = Object.fromEntries(
        entries(formAttr)?.filter(
          ([_, value]) => value?.label && !value?.disabled,
        ),
      )
      const totalField = keys(formFields)?.length
      const filledField =
        keys(formFields)?.filter(v => editData?.[v]).length || 0
      return Math.round((filledField / totalField) * 100) || 0
    }

    const inspectionPercentage = {
      hostelAdministrationRequestDto: calculatePercentage(
        hostelAdministrationAttrFn(),
      ),
      hostelInfraRoomsRequestDto: calculatePercentage(hostelInfraRoomsAttrFn()),
      hostelInfraSanitationRequestDto: calculatePercentage(
        hostelInfraSanitationAttrFn(),
      ),
      medicalCareRequestDto: calculatePercentage(medicalCareAttrFn()),
      educationFacilitiesRequestDto: calculatePercentage(
        educationFacilitiesAttrFn(),
      ),
      foodProvisionRequestDto: calculatePercentage(foodProvisionAttrFn()),
      safetyAndSecurityRequestDto: calculatePercentage(
        safetyAndSecurityAttrFn(),
      ),
      conductionMeetingsRequestDto: calculatePercentage(
        conductionMeetingsAttrFn(),
      ),
      feedbackRequestDto: calculatePercentage(feedbackAttrFn()),
    }
    setFormFieldPercentage(inspectionPercentage)
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
    key,
    index,
  } = {}) => {
    if (isApiRunning && !jobId) return
    setIsApiRunning(true)

    const formData = { ...form.getFieldValue() }
    const latLng = formData.locationInspection
      ? formData.locationInspection?.split(',')
      : []
    const latLng2 = formData.endLocationInspection
      ? formData.endLocationInspection?.split(',')
      : []

    const payload = {
      id: jobId,
      jobType: payloadType?.[tabKeys?.inspection],
      inspectionDate: formData.inspectionDate.format('DD/MM/YYYY HH:MM'),
      hostelId: selectedUsers?.[userWiseRole?.hostel]?.[0]?.id,
      latitude: latLng?.[0] ? parseFloat(latLng?.[0]) : null,
      longitude: latLng?.[1] ? parseFloat(latLng?.[1]) : null,
      latitude2: latLng2?.[0] ? parseFloat(latLng2?.[0]) : null,
      longitude2: latLng2?.[1] ? parseFloat(latLng2?.[1]) : null,
      stepNumber: current + 1,
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
      if (!response?.data?.data) return false
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
    handleActiveFieldModal(key, index)

    if (confirm) {
      // reportPolling()
    }
    if (redirect) {
      dispatch(
        setJobActiveTab({
          status: tabKeys.active,
          type: tabKeys.inspection,
        }),
      )
      navigate(pathName.JOBS)
    }
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

  const calDifferenceInValue = ({
    nestedUpdatedValues,
    changedKey,
    val1Key,
    val2Key,
    accumulationKey,
  }) => {
    const val1 = nestedUpdatedValues?.[changedKey]?.[val1Key]
    const val2 = nestedUpdatedValues?.[changedKey]?.[val2Key]
    nestedUpdatedValues[changedKey] = {
      ...nestedUpdatedValues?.[changedKey],
      [accumulationKey]:
        nullOrUndefined(val1) && nullOrUndefined(val2)
          ? null
          : (val1 || 0) - (val2 || 0),
    }
    return nestedUpdatedValues
  }
  const calPercentageInValue = ({
    nestedUpdatedValues,
    changedKey,
    val1Key,
    val2Key,
    accumulationKey,
  }) => {
    const val1 = nestedUpdatedValues?.[changedKey]?.[val1Key]
    const val2 = nestedUpdatedValues?.[changedKey]?.[val2Key]
    nestedUpdatedValues[changedKey] = {
      ...nestedUpdatedValues?.[changedKey],
      [accumulationKey]:
        nullOrUndefined(val1) || nullOrUndefined(val2)
          ? null
          : (((val2 || 0) / (val1 || 0)) * 100).toFixed(2),
    }

    return nestedUpdatedValues
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
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'riceStockRegisterKg',
            val2Key: 'riceStockGroundBalanceKg',
            accumulationKey: 'variationInRice',
          })
        } else if (
          include(['dalStockRegisterKg', 'dalStockGroundBalanceKg'], nestedKey)
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'dalStockRegisterKg',
            val2Key: 'dalStockGroundBalanceKg',
            accumulationKey: 'variationInDal',
          })
        } else if (
          include(
            ['cookingOilStockRegisterKg', 'cookingOilStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'cookingOilStockRegisterKg',
            val2Key: 'cookingOilStockGroundBalanceKg',
            accumulationKey: 'variationInCookingOil',
          })
        } else if (
          include(
            ['sugarStockRegisterKg', 'sugarStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'sugarStockRegisterKg',
            val2Key: 'sugarStockGroundBalanceKg',
            accumulationKey: 'variationInSugar',
          })
        } else if (
          include(
            ['idliRavaStockRegister', 'idliRavaStockGroundBalance'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'idliRavaStockRegister',
            val2Key: 'idliRavaStockGroundBalance',
            accumulationKey: 'variationInIdliRava',
          })
        } else if (
          include(
            ['ragiMaltStockRegisterKg', 'ragiMaltStockGroundBalanceKg'],
            nestedKey,
          )
        ) {
          calDifferenceInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'ragiMaltStockRegisterKg',
            val2Key: 'ragiMaltStockGroundBalanceKg',
            accumulationKey: 'variationInRagiMalt',
          })
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
          calPercentageInValue({
            nestedUpdatedValues,
            changedKey,
            val1Key: 'numberOfToiletsAvailable',
            val2Key: 'numberOfToiletsFunctioning',
            accumulationKey: 'percentageOfToiletFunctioning',
          })
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

      const fieldValues = values(updatedValues?.[changeIndex])?.reduce(
        (acc, curr) => {
          return { ...acc, ...curr }
        },
        0,
      )
      setFieldsPercentageFn(fieldValues)
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
            'hostelPhotos',
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
      case 0:
      case 3:
        try {
          await form.validateFields()
        } catch (error) {
          return false
        }
        return true

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
    console.log('current', current)
    let isValid = await validationFn({ validateAll: true })
    console.log('isValid', isValid)
    if (!isValid) return
    if (include([1, 2], current)) {
      isValid = await apiCall({
        showMsg: true,
        isLoading: true,
      })
    } else if (isEqual(current, 3)) {
      setCompleteConfirmation({ open: true })
      return
    }
    if (!isValid) return

    return setCurrent(current + 1)
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const onCompleteConfirmationClose = () => {
    setCompleteConfirmation({ open: false })
  }

  const onAcceptCompleteConfirmation = async () => {
    setCompleteConfirmation({ open: false })
    const isValid = await apiCall({
      showMsg: true,
      isComplete: true,
      isLoading: true,
    })
    if (!isValid) return
    setCurrent(current + 1)
  }

  const handleSave = async ({ redirect = true, key, index } = {}) => {
    const isValid = await validationFn({ onSave: true })
    if (!isValid) return
    setLoader(true)
    apiCall({
      showMsg: true,
      redirect,
      key,
      index,
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
    if (isMobile) {
      const currentKey = keys?.filter(
        item => !activeKeys?.[index]?.includes(item),
      )
      setActiveFormField({ isOpen: true, key: currentKey?.[0] })
    }
    setActiveKeys(prev => {
      const clonePrev = [...(prev || [])]
      clonePrev[index] = keys
      return clonePrev
    })
  }

  const handleActiveFieldModal = (key, index) => {
    setActiveFormField({ isOpen: false, key: null })
    const updatedKeys = activeKeys?.[index]?.filter(v => notEqual(v, key))
    setActiveKeys(prev => {
      const clonePrev = [...(prev || [])]
      clonePrev[index] = updatedKeys
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
    getCurrentLocation,
    activeFormField,
    handleActiveFieldModal,
    formFieldPercentage,
    completeConfirmation,
    onCompleteConfirmationClose,
    onAcceptCompleteConfirmation,
  }
}

export default inspection
