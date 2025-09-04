import useTranslations from '../../hooks/useTranslations'
import ANTDCard from '../../shared/antd/ANTDCard'
import ANTDSpin from '../../shared/antd/ANTDSpin'

const NoDataLoaderCard = ({ title, loading }) => {
  const { t } = useTranslations()

  return (
    <ANTDCard className="no-data-chart" bordered={false}>
      <h3>{t(title)}</h3>

      <div className="no-data-text">
        {loading ? <ANTDSpin size="large" /> : t('msg_NoData')}
      </div>
    </ANTDCard>
  )
}

export default NoDataLoaderCard
