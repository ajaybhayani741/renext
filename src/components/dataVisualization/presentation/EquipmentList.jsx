import React, { memo } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDInput from '../../../shared/antd/ANTDInput'
import { include, isEqual } from '../../../utils/javascript'

const EquipmentList = ({
  equipmentDetails,
  handleSelectEquipment,
  handleClearSelectedEQ,
  searchEquipment,
  handleSearchEquipment,
}) => {
  const data = equipmentDetails?.data?.list || []
  const EINData = searchEquipment
    ? data?.filter(value =>
        include(value?.name?.toLowerCase(), searchEquipment?.toLowerCase()),
      )
    : data

  const { t } = useTranslations()

  return (
    <div className="search-equipment-list">
      <h3 className="mt-15 text-underline mb-0">
        <b>{t('dvz_SelectEquipment')}</b>
      </h3>
      <div className={`vertical-top`}>
        <div className="ant-form-item-label mt-0">
          <label>{t('txt_Search')}</label>
        </div>
        <ANTDInput
          name="equipment-search"
          value={searchEquipment}
          onChange={handleSearchEquipment}
        />
        <ul className="equipment-search-list">
          {EINData?.map((item, ind) => {
            return (
              <li
                key={ind}
                className={`cursor-pointer ${
                  isEqual(equipmentDetails?.selected?.id, item?.id)
                    ? 'selected-equipment'
                    : ''
                }`}
                onClick={() => handleSelectEquipment({ selectedItem: item })}
              >
                {item.name}
              </li>
            )
          })}
        </ul>
      </div>
      <ANTDButton
        type="primary"
        className="btn"
        disabled={!equipmentDetails?.selected?.id}
        onClick={handleClearSelectedEQ}
      >
        {t('txt_Clear')}
      </ANTDButton>
    </div>
  )
}

export default memo(EquipmentList)
