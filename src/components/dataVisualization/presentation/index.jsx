import React from 'react'

import FilterBy from './FilterBy'
import useRedux from '../../../hooks/useRedux'
import useTranslations from '../../../hooks/useTranslations'
import ANTDTab from '../../../shared/antd/ANTDTab'
import visualizationTab from '../container/visualizationTab'
import { tabList } from '../visualization.description'
import '../visualization.scss'

function DataVisualization() {
  const { t } = useTranslations()
  const { selector } = useRedux()
  const { handleTabChange, handleSubTabChange } = visualizationTab()
  const tabDetails = selector(state => state.dataVisualization?.tabDetails)
  const { currentTab, currentSubTab } = { ...tabDetails }

  return (
    <div>
      <h2 className="page-title">{t('menu_DataViz')}</h2>
      <ANTDTab
        activeKey={currentTab}
        key={currentTab}
        items={tabList.map(({ subTabList, ...item }) => ({
          ...item,
          label: t(item.label),
          children: (
            <ANTDTab
              key={currentSubTab}
              activeKey={currentSubTab}
              items={subTabList.map(({ Component, ...subItem }) => ({
                ...subItem,
                label: t(subItem?.label),
                children: (
                  <>
                    <FilterBy {...{ type: subItem.filterByType }} />
                    {Component && <Component />}
                  </>
                ),
              }))}
              centered
              onChange={handleSubTabChange}
            />
          ),
        }))}
        centered
        onChange={handleTabChange}
      />
    </div>
  )
}

export default DataVisualization
