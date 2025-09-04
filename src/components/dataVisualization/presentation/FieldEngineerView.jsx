import FieldEngineerCardView from './FieldEngineerCardView'
import VisualizationTable from './VisualizationTable'
import fieldEngineerView from '../container/fieldEngineerView'

function FieldEngineerView() {
  const {
    brandLoader,
    formData,
    fieldTableData,
    totalFE,
    loader,
    isDisabled,
    isParentLogin,
    handleSelect,
    handleClear,
    handleSearch,
  } = fieldEngineerView()
  return (
    <div className="d-flex">
      <VisualizationTable
        {...{
          formData,
          handleSelect,
          handleClear,
          handleSearch,
          isParentLogin,
          isDisabled,
          loader,
          className: 'three-table-filter',
        }}
      />
      <div className="card ml-15 field-engineer-card-main">
        <FieldEngineerCardView {...{ brandLoader, fieldTableData, totalFE }} />
      </div>
    </div>
  )
}

export default FieldEngineerView
