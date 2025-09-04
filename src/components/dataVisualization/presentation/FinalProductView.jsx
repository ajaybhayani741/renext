import React from 'react'

import FinalProductCardView from './FinalProductCardView'
import VisualizationTable from './VisualizationTable'
import equipmentView from '../container/equipmentView'

const FinalProductView = () => {
  const {
    formData,
    currentSelectedType,
    handleSelect,
    handleClear,
    handleSearch,
  } = equipmentView()
  return (
    <div className="d-flex">
      <VisualizationTable
        {...{
          formData,
          handleSelect,
          handleClear,
          handleSearch,
        }}
      />
      <div className="card ml-15 field-equipment-card-main">
        <FinalProductCardView
          {...{
            currentSelectedType,
            formData,
          }}
        />
      </div>
    </div>
  )
}

export default FinalProductView
