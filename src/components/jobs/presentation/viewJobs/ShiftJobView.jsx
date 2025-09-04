import useTranslations from '../../../../hooks/useTranslations'
import ANTDCollapse from '../../../../shared/antd/ANTDCollapse'
import Cashback from '../../../bookKeeping/presentation/Cashback'
import JohnTubes from '../../../bookKeeping/presentation/JohnTubes'
import Machines from '../../../bookKeeping/presentation/Machines'
import ScratchTicketTracking from '../../../bookKeeping/presentation/ScratchTicketTracking'
import ShiftInfoView from '../../../bookKeeping/presentation/ShiftInfoView'
import VendorPayout from '../../../bookKeeping/presentation/VendorPayout'
import ShiftReport from '../../../report/presentation/ShiftReport'

const ShiftJobView = ({ details }) => {
  const { t } = useTranslations()

  const commonProps = {
    shiftId: details?.id,
    readOnly: true,
  }

  return (
    <>
      <h2 className="page-title color-black">{t('menu_ShiftReport')}</h2>
      <ShiftInfoView details={details} />
      <ANTDCollapse
        className="collapsible-bg-black"
        bordered={false}
        defaultActiveKey={['1']}
        items={[
          {
            key: '1',
            label: t('menu_ScratchTicketTracking'),
            className: 'coll collapse-header',
            children: <ScratchTicketTracking {...commonProps} />,
          },
          {
            key: '2',
            label: t('menu_JohnTubes'),
            className: 'coll collapse-header mt-10',
            children: <JohnTubes {...commonProps} />,
          },
          {
            key: '3',
            label: t('menu_Machines'),
            className: 'coll collapse-header mt-10',
            children: <Machines {...commonProps} />,
          },
          {
            key: '4',
            label: t('menu_Cashback'),
            className: 'coll collapse-header mt-10',
            children: <Cashback {...commonProps} />,
          },
          {
            key: '5',
            label: t('menu_VendorPayout'),
            className: 'coll collapse-header mt-10',
            children: <VendorPayout {...commonProps} />,
          },
          {
            key: '6',
            label: t('menu_ShiftReport'),
            className: 'coll collapse-header mt-10',
            children: <ShiftReport {...commonProps} />,
          },
        ]}
      />
    </>
  )
}

export default ShiftJobView
