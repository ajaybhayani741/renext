import {
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import { notifyMethod } from '../../../../../App'
import usePromise from '../../../../../hooks/usePromise'
import useRedux from '../../../../../hooks/useRedux'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCard from '../../../../../shared/antd/ANTDCard'
import ANTDCollapse from '../../../../../shared/antd/ANTDCollapse'
import ANTDColumn from '../../../../../shared/antd/ANTDColumn'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
  useFormInstanceFn,
} from '../../../../../shared/antd/ANTDForm'
import ANTDRow from '../../../../../shared/antd/ANTDRow'
import ANTDTable from '../../../../../shared/antd/ANTDTable'
import getFormInput from '../../../../../shared/form.description'
import PopUpConfirm from '../../../../../shared/PopUpConfirm'
import { getBase64 } from '../../../../../utils'
import { MAX_FILE_SIZE, userWiseRole } from '../../../../../utils/constant'
import { getLocation } from '../../../../../utils/customFunctions'
import { dayJs, formatDate } from '../../../../../utils/dayjs'
import { MapPin, RewindTimeIcon } from '../../../../../utils/icons'
import {
  entries,
  include,
  isArray,
  isEqual,
  keys,
  length,
  notEqual,
  nullOrUndefined,
} from '../../../../../utils/javascript'
import { getItem } from '../../../../../utils/localstorage'
import FormUpload from '../../../../common/presentation/FormUpload'
import jobContext from '../../../container/jobContext.container'
import {
  getGeoTagDataApi,
  postJobEditLogApi,
  quickEditAPI,
} from '../../../jobs.api'
import {
  APPROVED,
  COLLECTION_CENTER,
  DIRECT_DEALER,
  DIRECT_INDIVIDUAL,
  ELV,
  OEM,
  PENDING,
  TEST_VEHICLE_REGISTERED,
  TEST_VEHICLE_UNREGISTERED,
} from '../../../jobs.description'
import EditLogTable from '../../common/EditLogTable'
import JobUserSelect from '../../common/JobUserSelect'

