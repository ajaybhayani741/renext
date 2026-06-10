import { Select } from 'antd'
import { motion } from 'framer-motion'
import React from 'react'

import { districts, hostelNames } from '../../../data/dummyData'

const { Option } = Select

interface ModuleFiltersProps {
  districtFilter: string
  setDistrictFilter: (val: string) => void
  hostelFilter: string
  setHostelFilter: (val: string) => void
  extraFilters?: React.ReactNode
  leadingContent?: React.ReactNode
}

const ModuleFilters: React.FC<ModuleFiltersProps> = ({
  districtFilter,
  setDistrictFilter,
  hostelFilter,
  setHostelFilter,
  extraFilters,
  leadingContent,
}) => {
  return (
    <motion.div
      className="dashboard-filter-bar"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {leadingContent}
      <div className="dashboard-filter-card">
        <div className="text-sm font-medium text-slate-500 mb-2">Filter by District</div>
        <Select 
          showSearch 
          value={districtFilter} 
          onChange={setDistrictFilter} 
          style={{ width: "100%" }}
        >
          <Option value="All">All Districts</Option>
          {Array.from(new Set(districts)).map(name => (
            <Option key={name} value={name}>{name}</Option>
          ))}
        </Select>
      </div>

      <div className="dashboard-filter-card">
        <div className="text-sm font-medium text-slate-500 mb-2">Filter by Hostel</div>
        <Select
          showSearch
          value={hostelFilter}
          onChange={setHostelFilter}
          style={{ width: "100%" }}
          optionFilterProp="children"
        >
          <Option value="All">All Hostels</Option>
          {hostelNames.map(name => (
            <Option key={name} value={name}>{name}</Option>
          ))}
        </Select>
      </div>

      {extraFilters}
    </motion.div>
  )
}

export default React.memo(ModuleFilters)
