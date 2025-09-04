import EquipmentCardView from './EquipmentCardView'
import VisualizationTable from './VisualizationTable'
import equipmentView from '../container/equipmentView'

function EquipmentView() {
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
        <EquipmentCardView
          {...{
            currentSelectedType,
            formData,
          }}
        />
      </div>
    </div>
  )
}

export default EquipmentView
