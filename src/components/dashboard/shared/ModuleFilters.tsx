import React from 'react';
import { Select } from 'antd';
import { districts, hostelNames } from '../../../data/dummyData';

const { Option } = Select;

interface ModuleFiltersProps {
  districtFilter: string;
  setDistrictFilter: (val: string) => void;
  hostelFilter: string;
  setHostelFilter: (val: string) => void;
  extraFilters?: React.ReactNode;
}

const ModuleFilters: React.FC<ModuleFiltersProps> = ({ districtFilter, setDistrictFilter, hostelFilter, setHostelFilter, extraFilters }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex-1 min-w-[200px]">
        <div className="text-sm font-medium text-slate-500 mb-2">Filter by District</div>
        <Select 
          showSearch 
          value={districtFilter} 
          onChange={setDistrictFilter} 
          style={{ width: "100%" }}
        >
          <Option value="All">All Districts</Option>
          {Array.from(new Set(districts)).map((name) => (
            <Option key={name} value={name}>{name}</Option>
          ))}
        </Select>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 flex-1 min-w-[200px]">
        <div className="text-sm font-medium text-slate-500 mb-2">Filter by Hostel</div>
        <Select
          showSearch
          value={hostelFilter}
          onChange={setHostelFilter}
          style={{ width: "100%" }}
          optionFilterProp="children"
        >
          <Option value="All">All Hostels</Option>
          {hostelNames.map((name) => (
            <Option key={name} value={name}>{name}</Option>
          ))}
        </Select>
      </div>

      {extraFilters}
    </div>
  );
};

export default ModuleFilters;
