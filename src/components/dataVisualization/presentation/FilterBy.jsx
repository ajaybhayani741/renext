import React from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDColumn from '../../../shared/antd/ANTDColumn'
import ANTDRow from '../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import filterBy from '../container/filterBy'

function FilterBy({ type }) {
  const { t } = useTranslations()
  const { handleFilterBy, filterTag, getFilterByTagList } = filterBy({
    t,
    type,
  })

  return (
    <div className="mb-30">
      <ANTDRow className="d-flex justify-content-end align-center" gutter={10}>
        <ANTDColumn>
          <h4 className="m-auto">{t('txt_FilterBy')}: </h4>
        </ANTDColumn>
        <ANTDColumn>
          <ANTDSelect
            placeholder={`--- ${t('txt_None')} ---`}
            options={getFilterByTagList()}
            // value={filterTag?.tag}
            style={{ width: '150px' }}
            onChange={value => handleFilterBy({ value, type: 'tag' })}
          />
        </ANTDColumn>
        <ANTDColumn>
          <ANTDSelect
            showSearch
            placeholder={`--- ${t('txt_None')} ---`}
            options={[]}
            // options={filterValueList?.list?.map(val => ({
            //   value: val?.id,
            //   label: val?.name,
            // }))}
            // onSearch={handleSearch}
            filterOption={false}
            // onPopupScroll={handleScroll}
            value={filterTag?.value}
            style={{ width: '150px' }}
            // onChange={value => handleFilterBy({ value, type: 'value' })}
          />
        </ANTDColumn>
        <ANTDColumn>
          <ANTDButton
            type="primary"
            className={`btn ${
              (!filterTag?.tag || !filterTag?.value) && 'disable-btn'
            }`}
            disabled={!filterTag?.tag || !filterTag?.value}
            onClick={() => handleFilterBy({ clear: true })}
          >
            {t('txt_Clear')}
          </ANTDButton>
        </ANTDColumn>
      </ANTDRow>
    </div>
  )
}

export default FilterBy