const CellRender = ({
  record,
  rowData,
  editLogStatus,
  onEditLogClick,
  onSaveClick,
  showEdit,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const [isEdit, setIsEdit] = useState(null)
  const {
    options,
    inputType,
    key,
    detailKey,
    editable = true,
    apiKey,
    rules = [],
    required = false,
    ...restProps
  } = record || {}

  const isEditDisabled = isEqual(editLogStatus?.status, PENDING)

  const onEditClick = ({ value }) => {
    setIsEdit(true)
    if (nullOrUndefined(value)) return

    const fieldValue = isEqual(record?.inputType, 'dateTimePicker')
      ? value
        ? dayJs(value, 'DD/MM/YYYY')
        : null
      : isEqual(record?.inputType, 'select') && record?.apiKey
        ? record?.options?.find(item => t(item?.label) === value)?.value
        : value

    form.setFieldsValue({
      [record?.key]: fieldValue,
    })
  }

  const handleSaveClick = async ({ record, detailKey }) => {
    try {
      await form.validateFields([key])
    } catch (error) {
      return
    }
    setIsEdit(false)
    onSaveClick({ record, detailKey })
  }

  if (include(['select', 'dateTimePicker'], inputType)) {
    restProps.className = `${restProps.className || ''} w-100`.trim()
  }

  const InputComponent = getFormInput({ inputType })
  const optionList = options?.map(val => ({
    ...val,
    label: typeof val.label === 'object' ? val.label : t(val.label),
  }))

  return (
    <div className="d-flex space-between">
      <span className="mr-5 w-100">
        {isEdit ? (
          <ANTDFormItem
            className="tabuler-form-item"
            name={key}
            rules={
              required
                ? [
                    { required: true, message: t('error_FieldISRequire') },
                    ...rules,
                  ]
                : rules
            }
          >
            <InputComponent {...restProps} options={optionList} />
          </ANTDFormItem>
        ) : isEqual(inputType, 'select') ? (
          t(options?.find(item => item?.value === rowData)?.label || rowData)
        ) : isEqual(inputType, 'dateTimePicker') ? (
          rowData ? (
            dayJs(rowData, 'DD/MM/YYYY')?.format('YYYY/MM/DD')
          ) : (
            '-'
          )
        ) : (
          rowData?.toString() ?? '-'
        )}
      </span>
      {showEdit && editable && (
        <span className="d-flex" style={{ maxHeight: '32px' }}>
          {isEdit ? (
            <SaveOutlined
              height="20px"
              width="20px"
              onClick={() =>
                handleSaveClick({
                  record: { key, inputType, apiKey, options },
                  detailKey,
                })
              }
            />
          ) : (
            <EditOutlined
              height="20px"
              width="20px"
              className={classNames({
                'disabled-illusion': isEditDisabled,
              })}
              onClick={() =>
                onEditClick({
                  record,
                  value: rowData,
                })
              }
            />
          )}

          {!!editLogStatus?.status && (
            <RewindTimeIcon
              className="rewind-icon"
              onClick={() => onEditLogClick(record, editLogStatus?.canApprove)}
            />
          )}
        </span>
      )}
    </div>
  )
}

const TabulerView = ({ elvDetails, userSelectionList, currentForm }) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const { createPromise, resolvePromise } = usePromise()
  const { selector } = useRedux()
  const { fuelTypeList = [], vehicleCategoryList = [] } = selector(
    state => state?.jobs?.options,
  )
  const [data, setData] = useState(elvDetails)
  const [confirmModel, setConfirmModel] = useState({ open: false })
  const [geoTagData, setGeoTagData] = useState({})
  const locationRef = useRef(null)
  const userData = JSON.parse(getItem('userData'))
  const { roleId } = { ...userData }
  const {
    recycler,
    scrappingFacilityManager,
    superUser,
    scrappingFacilityEntryUser,
    dataEntry,
    salesUser,
    categoryUser,
  } = userWiseRole

  const { onFileUploadOrRemove } = jobContext()
  const [editLogModel, setEditLogModel] = useState({ open: false })

  const vehicleType = data?.basicDetailsResponseDto?.elvScrapTypeKey
  const sourceType = data?.sourceCommercialDetailsResponseDto?.elvSourceKey

  useEffect(() => {
    if (data?.imageList) {
      const tempImageList = {}
      data?.imageList?.forEach(item => {
        const fieldKey = fileUploadAttr[item?.label]?.name
        tempImageList[fieldKey] = {
          fileList: isArray(item?.value) ? item.value : [],
        }
      })
      form.setFieldsValue({ ...tempImageList })
    }
    const getCurrentLocation = async () => {
      const data = await getLocation()
      locationRef.current = data
    }
    getCurrentLocation()

    //read only fields which are not stored on backend
    setData(prev => {
      const { basicDetailsResponseDto, rcFormTwoDetailsResponseDto } = prev
      return {
        ...prev,
        rcFormTwoDetailsResponseDto: {
          ...rcFormTwoDetailsResponseDto,
          weighmentAtScrapFacilityInKgs:
            basicDetailsResponseDto?.weightAsPerMsti,
          differenceInWeightAsPerMakerAndScrapFacility:
            rcFormTwoDetailsResponseDto?.weightAsPerMaker
              ? rcFormTwoDetailsResponseDto?.weightAsPerMaker -
                (basicDetailsResponseDto?.weightAsPerMsti || 0)
              : null,
        },
      }
    })
  }, [])

  const imageFieldsKeys = [
    'formTwoDmsIds',
    'codDmsIds',
    'cvsDmsIds',
    'paymentConfirmationDmsIds',
    'mstiCertDmsIds',
    'elvImagesDmsIds',
    'otherFilesDmsIds',
    'registrationCertDmsIds',
  ]

  const fileUploadAttr = {
    job_Form2: {
      name: 'formTwoDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_COD: {
      name: 'codDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_CVS: {
      name: 'cvsDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_PaymentConfirmation: {
      name: 'paymentConfirmationDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_MSTICertificate: {
      name: 'mstiCertDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
    job_ElvImages: {
      name: 'elvImagesDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp',
      uploadSingle: true,
    },
    job_OtherFiles: {
      name: 'otherFilesDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
    },
    job_RegistrationCertificate: {
      name: 'registrationCertDmsIds',
      acceptFileTypes: '.png,.jpg,.jpeg,.webp,.pdf',
      uploadSingle: true,
    },
  }

  const challanDetailsMap = {
    challanCustomerQuotedPrice:
      'job_ChallanAmountDeductedFromCustomerQuotedPriceAgainstTotalChallanAmount',
    challanDealerCommissionPrice:
      'job_ChallanAmountDeductedFromDealerCommissionPriceAgainstTotalChallanAmount',
    totalAmount: 'job_TotalChallanValueChallanDeduction',
  }

  const challanPaidByMap = {
    challanSourceKey: 'job_ChallanPaidBy',
    totalChallanAmount: 'job_TotalChallanAmount',
  }

  const onRemove = file => {
    setConfirmModel(prev => ({ ...prev, open: true }))
    return createPromise()
  }

  const onConfirmModelClose = () => {
    resolvePromise(false)
    setConfirmModel(prev => ({ ...prev, open: false }))
  }

  const onConfirmRemove = () => {
    resolvePromise(true)
    onConfirmModelClose()
  }

  const modifyDataValue = ({
    record,
    updatedValue,
    detailKey,
    dependentData,
  }) => {
    setData(prev => ({
      ...prev,
      [detailKey]: {
        ...prev[detailKey],
        [record.key]:
          isEqual(record?.inputType, 'select') && record?.apiKey
            ? t(
                record?.options?.find(item => item?.value === updatedValue)
                  ?.label,
              )
            : updatedValue,
        ...(record.apiKey && {
          [record.apiKey]: updatedValue,
        }),
        ...dependentData,
      },
    }))
  }

  const onSaveClick = async ({ record, detailKey }) => {
    const fieldValue = form.getFieldValue(record?.key) ?? null
    const updatedValue = isEqual(record?.inputType, 'dateTimePicker')
      ? fieldValue?.format('DD/MM/YYYY') || null
      : fieldValue

    const keyName = record?.apiKey || record?.key
    const prevValue = data?.[detailKey]?.[keyName]
    if (isEqual(prevValue, updatedValue)) return

    const payload = {
      jobId: data?.jobId,
      scrapId: data?.systemId,
      keyName,
      value: nullOrUndefined(updatedValue) ? -1 : updatedValue, // -1 for removing the value as per backend,
      ...locationRef.current,
    }

    try {
      const response = await postJobEditLogApi({ payload })
      if (response?.data?.success) {
        if (include([recycler, scrappingFacilityManager, superUser], roleId)) {
          const { dependentKey, dependentKeyValue } = response?.data
          modifyDataValue({
            record,
            updatedValue,
            detailKey,
            dependentData: {
              [dependentKey]: dependentKeyValue,
            },
          })
        }
        //disable edit button when pending approval
        setData(prev => ({
          ...prev,
          editLogKeyStatus: {
            ...prev?.editLogKeyStatus,
            [keyName]: {
              ...prev?.editLogKeyStatus?.[keyName],
              status: include(
                [recycler, scrappingFacilityManager, superUser],
                roleId,
              )
                ? APPROVED
                : PENDING,
            },
          },
        }))
      }
    } catch (error) {}
  }

  const onEditLogClick = (record, canApprove) => {
    setEditLogModel({
      open: true,
      scrapId: data?.systemId,
      keyName: record?.apiKey || record?.key,
      record,
      canApprove,
    })
  }

  const onEditLogModelClose = ({
    status = null,
    updatedValue,
    dependentData,
  } = {}) => {
    setEditLogModel({ open: false })
    if (status) {
      isEqual(status, APPROVED) &&
        modifyDataValue({
          record: editLogModel?.record,
          updatedValue,
          detailKey: editLogModel?.record?.detailKey,
          dependentData,
        })

      setData(prev => ({
        ...prev,
        editLogKeyStatus: {
          ...prev?.editLogKeyStatus,
          [editLogModel?.record?.apiKey || editLogModel?.record?.key]: {
            ...prev?.editLogKeyStatus?.[
              editLogModel?.record?.apiKey || editLogModel?.record?.key
            ],
            status,
          },
        },
      }))
    }
  }

  const tabulerDetailColumn = showEdit => [
    {
      title: '',
      dataIndex: 'label',
      key: 'label',
      render: rowData => <b>{t(rowData)}</b>,
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '49%',
      render: (rowData, record) => {
        return (
          <CellRender
            showEdit={showEdit}
            record={record}
            rowData={rowData}
            editLogStatus={
              data?.editLogKeyStatus?.[record?.apiKey || record?.key]
            }
            onEditLogClick={onEditLogClick}
            onSaveClick={onSaveClick}
          />
        )
      },
    },
  ]

  const dataViewUI = useCallback(
    ({ details, detailKey, attributes, showEdit }) => {
      const dataList = entries(attributes)?.map(([key, attr]) => ({
        key,
        ...attr,
        detailKey,
        value: details?.[key],
      }))
      const halfLength = Math.ceil(length(dataList) / 2)
      const leftTable = dataList?.slice(0, halfLength)
      const rightTable = dataList?.slice(halfLength)

      const partitions = [
        leftTable,
        ...(length(rightTable) ? [rightTable] : []),
      ]

      return (
        <>
          <ANTDRow gutter={10} className="mb-10">
            {partitions.map((dataSource, i) => (
              <ANTDColumn lg={12} xs={24} key={i}>
                <ANTDTable
                  className="tebuler-table"
                  dataSource={dataSource}
                  columns={tabulerDetailColumn(showEdit)}
                  pagination={false}
                  bordered
                  size="small"
                  // scroll={{ x: 900 }}
                  // loading={loader}
                />
              </ANTDColumn>
            ))}
          </ANTDRow>
        </>
      )
    },
    [data],
  )

  const mapToOption = list =>
    list?.map(({ key, name, id }) => ({
      label: t(key || name),
      value: id,
    })) || []

  const checkIfAfterOrSameDate = (date1, date2) =>
    dayJs(date1).isAfter(dayJs(date2)) || dayJs(date1).isSame(dayJs(date2))

  const dateValidator =
    ({ labelDate1, labelDate2, date2Value }) =>
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (value && date2Value && !checkIfAfterOrSameDate(value, date2Value)) {
          return Promise.reject(
            new Error(
              t('msg_Date1ShouldBeOnOrAfterDate2', {
                date1: t(labelDate1),
                date2: t(labelDate2),
              }),
            ),
          )
        }
        return Promise.resolve()
      },
    })

  const basicDetailsAttr = [
    {
      title: '',
      fields: {
        elvScrapTypeKey: {
          label: 'job_VehicleType',
          inputType: 'select',
          editable: false,
        },
        dateOfReceiptOfVehicle: {
          label: 'job_DateOfReceiptOfVehicle',
          inputType: 'dateTimePicker',
          className: 'w-100',
          format: 'YYYY/MM/DD',
          required: true,
          rules: [
            dateValidator({
              labelDate1: 'job_DateOfReceiptOfVehicle',
              labelDate2: 'job_VehicleDispatchDate',
              date2Value: formatDate(
                data?.sourceCommercialDetailsResponseDto?.vehicleDispatchDate,
                'DD/MM/YYYY',
              ),
            }),
          ],
        },
        vehicleCategoryKey: {
          label: 'job_VehicleCategoryTitle',
          inputType: 'select',
          apiKey: 'vehicleCategoryId',
          options: mapToOption(vehicleCategoryList),
        },
        mstiVehicleNo: {
          label: 'job_RVSFVehicleNo',
          inputType: 'input',
          required: true,
        },
        ...(!include(
          [TEST_VEHICLE_UNREGISTERED, TEST_VEHICLE_REGISTERED],
          vehicleType,
        ) && {
          vehicleRegistrationNumber: {
            label: 'job_VehicleRegistrationNumber',
            inputType: 'input',
            rules: [
              {
                min: 8,
                max: 11,
                message: t(
                  'msg_VehicleRegistrationNumber8To11CharactersAreAllowed',
                ),
              },
            ],
          },
        }),
        weightAsPerMsti: {
          label: 'job_WeightAsPerMSTIWeighmentInKG',
          editable: false,
        },
        ...(include(
          [TEST_VEHICLE_UNREGISTERED, TEST_VEHICLE_REGISTERED],
          vehicleType,
        ) && {
          vehicleLocation: {
            label: 'inv_Location',
            inputType: 'input',
          },
        }),
      },
    },
  ]

  const preInspectionAttr = [
    {
      title: '',
      fields: {
        preInspectionCompleted: {
          label: 'job_PreInspectionCompleted',
          inputType: 'select',
          options: [
            { label: 'btn_Yes', value: true },
            { label: 'btn_No', value: false },
          ],
          required: true,
          rules: [
            {
              validator(_, value) {
                if (!nullOrUndefined(value) && notEqual(value, true)) {
                  return Promise.reject(
                    new Error(t('msg_PleaseCompletePreInspection')),
                  )
                }
                return Promise.resolve()
              },
            },
          ],
        },
        dateOfInspection: {
          label: 'job_DateOfInspection',
          inputType: 'dateTimePicker',
          className: 'w-100',
          format: 'YYYY/MM/DD',
          required: true,
          rules: [
            dateValidator({
              labelDate1: 'job_DateOfInspection',
              labelDate2: 'job_DateOfReceiptOfVehicle',
              date2Value: formatDate(
                data?.basicDetailsResponseDto?.dateOfReceiptOfVehicle,
                'DD/MM/YYYY',
              ),
            }),
          ],
        },
        remarks: {
          label: 'job_Remarks',
          inputType: 'input',
          rules: [{ max: 300, message: 'Max 300 characters allowed' }],
        },
      },
    },
  ]

  const form2AndRCDataAttr = [
    ...(include([ELV, TEST_VEHICLE_REGISTERED], vehicleType)
      ? [
          {
            title: '',
            fields: {
              registrationNumber: {
                label: 'job_RegistrationNumber',
                inputType: 'input',
                rules: [
                  {
                    min: 8,
                    max: 11,
                    message: t(
                      'msg_VehicleRegistrationNumber8To11CharactersAreAllowed',
                    ),
                  },
                ],
              },
              registrationDate: {
                label: 'job_DateOfRegistration',
                inputType: 'dateTimePicker',
                className: 'w-100',
                format: 'YYYY/MM/DD',
              },
              // registrationValidityDate: {
              //   label: 'job_RegistrationValidity',
              //   inputType: 'dateTimePicker',
              //   className: 'w-100',
              //   format: 'YYYY/MM/DD',
              // },
            },
          },
          {
            title: 'job_VehicleDetails',
            fields: {
              vehicleRegistrationNumber: {
                label: 'job_VehicleRegistrationNumber',
                inputType: 'input',
                rules: [
                  {
                    min: 8,
                    max: 11,
                    message: t(
                      'msg_VehicleRegistrationNumber8To11CharactersAreAllowed',
                    ),
                  },
                ],
              },
              vehicleModelName: {
                label: 'job_Form2RcModelName',
                inputType: 'input',
                md: 8,
                xs: 24,
              },
              modelKey: {
                editable: false,
                apiKey: 'modelId',
                label: 'modelName',
                inputType: 'input',
                placeholder: t('job_SelectModel'),
                // producerId: selectedUsers?.[producer]?.[index]?.id,
                options: [],
                md: 8,
                xs: 24,
              },
              vehicleChassisNo: {
                label: 'chassisNo',
                inputType: 'input',
                // rules: [
                //   {
                //     min: 17,
                //     max: 17,
                //     message: t('msg_Only17CharactersAreAllowed'),
                //   },
                // ],
              },
              vehicleEngineNo: {
                label: 'engineNo',
                inputType: 'input',
              },
              vehicleManufactureMonthYear: {
                label: 'monthYearOfManufacture',
                inputType: 'dateTimePicker',
                picker: 'month',
                format: 'MM/YYYY',
                className: 'w-100',
              },
              vehicleFuelTypeKey: {
                label: 'job_FuelType',
                inputType: 'select',
                apiKey: 'vehicleFuelTypeId',
                options: mapToOption(fuelTypeList),
              },
              rtoName: {
                label: 'RTOName',
                inputType: 'input',
              },
              weightAsPerRc: {
                label: 'job_WeightAsPerRegistrationCertificateInKG',
                inputType: 'inputNumber',
                className: 'w-100',
              },
            },
          },
          {
            title: 'job_TransportationDetails',
            fields: {
              freight: {
                label: 'job_Freight',
                inputType: 'inputNumber',
              },
              towingDetails: {
                label: 'job_TowingDetails',
                inputType: 'input',
              },
              pickedBy: {
                label: 'job_PickedBy',
                inputType: 'input',
              },
              pickedDate: {
                label: 'job_PickedDate',
                inputType: 'dateTimePicker',
                className: 'w-100',
                format: 'YYYY/MM/DD',
              },
            },
          },
          {
            title: 'job_CustomerPaymentDetails',
            fields: {
              bankName: {
                label: 'job_BankName',
                inputType: 'input',
              },
              branch: {
                label: 'job_Branch',
                inputType: 'input',
              },
              beneficiary: {
                label: 'job_Beneficiary',
                inputType: 'input',
              },
              ifsc: {
                label: 'job_IFSC',
                inputType: 'input',
              },
              accountNumber: {
                label: 'job_AccountNumber',
                inputType: 'input',
              },
            },
          },
          {
            title: 'job_CODDetails',
            fields: {
              certificateOfDepositNo: {
                label: 'job_CertificateOfDepositNo',
                inputType: 'input',
              },
              certificateOfDepositDate: {
                label: 'job_CertificateOfDepositDate',
                inputType: 'dateTimePicker',
                className: 'w-100',
                format: 'YYYY/MM/DD',
              },
            },
          },
        ]
      : []),
    ...(include([TEST_VEHICLE_UNREGISTERED], vehicleType)
      ? [
          {
            title: '',
            fields: {
              location: {
                label: 'inv_Location',
                inputType: 'input',
              },
              modelKey: {
                editable: false,
                apiKey: 'modelId',
                label: 'modelName',
                inputType: 'input',
                placeholder: t('job_SelectModel'),
                // producerId: selectedUsers?.[producer]?.[index]?.id,
                options: [],
                md: 8,
                xs: 24,
              },
              weightAsPerMaker: {
                editable: false,
                label: 'job_WeightAsPerMakerKgs',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              weighmentAtScrapFacilityInKgs: {
                editable: false,
                label: 'job_WeightAsPerMSTIWeighmentInKG',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              differenceInWeightAsPerMakerAndScrapFacility: {
                editable: false,
                label: 'job_DifferenceInWeightAsPerMakerAndScrapFacility',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              vehicleChassisNo: {
                label: 'chassisNo',
                inputType: 'input',
                // rules: [
                //   {
                //     min: 17,
                //     max: 17,
                //     message: t('msg_Only17CharactersAreAllowed'),
                //   },
                // ],
              },
              vehicleEngineNo: {
                label: 'engineNo',
                inputType: 'input',
              },
              invoiceNo: {
                label: 'job_InvoiceNo',
                inputType: 'input',
              },
              invoiceDate: {
                label: 'job_InvoiceDate',
                inputType: 'dateTimePicker',
                className: 'w-100',
                format: 'YYYY/MM/DD',
              },
              invoiceAmount: {
                label: 'job_InvoiceAmount',
                inputType: 'inputNumber',
              },
              gst: {
                label: 'job_GST',
                inputType: 'inputNumber',
              },
              compensationCess: {
                label: 'job_CompensationCess',
                inputType: 'inputNumber',
              },
              tcs: {
                label: 'job_TCS',
                inputType: 'inputNumber',
              },
              totalInvoiceValue: {
                label: 'job_TotalInvoiceValue',
                inputType: 'inputNumber',
              },
              freight: {
                label: 'job_Freight',
                inputType: 'inputNumber',
              },
              purchasePrice: {
                label: 'job_TotalPurchaseValue',
                inputType: 'inputNumber',
              },
              pickedBy: {
                label: 'job_PickedBy',
                inputType: 'input',
              },
            },
          },
        ]
      : []),
  ]

  const mstiPaymentDetails = [
    {
      title: '',
      fields: {
        paymentBank: {
          label: 'job_PaymentBankName',
          inputType: 'input',
        },
        paymentDate: {
          label: 'job_PaymentDate',
          inputType: 'dateTimePicker',
          className: 'w-100',
          format: 'YYYY/MM/DD',
          rules: [
            dateValidator({
              labelDate1: 'job_PaymentDate',
              labelDate2: 'job_DateOfReceiptOfVehicle',
              date2Value: formatDate(
                data?.basicDetailsResponseDto?.dateOfReceiptOfVehicle,
                'DD/MM/YYYY',
              ),
            }),
          ],
        },
        paymentAmount: {
          label: 'job_PaymentAmount',
          inputType: 'input',
        },
        paymentVoucherNo: {
          label: 'job_PaymentVoucherNo',
          inputType: 'input',
        },
      },
    },
  ]

  const vehicleCategoryAttr = [
    {
      title: '',
      fields: {
        name: {
          label: 'job_Category',
          inputType: 'select',
          editable: false,
        },
      },
    },
  ]

  const sourceAndCommercialsAttr = [
    {
      title: '',
      fields: {
        elvSourceKey: {
          label: 'job_Source',
          inputType: 'select',
          editable: false,
        },
        ...(include([DIRECT_DEALER, COLLECTION_CENTER], sourceType) && {
          ...(isEqual(sourceType, COLLECTION_CENTER) && {
            vehicleReceiptAtCollectionCenterDate: {
              label: 'job_DateOfReceiptOfVehicleAtCollectionCenter',
              inputType: 'dateTimePicker',
              className: 'w-100',
              format: 'YYYY/MM/DD',
              required: true,
            },
            collectionCenterDealerName: {
              label: 'job_CollectionCenterDealerName',
              inputType: 'input',
            },
            location: {
              label: 'inv_Location',
              inputType: 'input',
            },
            vehicleNumber: {
              label: 'job_VehicleNo',
              inputType: 'input',
              required: true,
              rules: [
                {
                  min: 8,
                  max: 11,
                  message: t(
                    'msg_VehicleRegistrationNumber8To11CharactersAreAllowed',
                  ),
                },
              ],
            },
            vehicleModelName: {
              label: 'job_VehicleModel',
              inputType: 'input',
              required: true,
            },
            vehicleDispatchDate: {
              label: 'job_VehicleDispatchDate',
              inputType: 'dateTimePicker',
              className: 'w-100',
              format: 'YYYY/MM/DD',
              required: true,
              rules: [
                dateValidator({
                  labelDate1: 'job_VehicleDispatchDate',
                  labelDate2: 'job_DateOfReceiptOfVehicleAtCollectionCenter',
                  date2Value: formatDate(
                    data?.sourceCommercialDetailsResponseDto
                      ?.vehicleReceiptAtCollectionCenterDate,
                    'DD/MM/YYYY',
                  ),
                }),
              ],
            },
          }),
        }),
      },
    },
    ...(include([DIRECT_DEALER, COLLECTION_CENTER], sourceType)
      ? [
          {
            title: 'job_CommercialsDetails',
            fields: {
              baseBuyingPrice: {
                label: 'job_BaseBuyingPrice',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              quotedPrice: {
                label: 'job_QuotedPrice',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              deductionFromCustomerQuotedPrice: {
                label: 'job_OtherDeductionFromCustomerQuotedPrice',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              challanDeductions: {
                label: 'job_ChallanDeductionsTotal',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              purchasePrice: {
                label: 'job_TotalPurchaseValue',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              netAmountToBePaidToCustomer: {
                label: 'job_NetAmountNeedToBePaidToTheCustomer',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              dealerCommission: {
                label: 'job_DealerCommission',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              specialIncentiveToDealer: {
                label: 'job_SpecialIncentiveToDealer',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              deductionFromDealerCommission: {
                label: 'job_OtherDeductionFromDealerCommission',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              netAmountToBePaidToDealer: {
                label:
                  'job_NetAmountNeedToBePaidToDealerIncludingSpecialIncentive',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              // otherDeductions: {
              //   label: 'job_OtherDeductions',
              //   inputType: 'inputNumber',
              //   className: 'w-100',
              // },
            },
          },
          // {
          //   challanDetailsTitle: {
          //     title: 'job_ChallanDetails',
          //   },
          //   challanPaidBy: {
          //     label: 'job_ChallanPaidBy',
          //   },
          //   totalChallanAmount: {
          //     label: 'job_TotalChallanAmount',
          //   },
          // },
        ]
      : []),

    ...(include([DIRECT_INDIVIDUAL, OEM], sourceType)
      ? [
          {
            title: 'job_CommercialsDetails',
            fields: {
              quotedPrice: {
                label: 'job_QuotedPrice',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              purchasePrice: {
                label: 'job_TotalPurchaseValue',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              otherDeductions: {
                label: 'job_OtherDeductions',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              challanDeductions: {
                label: 'job_ChallanDeductionsTotal',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              deductionFromCustomerQuotedPrice: {
                label: 'job_OtherDeductionFromCustomerQuotedPrice',
                inputType: 'inputNumber',
                className: 'w-100',
              },
              netAmountToBePaidToCustomer: {
                label: 'job_NetAmountNeedToBePaidToTheCustomer',
                inputType: 'inputNumber',
                className: 'w-100',
              },
            },
          },
        ]
      : []),
  ]

  const optionalDetailsAttr = [
    {
      title: 'job_VehicleDetails',
      fields: {
        cubicCapacity: {
          label: 'job_CubicCapacity',
          inputType: 'input',
        },
        wheelBase: {
          label: 'job_WheelBase',
          inputType: 'input',
        },
        seatingCapacity: {
          label: 'job_SeatingCapacity',
          inputType: 'input',
        },
        color: {
          label: 'job_Color',
          inputType: 'input',
        },
        stateName: {
          label: 'stateName',
          inputType: 'input',
        },
      },
    },
    {
      title: 'job_ConsumerDetails',
      fields: {
        email: {
          label: 'user_Email',
          inputType: 'input',
        },
        sonDaughterWifeOf: {
          label: 'job_SonDaughterWifeOf',
          inputType: 'input',
        },
        address1: {
          label: 'job_Address1',
          inputType: 'input',
        },
        address2: {
          label: 'job_Address2',
          inputType: 'input',
        },
        address3: {
          label: 'job_Address3',
          inputType: 'input',
        },
        city: {
          label: 'user_City',
          inputType: 'input',
        },
        state: {
          label: 'user_State',
          inputType: 'input',
        },
        district: {
          label: 'job_District',
          inputType: 'input',
        },
        pincode: {
          label: 'user_Pincode',
          inputType: 'input',
        },
        pan: {
          label: 'job_PAN',
          inputType: 'input',
        },
      },
    },
    {
      title: 'job_VehicleChecks',
      fields: {
        noHypothecation: {
          label: 'job_NoHypothecation',
          inputType: 'select',
          options: [
            { label: 'btn_Yes', value: true },
            { label: 'btn_No', value: false },
          ],
        },
        ncrbChecks: {
          label: 'job_NCRBChecks',
          inputType: 'select',
          options: [
            { label: 'btn_Yes', value: true },
            { label: 'btn_No', value: false },
          ],
        },
        notBlacklisted: {
          label: 'job_NotBlacklisted',
          inputType: 'select',
          options: [
            { label: 'btn_Yes', value: true },
            { label: 'btn_No', value: false },
          ],
        },
      },
    },
    {
      title: 'job_VehicleDepositedBy',
      fields: {
        vehicleDepositedBy: {
          label: 'job_VehicleDepositedBy',
          inputType: 'input',
        },
      },
    },
    {
      title: 'job_CustomerPaymentDetails',
      fields: {
        confirmAccountNumber: {
          label: 'job_ConfirmAccountNumber',
          inputType: 'input',
        },
      },
    },
    {
      title: 'job_Commercials',
      fields: {
        purchasedFrom: {
          label: 'job_PurchasedFrom',
          inputType: 'input',
        },
      },
    },
  ]

  const collapseItemUI = useCallback(
    ({ fieldAttr = [], detailKey, showEdit }) =>
      fieldAttr.map((item, index) => (
        <Fragment key={index}>
          <h3 className="mb-5 w-100 px-5 primary-color">{t(item.title)}</h3>
          {dataViewUI({
            details: data?.[detailKey],
            detailKey,
            attributes: item.fields,
            showEdit,
          })}
        </Fragment>
      )),
    [data],
  )

  const geoTaggingAPI = async () => {
    const commonParams = {
      jobType: 'RECOVERY',
      scrapId: data?.systemId,
    }
    const [
      codDmsIds,
      cvsDmsIds,
      elvImagesDmsIds,
      mstiCertDmsIds,
      formTwoDmsIds,
      paymentConfirmationDmsIds,
      registrationCertDmsIds,
      otherFilesDmsIds,
    ] = await Promise.all([
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'codDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'cvsDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'elvImagesDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'mstiCertDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'formTwoDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'paymentConfirmationDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'registrationCertDmsIds' },
      }),
      getGeoTagDataApi({
        params: { ...commonParams, fieldName: 'otherFilesDmsIds' },
      }),
    ])
    setGeoTagData({
      codDmsIds,
      cvsDmsIds,
      elvImagesDmsIds,
      mstiCertDmsIds,
      formTwoDmsIds,
      paymentConfirmationDmsIds,
      registrationCertDmsIds,
      otherFilesDmsIds,
    })
  }

  const onFileUploadCollapse = value => {
    if (include(value, 'job_FilesUploads')) geoTaggingAPI()
  }

  const onValuesChange = async (value, formValues) => {
    const changedKey = keys(value)?.[0]
    if (include(imageFieldsKeys, changedKey)) {
      const file = value?.[changedKey]
      const isLt5MB =
        !(file?.file?.size || file?.file?.originFileObj?.size) ||
        Number(file?.file?.size || file?.file?.originFileObj?.size) <
          MAX_FILE_SIZE

      const fileList = formValues?.[changedKey]?.fileList
      if (!isLt5MB) {
        notifyMethod.warning({
          message: t('msg_MaximumSizeAllowed', {
            maxSize: MAX_FILE_SIZE / 1024 / 1024,
          }),
        })
        return form.setFieldValue(changedKey, {
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
        form.setFieldValue(changedKey, {
          fileList,
        })
      }
      const payload = {
        scrapId: data?.systemId,
        processed: null,
        fileUploadSectionRequestDto: imageFieldsKeys.reduce((init, imgKey) => {
          init[imgKey] = formValues?.[imgKey]?.fileList?.map(val => val?.dmsId)
          return init
        }, {}),
        ...locationRef.current,
      }
      const response = await quickEditAPI({ payload })
      if (response?.data?.data?.success) {
        const resp = await getGeoTagDataApi({
          params: {
            jobType: 'RECOVERY',
            scrapId: data?.systemId,
            fieldName: changedKey,
          },
        })
        setGeoTagData(prev => ({ ...prev, [changedKey]: resp }))
      }
    } else if (
      include(
        ['vehicleRegistrationNumber', 'registrationNumber', 'vehicleNumber'],
        changedKey,
      )
    ) {
      form.setFieldValue(changedKey, value?.[changedKey]?.toUpperCase())
    }
  }

  const allPermissionRoles = [recycler, scrappingFacilityManager, superUser]

  const showEditPermission = ({ section }) => {
    if (notEqual(data?.status, 'RECOVERY_COMPLETED')) return false

    switch (section) {
      case 'job_BasicVehicleDetails':
        return include(
          [...allPermissionRoles, scrappingFacilityEntryUser],
          roleId,
        )
      case 'job_RCDataAndForm2':
        return (
          Boolean(vehicleType) &&
          include([...allPermissionRoles, dataEntry, categoryUser], roleId)
        )
      case 'job_SourceAndCommercials':
        return include([...allPermissionRoles, salesUser], roleId)

      case 'job_OptionalDetails':
        return include([...allPermissionRoles, dataEntry, categoryUser], roleId)

      default:
        return false
    }
  }

  const selectedUserTable = collapseKey => {
    const selectedList = userSelectionList?.filter(val =>
      isEqual(val.section, collapseKey),
    )

    return length(selectedList)
      ? selectedList.map(({ key, slot, ...props }) => {
          const Slot = slot || JobUserSelect
          return (
            <Slot
              key={key}
              {...{
                ...props,
                readOnly: true,
                currentForm,
              }}
            />
          )
        })
      : null
  }

  return (
    <ANTDForm initialValues={{}} form={form} onValuesChange={onValuesChange}>
      <ANTDCollapse
        bordered={false}
        onChange={onFileUploadCollapse}
        items={[
          {
            label: t('job_BasicVehicleDetails'),
            key: 'job_BasicVehicleDetails',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('basicDetailsResponseDto')}
                {collapseItemUI({
                  fieldAttr: basicDetailsAttr,
                  detailKey: 'basicDetailsResponseDto',
                  showEdit: showEditPermission({
                    section: 'job_BasicVehicleDetails',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_PreInspection'),
            key: 'job_PreInspection',
            className: 'coll collapse-header',
            children: (
              <>
                {collapseItemUI({
                  fieldAttr: preInspectionAttr,
                  detailKey: 'basicDetailsResponseDto',
                  showEdit: showEditPermission({
                    section: 'job_BasicVehicleDetails',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_RCDataAndForm2'),
            key: 'job_RCDataAndForm2',
            className: 'coll collapse-header',
            children: (
              <>
                {selectedUserTable('rcFormTwoDetailsResponseDto')}
                {collapseItemUI({
                  fieldAttr: form2AndRCDataAttr,
                  detailKey: 'rcFormTwoDetailsResponseDto',
                  showEdit: showEditPermission({
                    section: 'job_RCDataAndForm2',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_MSTIPaymentDetails'),
            key: 'job_MSTIPaymentDetails',
            className: 'coll collapse-header',
            children: include([ELV, TEST_VEHICLE_REGISTERED], vehicleType) ? (
              <>
                {collapseItemUI({
                  fieldAttr: mstiPaymentDetails,
                  detailKey: 'rcFormTwoDetailsResponseDto',
                  showEdit: showEditPermission({
                    section: 'job_RCDataAndForm2',
                  }),
                })}
              </>
            ) : null,
          },
          {
            label: t('vehicleCategory'),
            key: 'vehicleCategory',
            className: 'coll collapse-header',
            children: (
              <>
                {collapseItemUI({
                  fieldAttr: vehicleCategoryAttr,
                  detailKey: 'category',
                })}
              </>
            ),
          },
          {
            label: t('job_SourceAndCommercials'),
            key: 'job_SourceAndCommercials',
            className: 'coll collapse-header',
            children:
              notEqual(vehicleType, TEST_VEHICLE_UNREGISTERED) &&
              include(
                [...allPermissionRoles, salesUser, categoryUser],
                roleId,
              ) ? (
                <>
                  {selectedUserTable('sourceCommercialDetailsResponseDto')}
                  {collapseItemUI({
                    fieldAttr: sourceAndCommercialsAttr,
                    detailKey: 'sourceCommercialDetailsResponseDto',
                    showEdit: showEditPermission({
                      section: 'job_SourceAndCommercials',
                    }),
                  })}

                  {include([DIRECT_DEALER, COLLECTION_CENTER], sourceType) ? (
                    <ANTDCard className="mt-10">
                      {entries(challanPaidByMap)?.map(([key, label]) => (
                        <tr key={key}>
                          <td>
                            <b>{t(label)}</b>
                          </td>
                          <td>{`: ${
                            t(
                              data?.sourceCommercialDetailsResponseDto?.[key],
                            ) || '-'
                          }`}</td>
                        </tr>
                      ))}
                      <table className="w-100">
                        <tbody>
                          {length(
                            data?.sourceCommercialDetailsResponseDto
                              ?.challanDetailsDtos,
                          )
                            ? data?.sourceCommercialDetailsResponseDto?.challanDetailsDtos?.map(
                                (value, index) => (
                                  <div
                                    key={index}
                                    className="mb-10 grey-card-body"
                                  >
                                    <h3 className="primary-color">{`${t(
                                      'job_Challan',
                                    )} ${index + 1}`}</h3>
                                    {entries(challanDetailsMap)?.map(
                                      ([key, label]) => (
                                        <tr key={key}>
                                          <td>
                                            <b>{t(label)}</b>
                                          </td>
                                          <td>{`: ${
                                            t(value?.[key]) || '-'
                                          }`}</td>
                                        </tr>
                                      ),
                                    )}
                                  </div>
                                ),
                              )
                            : null}
                        </tbody>
                      </table>
                    </ANTDCard>
                  ) : null}
                </>
              ) : null,
          },
          {
            label: t('job_OptionalDetails'),
            key: 'job_OptionalDetails',
            className: 'coll collapse-header',
            children: (
              <>
                {collapseItemUI({
                  fieldAttr: optionalDetailsAttr,
                  detailKey: 'optionalDetailsResponseDto',
                  showEdit: showEditPermission({
                    section: 'job_OptionalDetails',
                  }),
                })}
              </>
            ),
          },
          {
            label: t('job_FilesUploads'),
            key: 'job_FilesUploads',
            className: 'coll collapse-header',
            children: (
              <>
                <div className="mt-20 geotagging-details">
                  <ANTDRow gutter={10}>
                    {data?.imageList?.map(({ label, md = 12 }, ind) => {
                      const geoData =
                        geoTagData?.[fileUploadAttr?.[label]?.name]?.data
                      return (
                        <ANTDColumn key={ind} md={md} xs={24} className="mt-10">
                          <b className="d-block">{t(label)}</b>
                          <div className="d-flex">
                            <ANTDFormItem
                              name={fileUploadAttr?.[label]?.name}
                              noStyle
                            >
                              <FormUpload
                                {...fileUploadAttr?.[label]}
                                name={fileUploadAttr?.[label]?.name}
                                takePhotoFlag={false}
                                form={form}
                                onRemove={onRemove}
                              />
                            </ANTDFormItem>
                            {geoData?.userInfo?.id && (
                              <div className="ml-10" style={{ flex: 1 }}>
                                <p>
                                  <CalendarOutlined /> :{' '}
                                  {geoData?.updatedDate || '-'}
                                </p>
                                <p>
                                  <UserOutlined /> :{' '}
                                  {geoData?.userInfo?.businessName ||
                                    geoData?.userInfo?.lastName ||
                                    '-'}
                                </p>
                                <p>
                                  <span>
                                    <MapPin
                                      alt="location"
                                      className="updateAt-location"
                                    />
                                  </span>
                                  : {geoData?.address || '-'}
                                </p>
                                <p>
                                  <span>{t('job_Latitude')}</span> :{' '}
                                  {geoData?.latitude || '-'}
                                </p>
                                <p>
                                  <span>{t('job_Longitude')}</span>:{' '}
                                  {geoData?.longitude || '-'}
                                </p>
                              </div>
                            )}
                          </div>
                        </ANTDColumn>
                      )
                    })}
                  </ANTDRow>
                </div>
              </>
            ),
          },
        ].filter(({ hidden }) => !hidden)}
      />
      <PopUpConfirm
        isOpen={confirmModel?.open}
        onCancelModel={onConfirmModelClose}
        onAccept={onConfirmRemove}
        onReject={onConfirmModelClose}
        description={t('msg_AreYouSureYouWantRemoveThis')}
      />
      {editLogModel?.open && (
        <EditLogTable
          editLogModel={editLogModel}
          onEditLogModelClose={onEditLogModelClose}
          actionPermission={editLogModel?.canApprove}
        />
      )}
    </ANTDForm>
  )
}

export default TabulerView
