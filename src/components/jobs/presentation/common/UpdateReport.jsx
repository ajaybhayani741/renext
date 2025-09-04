import AddressSelector from './AddressSelector'
import useTranslations from '../../../../hooks/useTranslations'
import ANTDButton from '../../../../shared/antd/ANTDButton'
import ANTDForm, {
  ANTDFormItem,
  useFormFn,
} from '../../../../shared/antd/ANTDForm'
import ANTDInput from '../../../../shared/antd/ANTDInput'
import ANTDModal from '../../../../shared/antd/ANTDModal'
import { entries, isEqual, ternary } from '../../../../utils/javascript'
import { userValidation } from '../../../../utils/validation'

const UpdateReport = ({
  updateReport,
  setUpdateReport,
  formAttr,
  onSubmit,
  loader,
}) => {
  const { t } = useTranslations()
  const form = useFormFn()
  const { isOpen } = { ...updateReport }

  return (
    <ANTDModal
      centered
      title={t('job_UpdateDetails')}
      open={isOpen}
      onCancel={() => setUpdateReport({ isOpen: false })}
      footer={false}
      width={980}
    >
      <ANTDForm layout="vertical" form={form} onFinish={onSubmit}>
        {entries(formAttr)?.map(
          ([label, { key, currentValue, type, validate, ...attr }], index) => (
            <div className="bottom-border-1 mb-10" key={index}>
              <div className="mb-10">
                <h3>
                  {index + 1}. {t(`${label}`)}
                </h3>
              </div>
              <div className="m-5-percent">
                <div className="d-flex">
                  <label style={{ width: '100px' }}>
                    <b> {t('job_Now')}</b>
                  </label>
                  :<span className="ml-10"> {currentValue || '-'}</span>
                </div>
                <div className="d-flex mt-5">
                  <label style={{ width: '100px' }}>
                    <b> {t('job_UpdateTo')}</b>
                  </label>
                  :
                  {isEqual(type, 'address') ? (
                    <AddressSelector parentKey={key} form={form} />
                  ) : (
                    <ANTDFormItem
                      className="ml-10 w-100"
                      name={key}
                      validateTrigger="onChange"
                      rules={ternary(
                        validate,
                        userValidation({ type, form }),
                        [],
                      )}
                      {...attr}
                    >
                      <ANTDInput />
                    </ANTDFormItem>
                  )}
                </div>
              </div>
            </div>
          ),
        )}
        <ANTDFormItem className="d-flex justify-center">
          <ANTDButton
            type="primary"
            htmlType="submit"
            loading={loader}
            disabled={true}
          >
            {t('btn_Update')}
          </ANTDButton>
        </ANTDFormItem>
      </ANTDForm>
    </ANTDModal>
  )
}

export default UpdateReport
