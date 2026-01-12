import FilterDropdown from './FilterDropdown'
import ViewPreviousHistoryModal from './ViewPreviousHistoryModal'
import ANTDButton from '../../../shared/antd/ANTDButton'
import { ANTDDateRange } from '../../../shared/antd/ANTDDatePicker'
import ANTDForm, { ANTDFormItem } from '../../../shared/antd/ANTDForm'
import ANTDInput, { ANTDTextArea } from '../../../shared/antd/ANTDInput'
import ANTDModal from '../../../shared/antd/ANTDModal'
import ANTDSelect from '../../../shared/antd/ANTDSelect'
import ANTDTable from '../../../shared/antd/ANTDTable'
import Label from '../../../shared/Label'
import { validationTag } from '../../../utils/customFunctions'
import { DISPLAY_DATE_FORMAT } from '../../../utils/dayjs'
import { include, keys, length } from '../../../utils/javascript'
import { getItem } from '../../../utils/localstorage'
import FiscalYearSelect from '../../common/presentation/FiscalYearSelect'
import createReport from '../container/createReport.container'

const CreateReport = ({ editData }) => {
  const {
    t,
    form,
    modal,
    loader,
    columnList,
    columnFilters,
    equalNotEqual,
    selectedFilters,
    filterDropdownItems,
    viewPreviousHistory,
    flexibleReportData,
    viewHistoryPayload,
    onSaveModalToggle,
    onSaveReport,
    onSelectionChange,
    onEqualNotEqualChange,
    handleDateRangeChange,
    setViewPreviousHistory,
    handleColumnFilterChange,
    onGenerateReport,
    onRemoveDateFilter,
  } = createReport({ editData })

  const lang = getItem('lang')

  return (
    <>
      <div className="d-flex flex-end mb-10">
        <FiscalYearSelect className="ml-auto" setDefault={false} />
      </div>
      <div className="d-flex flex-end gap-8 flex-wrap">
        <ANTDButton
          type="link"
          className="align-self-end"
          onClick={onSaveModalToggle}
        >
          {t('rpt_SaveReport')}
        </ANTDButton>
        <div className="d-flex gap-8">
          <ANTDButton type="primary" onClick={onGenerateReport}>
            {t('dash_GenerateReport')}
          </ANTDButton>
          <ANTDButton
            type="primary"
            onClick={() => setViewPreviousHistory({ open: true })}
          >
            {t('btn_ViewPreviousHistory')}
          </ANTDButton>
        </div>
      </div>

      <div className="d-flex">
        <div className="filter-dropdown-container">
          {filterDropdownItems.map(({ key, type, menuProps, id, ...item }) =>
            type === 'dateRangePicker' ? (
              <div key={key} className="relative">
                <Label text={item.label} />
                <button
                  className="ant-btn remove-btn-icon cursor-pointer"
                  title="remove"
                  type="button"
                  onClick={() => onRemoveDateFilter(key)}
                />
                <ANTDDateRange
                  className
                  format={DISPLAY_DATE_FORMAT}
                  value={selectedFilters[key]}
                  onChange={dates => handleDateRangeChange({ key, dates })}
                />
              </div>
            ) : (
              <FilterDropdown
                key={key}
                {...item}
                filterKey={key}
                equalNotEqual={equalNotEqual?.[key]}
                onEqualNotEqualChange={onEqualNotEqualChange}
                menuProps={{
                  ...menuProps,
                  id,
                  selectedKeys: selectedFilters[key],
                  onSelect: ({ selectedKeys }) => {
                    onSelectionChange({
                      key,
                      selectedKeys,
                      type: 'select',
                    })
                  },
                  onDeselect: ({ selectedKeys }) => {
                    onSelectionChange({
                      key,
                      selectedKeys,
                      type: 'deselect',
                    })
                  },
                }}
              />
            ),
          )}
        </div>
      </div>

      <Label text={t('job_ColumnFilter')} />
      <ANTDSelect
        className="w-100"
        mode="multiple"
        maxTagCount="responsive"
        value={columnFilters}
        options={columnList.map(({ key, title }) => ({
          label: t(title),
          value: key,
        }))}
        onChange={handleColumnFilterChange}
      />

      <ANTDTable
        className="mt-15"
        tableLayout="fixed"
        columns={columnList
          .filter(({ key }) =>
            length(columnFilters) ? include(columnFilters, key) : true,
          )
          ?.map(col => ({ ...col, title: t(col?.title) }))}
        dataSource={
          length(keys(flexibleReportData))
            ? [{ key: 1, ...flexibleReportData }]
            : []
        }
        scroll={{ x: 'max-content' }}
        loading={loader}
        pagination={false}
      />

      <ANTDModal
        open={modal.open}
        title={t('rpt_SaveReport')}
        onCancel={onSaveModalToggle}
        footer={false}
        width={1000}
        centered
        destroyOnClose
      >
        <ANTDForm layout="vertical" form={form} onFinish={onSaveReport}>
          <ANTDFormItem
            name={['name']}
            label={t('rpt_ReportName')}
            className={`m-0 w-100 ${validationTag(lang)}`}
            rules={[{ required: true, message: t('error_FieldISRequire') }]}
          >
            <ANTDInput />
          </ANTDFormItem>
          <ANTDFormItem
            name={['description']}
            label={t('inv_Description')}
            className="m-0 w-100"
          >
            <ANTDTextArea />
          </ANTDFormItem>

          <div className="d-flex justify-center mt-10">
            <ANTDButton type="primary" htmlType="submit" loading={loader}>
              {t('btn_Save')}
            </ANTDButton>
          </div>
        </ANTDForm>
      </ANTDModal>
      <ViewPreviousHistoryModal
        open={viewPreviousHistory.open}
        onClose={() => setViewPreviousHistory({ open: false })}
        payload={viewHistoryPayload}
        hideStartDate
        hideEndDate
      />
    </>
  )
}

export default CreateReport
