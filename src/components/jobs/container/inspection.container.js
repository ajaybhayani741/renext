import { useCallback, useEffect, useState } from 'react'

import usePromise from '../../../hooks/usePromise'
import useRedux from '../../../hooks/useRedux'
import useRouter from '../../../hooks/useRouter'
import useTranslations from '../../../hooks/useTranslations'
import { setPopupMessageModel } from '../../../redux/app/reducer'
import { useFormFn } from '../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../utils/constant'
import { dayJs } from '../../../utils/dayjs'
import debounce from '../../../utils/debounce'
import {
  entries,
  include,
  isEqual,
  keys,
  nullOrUndefined,
  values,
} from '../../../utils/javascript'
import { removeEquipmentApi } from '../jobs.api'
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
  // eslint-disable-next-line no-unused-vars
  const { navigate, params } = useRouter()
  const { dispatch } = useRedux()
  // eslint-disable-next-line no-unused-vars
  const { createPromise, resolvePromise } = usePromise()
  const [jobId, setJobId] = useState(null)
  const [current, setCurrent] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [loader, setLoader] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [activeKeys, setActiveKeys] = useState([])
  const [confirmModel, setConfirmModel] = useState({
    open: false,
    description: '',
  })
  const inspectionInitialValues = {
    jobCompletionDate: dayJs(new Date()),
    managementNumber: '',
    remark: '',
    jobType: 'INSPECTION',
  }
  const isEdit = !!params?.jobId
  const showSave = isEdit || include([1], current)
  const { consumer, producer, collectionCenter, dealer } = userWiseRole

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
    }
  }, [])

  const setEditApiDataToForm = async () => {
    setJobId(params?.jobId)
  }

  // eslint-disable-next-line no-unused-vars
  const setPatchCallResponse = respData => {
    const inspectionListData = form.getFieldValue('inspectionList') || []
    const respInspectionList = respData?.jobElvsResponse || []
    const updatedInspectionList = inspectionListData.map((values, index) => ({
      ...values,
      systemId: respInspectionList[index]?.systemId,
    }))
    form.setFieldValue('inspectionList', updatedInspectionList)
  }

  // eslint-disable-next-line no-unused-vars
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
    // if (isApiRunning && !jobId) return
    // setIsApiRunning(true)
    // const formData = { ...form.getFieldValue() }
    // const payload = {
    //   jobType: 'RECOVERY',
    //   confirm,
    //   jobId,
    //   jobCompletionDate: formData.jobCompletionDate.format('DD/MM/YYYY'),
    //   managementNumber: formData.managementNumber,
    //   remark: formData.remark,
    //   scrapSourceId: formData.scrapSourceId,
    // }

    // setNextBtnLoader(isLoading)
    // if (!payload?.jobId || isComplete) {
    //   const response = await addJobPostApi({ payload })
    //   setNextBtnLoader(false)
    //   if (response?.data?.data) {
    //     if (!payload?.jobId && !isComplete) {
    //       notifyMethod.success({
    //         message: t('msg_JobCreatedSuccessfully', {
    //           jobId: response?.data?.data?.id,
    //         }),
    //       })
    //       setJobId(response?.data?.data?.jobId)
    //       form.setFieldValue('jobId', response?.data?.data?.jobId)
    //     }
    //     if (!isComplete) {
    //       payload.jobId = response?.data?.data?.jobId
    //       const res = await updateJobPatchApi({ payload })
    //       setNextBtnLoader(false)
    //       setLoader(false)
    //       setIsApiRunning(false)
    //       if (!res?.data?.data) return false
    //       setPatchCallResponse(res?.data?.data)
    //     }
    //   }
    //   setIsApiRunning(false)
    //   setLoader(false)
    // } else {
    //   const res = await updateJobPatchApi({ payload })
    //   setNextBtnLoader(false)
    //   setLoader(false)
    //   setIsApiRunning(false)
    //   if (!res?.data?.data) return false
    //   if (res?.data?.data && showMsg) {
    //     notifyMethod.success({
    //       message: t('msg_JobUpdatedSuccessfully', {
    //         jobId: res?.data?.data?.id,
    //       }),
    //     })
    //   }
    //   setPatchCallResponse(res?.data?.data)
    // }

    // if (confirm) {
    //   // reportPolling()
    // }
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

  // eslint-disable-next-line no-unused-vars
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

  // const handleFileUpload = async ({ file, fileList, filePath }) => {
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
  //     return form.setFieldValue(filePath, {
  //       fileList: fileList?.slice(0, -1),
  //     })
  //   }
  //   const dmsId = await onFileUploadOrRemove({ file })
  //   if (dmsId) {
  //     const fileDetails = fileList[length(fileList) - 1]
  //     fileList[length(fileList) - 1] = {
  //       url: await getBase64(fileDetails?.originFileObj),
  //       uid: fileDetails?.uid,
  //       type: fileDetails?.type,
  //       dmsId,
  //     }
  //     form.setFieldValue(filePath, {
  //       fileList,
  //     })
  //   }
  //   jobId && debounceApiCall({})
  // }

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
            ['riceStockAsPerRegister', 'riceStockGroundBalance'],
            nestedKey,
          )
        ) {
          const riceStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.riceStockAsPerRegister
          const riceStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.riceStockGroundBalance
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
          include(['dalStockAsPerRegister', 'dalStockGroundBalance'], nestedKey)
        ) {
          const dalStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.dalStockAsPerRegister
          const dalStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.dalStockGroundBalance
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
            ['cookingOilStockAsPerRegister', 'cookingOilStockGroundBalance'],
            nestedKey,
          )
        ) {
          const cookingOilStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.cookingOilStockAsPerRegister
          const cookingOilStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.cookingOilStockGroundBalance
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
            ['sugarStockAsPerRegister', 'sugarStockGroundBalance'],
            nestedKey,
          )
        ) {
          const sugarStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.sugarStockAsPerRegister
          const sugarStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.sugarStockGroundBalance
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
            ['idliRavaStockAsPerRegister', 'idliRavaStockGroundBalance'],
            nestedKey,
          )
        ) {
          const idliRavaStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.idliRavaStockAsPerRegister
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
            ['ragiMaltStockAsPerRegister', 'ragiMaltStockGroundBalance'],
            nestedKey,
          )
        ) {
          const ragiMaltStockAsPerRegisterVal =
            nestedUpdatedValues?.[changedKey]?.ragiMaltStockAsPerRegister
          const ragiMaltStockGroundBalanceVal =
            nestedUpdatedValues?.[changedKey]?.ragiMaltStockGroundBalance
          nestedUpdatedValues[changedKey] = {
            ...nestedUpdatedValues?.[changedKey],
            variationInRagiMalt:
              nullOrUndefined(ragiMaltStockAsPerRegisterVal) &&
              nullOrUndefined(ragiMaltStockGroundBalanceVal)
                ? null
                : (ragiMaltStockAsPerRegisterVal || 0) -
                  (ragiMaltStockGroundBalanceVal || 0),
          }
        }
      }

      // const systemId = form.getFieldValue([
      //   'inspectionList',
      //   changeIndex,
      //   'systemId',
      // ])
      // if (systemId) {
      //   updatedValues[changeIndex].systemId = systemId
      // }

      form.setFieldsValue({
        inspectionList: updatedValues,
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

  const validationFn = async ({ onSave, validateAll }) => {
    switch (current) {
      default:
        return true
    }
  }

  const handleNext = async () => {
    let isValid = await validationFn({ validateAll: true })

    if (!isValid) return
    return setCurrent(current + 1)
  }

  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  const handleSave = async ({ redirect = true } = {}) => {
    const isValid = await validationFn({ onSave: true })
    if (!isValid) return

    // setLoader(true)
    apiCall({
      showMsg: true,
      redirect,
    })
  }

  const removeMaterialClick = async ({ remove, name, index }) => {
    setSelectedUsers(prev => {
      const clonePrev = { ...prev }
      const prevConsumer = clonePrev?.[consumer] || []
      const prevProducer = clonePrev?.[producer] || []
      const prevDealer = clonePrev?.[dealer] || []
      const prevCollectionCenter = clonePrev?.[collectionCenter] || []
      prevConsumer.splice(index, 1)
      prevProducer.splice(index, 1)
      prevDealer.splice(index, 1)
      prevCollectionCenter.splice(index, 1)
      return clonePrev
    })
    const inspectionList = form.getFieldValue('inspectionList')
    const systemId = inspectionList[index]?.systemId
    if (systemId) {
      const payload = {
        jobId,
        jobType: 'RECOVERY',
        deleteEquipments: [systemId],
      }
      const resp = await removeEquipmentApi({ payload })
      if (resp?.data?.success) remove(name)
    } else {
      remove(name)
    }
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
    removeMaterialClick,
    onActiveKeysChange,
    onConfirmModelClose,
    onAcceptConfirmation,
    findingsAttrFn,
  }
}

export default inspection
