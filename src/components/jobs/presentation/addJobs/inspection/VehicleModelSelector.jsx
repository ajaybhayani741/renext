import { useCallback, useEffect, useState } from 'react'

import useTranslations from '../../../../../hooks/useTranslations'
import ANTDDivider from '../../../../../shared/antd/ANTDDivider'
import {
  useFormInstanceFn,
  useWatchFn,
} from '../../../../../shared/antd/ANTDForm'
import ANTDInput from '../../../../../shared/antd/ANTDInput'
import ANTDSelect from '../../../../../shared/antd/ANTDSelect'
import ANTDSpin from '../../../../../shared/antd/ANTDSpin'
import debounce from '../../../../../utils/debounce'
import { isEqual, notEqual } from '../../../../../utils/javascript'
import {
  getVehicleModelListApi,
  searchVehicleModelListApi,
} from '../../../jobs.api'

const VehicleModelSelector = ({ producerId, fieldName, ...restProps }) => {
  const form = useFormInstanceFn()
  // eslint-disable-next-line no-unused-vars
  const selectedOption = useWatchFn(fieldName, form)
  const labelKeyFieldName = [...fieldName?.slice(0, -1), 'modelKey']
  const { t } = useTranslations()
  const [vehicleModelData, setVehicleModelData] = useState({ list: [] })
  const [search, setSearch] = useState('')

  const { list = [], loader } = vehicleModelData || {}
  const PAGE_SIZE = 10

  useEffect(() => {
    if (producerId) {
      getVehicleModelList({})
    }
  }, [producerId])

  const getVehicleModelList = async ({ pageNo = 1, search = '' }) => {
    if (!producerId) return

    setVehicleModelData(prev => ({ ...prev, loader: true }))

    let resp
    const payload = { producerId, pageSize: PAGE_SIZE }
    if (search?.trim()) {
      payload.search = search?.trim()
      resp = await searchVehicleModelListApi({
        params: payload,
        pageNo,
      })
    } else {
      resp = await getVehicleModelListApi({
        params: payload,
        pageNo,
      })
    }

    setVehicleModelData(prev => ({
      ...resp?.data,
      list: [
        ...(notEqual(pageNo, 1) ? prev?.list : []),
        ...(resp?.data?.list || []),
      ],
      loader: false,
    }))
  }

  const debouncedGetVehicleModelList = useCallback(
    debounce(getVehicleModelList, 400),
    [producerId],
  )

  const onInputSearch = async e => {
    const { value } = e?.target
    setSearch(value)

    debouncedGetVehicleModelList({ search: value })
  }

  const onScroll = debounce(e => {
    const { target } = e
    const { pageNo, hasMore } = vehicleModelData || {}
    if (
      hasMore &&
      isEqual(target.scrollHeight - target.scrollTop, target.clientHeight)
    ) {
      getVehicleModelList({ pageNo: pageNo + 1, search })
    }
  }, 300)

  const onSelectChange = (_, option) => {
    form.setFieldValue(labelKeyFieldName, option?.label)
  }

  const modifyForOptions = () => {
    const newList = []
    const isSearchList = search?.trim()
    list?.forEach(({ name, id }) => {
      if (isEqual(selectedOption, id) && !isSearchList) return
      newList.push({
        label: name,
        value: id,
      })
    })

    return selectedOption && !isSearchList
      ? [
          {
            label: form.getFieldValue(labelKeyFieldName),
            value: selectedOption,
          },
          ...newList,
        ]
      : newList
  }

  return (
    <ANTDSelect
      {...restProps}
      filterOption={false}
      options={modifyForOptions()}
      onSelect={onSelectChange} //this will not break 'form' onChange
      onPopupScroll={onScroll}
      dropdownRender={menu => (
        <>
          <div
            style={{
              padding: '5px 4px',
            }}
            className="d-flex"
          >
            <ANTDInput
              disabled={!producerId}
              style={{ marginRight: '8px' }}
              placeholder={t('job_SearchModel')}
              value={search}
              onChange={onInputSearch}
              onKeyDown={e => e.stopPropagation()}
            />
          </div>
          <ANTDDivider
            style={{
              margin: '8px 0',
            }}
          />
          {menu}
          {loader && <ANTDSpin size="small" style={{ paddingLeft: 10 }} />}
        </>
      )}
    />
  )
}

export default VehicleModelSelector
