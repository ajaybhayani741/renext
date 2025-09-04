import MaterialDetails from './MaterialDetails'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDConfigProvider from '../../../../../shared/antd/ANTDConfigProvider'
import ANTDDivider from '../../../../../shared/antd/ANTDDivider'
import { useFormInstanceFn } from '../../../../../shared/antd/ANTDForm'
import { userWiseRole } from '../../../../../utils/constant'
import { getTranslationKeyById } from '../../../../../utils/customFunctions'
import { dayJs } from '../../../../../utils/dayjs'
import { isEqual, length, ternary } from '../../../../../utils/javascript'
import JobCompletionDate from '../../common/JobCompletionDate'
import JobReport from '../../common/JobReport'
import JobUserSelect from '../../common/JobUserSelect'
import Remarks from '../../common/Remarks'

const ConfirmView = ({
  selectedUsers,
  isDirect,
  isELVnPartsSelected,
  scrapSource,
  vehicleCategoryList,
  providedByList,
  elvSourceList,
  fuelTypeList,
  challanPaidTypeList,
  categoryELVOptions,
}) => {
  const { t } = useTranslations()
  const form = useFormInstanceFn()
  const recoverListData = form?.getFieldValue('recoverList')
  const { consumer, site, dealer, collectionCenter, producer } = userWiseRole
  const dateToString = date => (date ? dayJs(date)?.format('DD/MM/YYYY') : '')
  const ELVData = recoverListData?.map((details, index) => {
    const {
      basicDetailsRequestDto,
      rcFormTwoDetailsRequestDto,
      vehicleCategoryRequestDto,
      sourceCommercialDetailsRequestDto,
      optionalDetailsRequestDto,
      fileUploadSectionRequestDto: imageList,
    } = details || {}
    const category = categoryELVOptions?.find(elem =>
      isEqual(vehicleCategoryRequestDto?.categoryId, elem?.id),
    )
    return {
      producer: [selectedUsers?.[producer]?.[index]],
      systemId: details?.systemId,
      basicDetailsResponseDto: {
        ...basicDetailsRequestDto,
        elvScrapTypeKey: getTranslationKeyById(
          basicDetailsRequestDto?.elvScrapTypeId,
          providedByList,
        ),
        dateOfReceiptOfVehicle: dateToString(
          basicDetailsRequestDto?.dateOfReceiptOfVehicle,
        ),
        vehicleCategoryKey: getTranslationKeyById(
          basicDetailsRequestDto?.vehicleCategoryId,
          vehicleCategoryList,
        ),
        dateOfInspection: dateToString(
          basicDetailsRequestDto?.dateOfInspection,
        ),
      },
      rcFormTwoDetailsResponseDto: {
        ...rcFormTwoDetailsRequestDto,
        registrationDate: dateToString(
          rcFormTwoDetailsRequestDto?.registrationDate,
        ),
        registrationValidityDate: dateToString(
          rcFormTwoDetailsRequestDto?.registrationValidityDate,
        ),
        vehicleManufactureMonthYear: dateToString(
          rcFormTwoDetailsRequestDto?.vehicleManufactureMonthYear,
        ),
        vehicleFuelTypeKey: getTranslationKeyById(
          rcFormTwoDetailsRequestDto?.vehicleFuelTypeId,
          fuelTypeList,
        ),
        pickedDate: dateToString(rcFormTwoDetailsRequestDto?.pickedDate),
        paymentDate: dateToString(rcFormTwoDetailsRequestDto?.paymentDate),
        certificateOfDepositDate: dateToString(
          rcFormTwoDetailsRequestDto?.certificateOfDepositDate,
        ),
        invoiceDate: dateToString(rcFormTwoDetailsRequestDto?.invoiceDate),
        consumerInfo: selectedUsers?.[consumer]?.[index],
        producerInfo: selectedUsers?.[producer]?.[index],
      },
      category: {
        categoryKey: category?.categoryKey || category?.name,
        name: category?.name,
      },
      sourceCommercialDetailsResponseDto: {
        ...sourceCommercialDetailsRequestDto,
        elvSourceKey: getTranslationKeyById(
          sourceCommercialDetailsRequestDto?.elvSourceId,
          elvSourceList,
        ),
        vehicleReceiptAtCollectionCenterDate: dateToString(
          sourceCommercialDetailsRequestDto?.vehicleReceiptAtCollectionCenterDate,
        ),
        vehicleDispatchDate: dateToString(
          sourceCommercialDetailsRequestDto?.vehicleDispatchDate,
        ),
        challanSourceKey: t(
          getTranslationKeyById(
            sourceCommercialDetailsRequestDto?.challanSourceId,
            challanPaidTypeList,
          ),
        ),
        dealerInfo: selectedUsers?.[dealer]?.[index],
        consumerInfo: selectedUsers?.[consumer]?.[index],
        collectionCenterInfo: selectedUsers?.[collectionCenter]?.[index],
      },
      optionalDetailsResponseDto: {
        ...optionalDetailsRequestDto,
      },
      imageList: [
        {
          label: 'job_Form2',
          value: length(imageList?.formTwoDmsIds?.fileList)
            ? imageList?.formTwoDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_COD',
          value: length(imageList?.codDmsIds?.fileList)
            ? imageList?.codDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_CVS',
          value: length(imageList?.cvsDmsIds?.fileList)
            ? imageList?.cvsDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_PaymentConfirmation',
          value: length(imageList?.paymentConfirmationDmsIds?.fileList)
            ? imageList?.paymentConfirmationDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_MSTICertificate',
          value: length(imageList?.mstiCertDmsIds?.fileList)
            ? imageList?.mstiCertDmsIds?.fileList
            : [],
          md: 24,
        },
        {
          label: 'job_ElvImages',
          value: length(imageList?.elvImagesDmsIds?.fileList)
            ? imageList?.elvImagesDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_RegistrationCertificate',
          value: length(imageList?.registrationCertDmsIds?.fileList)
            ? imageList?.registrationCertDmsIds?.fileList
            : [],
          md: 12,
        },
        {
          label: 'job_OtherFiles',
          value: length(imageList?.otherFilesDmsIds?.fileList)
            ? imageList?.otherFilesDmsIds?.fileList
            : [],
          md: 12,
        },
      ],
    }
  })
  return (
    <ANTDConfigProvider
      theme={{
        token: {
          colorBgContainerDisabled: '#ffffff',
        },
      }}
    >
      <h2 className="content-title mb-15">{t('job_Preview')}</h2>
      <div className="pl-15">
        <JobReport
          isUpdatedDate={false}
          {...{
            reportList: {},
            jobType: ternary(isDirect, 'DIRECT_RECOVERY', 'RECOVERY'),
            hideShareUpdate: true,
          }}
        />
      </div>
      <ANTDDivider className="mb-10" />
      <div className="confirm-date">
        <JobCompletionDate {...{ readOnly: true }} />
        {/* <ManagementNumber {...{ disabled: true }} /> */}
      </div>
      {!isELVnPartsSelected && (
        <>
          <JobUserSelect
            {...{
              selectTitle: 'user_Consumer',
              roleId: consumer,
              userData: selectedUsers?.[consumer],
              readOnly: true,
            }}
          />
          <JobUserSelect
            {...{
              selectTitle: 'user_Site',
              roleId: site,
              userData: selectedUsers?.[site],
              readOnly: true,
            }}
          />
        </>
      )}
      <MaterialDetails
        ELVData={ELVData}
        scrapSource={scrapSource}
        currentForm={form}
      />
      <div className="mt-10 confirm-remark">
        <Remarks readOnly={true} />
      </div>
    </ANTDConfigProvider>
  )
}

export default ConfirmView
