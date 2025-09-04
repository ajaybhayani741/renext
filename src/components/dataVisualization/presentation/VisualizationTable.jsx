import classNames from 'classnames'

import useTranslations from '../../../hooks/useTranslations'
import ANTDButton from '../../../shared/antd/ANTDButton'
import ANTDInput from '../../../shared/antd/ANTDInput'
import ANTDTable from '../../../shared/antd/ANTDTable'
import ANTDToolTip from '../../../shared/antd/ANTDTooltip'
import { isEqual, keys, ternary } from '../../../utils/javascript'
import { countryLabels } from '../../userManagement/addressData'
import { selectionTableColumn } from '../container/visualizationColumns'

function VisualizationTable({
  formData,
  handleSelect,
  handleClear,
  handleSearch,
  isDisabled,
  isParentLogin,
  className,
}) {
  const { t } = useTranslations()

  const listViewElem = ({ rowData, parentName, name, value, selected }) => (
    <li
      onClick={() => handleSelect({ value: rowData, name: parentName || name })}
      className={`cursor-pointer ${
        selected && 'color-dark'
      } selection-table-li text-start ellipsify`}
    >
      <ANTDToolTip>
        {ternary(isEqual(name, 'txt_Country'), countryLabels[value], value)}
      </ANTDToolTip>
    </li>
  )

  const searchInput = ({ value, name, disabled }) => (
    <div className="search-user w-100">
      <ANTDInput
        name="table-filter"
        placeholder={t('txt_Search')}
        value={value}
        disabled={isDisabled?.[name] || disabled}
        onChange={e => handleSearch({ e, name })}
      />
    </div>
  )

  const childTable = ({ dataSource, parentName }) => (
    <>
      {[{ name: 'user_Child' }, { name: 'user_Associate' }].map(
        ({ name }, index) => (
          <ANTDTable
            key={index}
            tableLayout="fixed"
            dataSource={dataSource?.[name]?.filtered?.map((value, index) => ({
              ...value,
              key: value?.id || index,
            }))}
            columns={selectionTableColumn({
              t,
              name,
              formData: dataSource,
              parentName,
              searchInput,
              listViewElem,
            })}
            pagination={false}
            className={`inner-table ${name}`}
          />
        ),
      )}
    </>
  )

  return (
    <div className="w-50 h-100 table-filter-view overflowX-auto">
      {keys(formData)?.map((name, index) => {
        const hasChildren = isParentLogin && isEqual(name, 'user_Contractor')
        const dataSource = ternary(hasChildren, [{}], formData[name]?.filtered)
        const isClearDisabled =
          !formData?.[name]?.selected?.[
            isEqual(name, 'txt_Country') ? 'name' : 'id'
          ] || isDisabled?.[name]

        return (
          <div className={`${className} table-filter`} key={index + 1}>
            <div className="table-filter-inner">
              <ANTDTable
                tableLayout="fixed"
                className={classNames('search-list', {
                  'multi-table': hasChildren,
                  [name]: !hasChildren,
                })}
                dataSource={dataSource?.map((value, index) => ({
                  ...value,
                  key: value?.id || index,
                }))}
                columns={selectionTableColumn({
                  t,
                  name,
                  formData,
                  hasChildren,
                  searchInput,
                  childTable,
                  listViewElem,
                })}
                pagination={false}
              />
              <ANTDButton
                type="primary"
                className={`btn vertical-bottom`}
                disabled={isClearDisabled}
                onClick={() =>
                  handleClear({
                    currentType: name,
                    index,
                    previousType: keys(formData)?.[index - 1],
                  })
                }
              >
                {t('txt_Clear')}
              </ANTDButton>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default VisualizationTable
