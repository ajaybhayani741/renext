import { SearchOutlined } from '@ant-design/icons'
import { theme } from 'antd'
import React, { useEffect, useRef } from 'react'

import useTranslations from '../../../hooks/useTranslations'
import ANTDDivider from '../../../shared/antd/ANTDDivider'
import ANTDInput from '../../../shared/antd/ANTDInput'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import debounce from '../../../utils/debounce'
import { length } from '../../../utils/javascript'

const { useToken } = theme

const RenderDropdownContent = ({
  menu,
  hasSearch,
  equalNotEqual,
  hasMatchFilter,
  onScroll,
  onSelectionChange,
  onInputSearch,
}) => {
  const { t } = useTranslations()
  const ref = useRef(null)
  const searchRef = useRef(null)
  const { token } = useToken()

  const contentStyle = {
    backgroundColor: token.colorBgElevated,
    borderRadius: token.borderRadiusLG,
    boxShadow: token.boxShadowSecondary,
  }
  const menuStyle = {
    boxShadow: 'none',
    maxHeight: '300px',
    overflow: 'auto',
  }

  const handleScroll = debounce(e => {
    const target = e.target
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
      // Your API call logic here
      onScroll && onScroll({ search: searchRef.current })
    }
  }, 300)

  useEffect(() => {
    if (ref.current?.menu?.list) {
      ref.current?.menu?.list?.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (ref.current?.menu?.list) {
        ref.current?.menu?.list?.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return (
    <div style={contentStyle}>
      {hasMatchFilter && (
        <>
          <div style={{ padding: '8px' }}>
            <ANTDSelect
              className="w-100"
              value={equalNotEqual}
              options={[
                { value: true, label: 'Is' },
                { value: false, label: 'Is Not' },
              ]}
              onChange={onSelectionChange}
            />
          </div>
          <ANTDDivider style={{ margin: 0 }} />
        </>
      )}
      {hasSearch && (
        <>
          <div style={{ padding: '8px' }}>
            <ANTDInput
              variant="filled"
              style={{ marginRight: '8px' }}
              placeholder={t('txt_Search')}
              onChange={e => {
                const { value } = e.target
                onInputSearch(value)
                searchRef.current = value
              }}
              onKeyDown={e => e.stopPropagation()}
              suffix={<SearchOutlined />}
            />
          </div>
        </>
      )}
      {React.cloneElement(menu, {
        style: menuStyle,
        ref,
      })}
    </div>
  )
}

const FilterDropdown = ({
  filterKey,
  items,
  equalNotEqual,
  menuProps,
  dropdownProps,
  label = 'Filter dropdown',
  hasSearch,
  hasMatchFilter,
  onScroll,
  onInputSearch,
  onEqualNotEqualChange,
}) => {
  const renderDropdownContent = menu => (
    <RenderDropdownContent
      menu={menu}
      hasSearch={hasSearch}
      equalNotEqual={equalNotEqual}
      hasMatchFilter={hasMatchFilter}
      onScroll={onScroll}
      onInputSearch={onInputSearch}
      onSelectionChange={value =>
        onEqualNotEqualChange({
          key: filterKey,
          value,
        })
      }
    />
  )

  return (
    <>
      <ANTDSelect
        allowClear
        showSearch={false}
        placeholder={label}
        className={`filter-dropdown ${
          menuProps?.selectedKeys?.length > 0 ? 'show-clear-icon' : ''
        }`}
        mode="multiple"
        maxTagCount="responsive"
        options={
          length(items)
            ? items?.map(value => ({
                label: value?.label,
                value: value?.key,
              }))
            : []
        }
        dropdownRender={renderDropdownContent}
        onChange={e => {
          menuProps?.onSelect({
            selectedKeys: e,
          })
        }}
      />
    </>
  )
}

export default FilterDropdown
