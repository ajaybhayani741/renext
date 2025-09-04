import useTranslations from '../../../hooks/useTranslations'
import ANTDModal from '../../../shared/antd/ANTDModal'
import { inventoryTags } from '../../../utils'
import { include, isArray } from '../../../utils/javascript'

const ViewInventory = ({
  viewSingleInventory,
  handleView,
  column,
  children,
}) => {
  const { t } = useTranslations()
  const { open, details } = viewSingleInventory

  const getValue = ({ value, key }) => {
    switch (key) {
      case 'currentState':
        return inventoryTags({ t, inventoryType: value })

      default:
        return t(value) || '-'
    }
  }

  const viewDetailList = column.map(
    value =>
      !include(['txt_Action', 'Action'], value?.title) && {
        label: value.title,
        value: value?.dataIndex,
        hidden: value?.hidden || false,
      },
  )

  return (
    <ANTDModal
      title={t('txt_Details')}
      centered
      open={open}
      onCancel={handleView}
      footer={false}
      width={1000}
    >
      <>
        {/* <div className="text-end">
          <ANTDImage
            src="https://dnum2o6eykwnz.cloudfront.net/qr-codes/qr-code_MatNEXT_Output_Certificate1.png"
            height={150}
            width={150}
          />
        </div> */}
        <div>
          <table className="inventory-view">
            <tbody>
              {viewDetailList.map((value, index) =>
                !value?.hidden && value.label ? (
                  <tr key={index} className={value?.classNames}>
                    <td>
                      <b>{t(value.label)}</b>
                    </td>
                    <td>
                      <span className="mr-15">: </span>
                      {getValue({
                        value: isArray(value?.value)
                          ? value.value.reduce(
                              (acc, cur) => acc?.[cur],
                              details,
                            )
                          : details?.[value?.value],
                        key: value?.value,
                      }) || '-'}
                    </td>
                    {value?.icon ? <td>{value?.icon}</td> : null}
                  </tr>
                ) : null,
              )}
            </tbody>
          </table>
        </div>
      </>
      {children}
    </ANTDModal>
  )
}

export default ViewInventory
