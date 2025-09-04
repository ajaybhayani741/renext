import ELVDetailsView from './ELVDetailsView'
import useTranslations from '../../../../../hooks/useTranslations'
import ANTDCard from '../../../../../shared/antd/ANTDCard'
import ANTDImage from '../../../../../shared/antd/ANTDImage'
import ANTDTable from '../../../../../shared/antd/ANTDTable'
import { noImage } from '../../../../../utils/icons'
import { include, isEqual, length } from '../../../../../utils/javascript'
import FormUpload from '../../../../common/presentation/FormUpload'

const MaterialDetails = ({ ELVData, scrapSource, currentForm }) => {
  const { t } = useTranslations()
  const columns = [
    {
      title: t('job_MaterialType'),
      dataIndex: 'materialType',
      key: 'materialType',
      render: rowData => t(rowData),
    },
    {
      title: t('job_ScrapId'),
      dataIndex: 'scrapId',
      key: 'scrapId',
    },
    {
      title: t('job_ScrapQuantity'),
      dataIndex: 'scrapQuantity',
      key: 'scrapQuantity',
    },
    {
      title: t('job_Images'),
      dataIndex: 'elvImagesDmsIds',
      key: 'job_Images',
      render: rowData =>
        length(rowData?.fileList) ? (
          <FormUpload
            takePhotoFlag={false}
            value={rowData}
            showUploadList={{ showRemoveIcon: false }}
          />
        ) : (
          <ANTDImage src={noImage} height={80} width={80} />
        ),
    },
  ]

  return (
    <ANTDCard className="mb-15">
      <h2 className="content-title mb-10">
        {t(
          isEqual(scrapSource, 'job_Part')
            ? 'txt_PartDetails'
            : isEqual(scrapSource, 'job_Material')
              ? 'job_MaterialDetails'
              : 'job_ELVDetails',
        )}
      </h2>
      {include(['job_Vehicle', 'job_Part'], scrapSource) ? (
        ELVData?.map((details, index) => (
          <ELVDetailsView
            {...{ index, scrapSource, details, currentForm }}
            key={index}
          />
        ))
      ) : (
        <ANTDTable
          dataSource={
            ELVData?.map(({ materialDetails } = {}) => materialDetails) || []
          }
          columns={columns}
          pagination={false}
          scroll={{ x: '100%' }}
          // loading={loader}
        />
      )}
    </ANTDCard>
  )
}

export default MaterialDetails
