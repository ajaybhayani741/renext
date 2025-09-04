import { useEffect, useState } from 'react'

import useRedux from '../../../hooks/useRedux'
import { setFilterDetails } from '../../../redux/dataVisualization/reducer'
import {
  isEqual,
  keys,
  length,
  notEqual,
  ternary,
} from '../../../utils/javascript'
import {
  buildingList,
  cityList,
  equipmentInitial,
  pincodeList,
} from '../visualization.description'

const equipmentView = () => {
  const equipment = JSON.parse(JSON.stringify(equipmentInitial))
  const [formData, setFormData] = useState(equipment)
  const lastColumn = keys(formData)?.[length(keys(formData)) - 1]
  const [currentSelectedType, setCurrentSelectedType] = useState('')
  const { selector, dispatch } = useRedux()
  const { tabDetails, filterDetails } = selector(
    state => state?.dataVisualization,
  )
  const { currentTab, currentSubTab } = tabDetails
  const { value: filterValue, isClear } = filterDetails

  useEffect(() => {
    setFormData(equipment)
    setCurrentSelectedType('')
  }, [currentTab, currentSubTab])

  useEffect(() => {
    if (filterValue || isClear) {
      handleClear({
        currentType: 'txt_Country',
        index: 0,
      })
      if (isClear) {
        dispatch(setFilterDetails({ tag: null, value: null, isClear: false }))
      }
    }
  }, [filterValue])

  const getData = async ({
    currentType,
    selected,
    nextTypeTag,
    updatedForm,
  }) => {
    const cloneFormData = updatedForm || formData
    const findIndex = keys(cloneFormData)?.findIndex(v =>
      isEqual(v, currentType),
    )
    const nextType =
      nextTypeTag ||
      keys(cloneFormData)?.[
        findIndex + ternary(notEqual(currentTab, 'mapView'), 1, 0)
      ]

    let tempForm = { ...cloneFormData }
    if (selected) {
      tempForm[currentType].selected = selected
    }

    if (notEqual(currentType, lastColumn)) {
      const dummyData = {
        user_City: cityList,
        user_Pincode: pincodeList,
        user_Site: buildingList,
      }

      setData({
        tempForm,
        response: {
          list: dummyData[nextType][
            tempForm[currentType].selected?.id
          ] /* || response?.data?.list  */,
        },
        findIndex,
        nextTypeTag,
      })
    }
    setFormData(tempForm)
  }

  const setData = ({ tempForm, response, findIndex, nextTypeTag }) => {
    Object.entries(formData)?.forEach(([key, value], index) => {
      if (isEqual(nextTypeTag, 'txt_Country')) {
        tempForm['txt_Country'] = {
          selected: null,
          search: null,
          list: response?.list || [],
          filtered: response?.list || [],
        }
      } else if (
        ternary(
          notEqual(currentTab, 'mapView'),
          isEqual(index, findIndex + 1),
          isEqual(index, findIndex),
        )
      ) {
        tempForm[key] = {
          selected: null,
          search: null,
          list: response?.list || [],
          filtered: response?.list || [],
        }
      } else if (index > findIndex + 1) {
        tempForm[key] = {
          selected: null,
          search: null,
          list: [],
          filtered: [],
        }
      }
    })
  }

  const handleSelect = async ({ value, name, isClear }) => {
    setCurrentSelectedType(name)
    const checkField = isEqual(name, 'txt_Country') ? 'name' : 'id'
    if (
      notEqual(formData?.[name]?.selected?.[checkField], value?.[checkField]) ||
      isClear
    ) {
      getData({ currentType: name, selected: value })
    }
  }

  const handleClear = async ({ currentType, index, previousType }) => {
    let tempForm = { ...formData }
    tempForm[currentType].selected = null
    setData({ tempForm, findIndex: index })
    setFormData(tempForm)

    if (previousType) {
      handleSelect({
        value: tempForm?.[previousType]?.selected,
        name: previousType,
        isClear: true,
      })
    }

    if (isEqual(currentType, 'txt_Country')) {
      getData({
        currentType: 'txt_Country',
        nextTypeTag: 'txt_Country',
        updatedForm: tempForm,
      })
    }
  }

  const handleSearch = ({ e, name }) => {
    const { value } = e.target
    setFormData(preFormData => {
      const tempForm = { ...preFormData }
      tempForm[name].search = value
      const list = length(tempForm[name]?.list)
        ? tempForm[name]?.list.filter(v =>
            v?.name.toLowerCase().includes(value.toLowerCase()),
          )
        : []
      tempForm[name].filtered = list
      return tempForm
    })
  }

  return {
    formData,
    currentTab,
    currentSelectedType,
    setFormData,
    getData,
    handleSelect,
    handleClear,
    handleSearch,
  }
}

export default equipmentView
