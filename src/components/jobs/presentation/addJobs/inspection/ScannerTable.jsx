import useTranslations from '../../../../../hooks/useTranslations'
// import ANTDImage from '../../../../../shared/antd/ANTDImage'
import ANTDTable from '../../../../../shared/antd/ANTDTable'
import { getTranslationKeyById } from '../../../../../utils/customFunctions'

const ScannerTable = ({ dataSource, materialTypeList }) => {
  const { t } = useTranslations()

  // const hsnCodes = [760410, 760691, 760120, 760200, 760310, 760519, 760611]

  const columns = [
    {
      title: t('job_MaterialType'),
      key: 'job_MaterialType',
      align: 'center',
      render: rowData =>
        rowData?.materialTypeKey
          ? t(rowData?.materialTypeKey)
          : t(getTranslationKeyById(rowData?.materialTypeId, materialTypeList)),
    },
    {
      title: t('job_ScrapID'),
      key: 'job_ScrapID',
      align: 'center',
      render: (rowData, record, rowIndex) => {
        // return hsnCodes[rowIndex]
        return '-'
      },
    },
    {
      title: t('job_QrCode'),
      key: 'job_QrCode',
      align: 'center',
      render: () =>
        // <ANTDImage
        //   width={100}
        //   src={
        //     'https://dnum2o6eykwnz.cloudfront.net/qr-codes/qr-code_MatNEXT_Output_Certificate1.png'
        //   }
        // />
        '-',
    },
  ]
  return (
    <ANTDTable
      columns={columns}
      dataSource={dataSource?.map((val, i) => ({ ...val, key: i }))}
      pagination={false}
    />
  )
}

export default ScannerTable
