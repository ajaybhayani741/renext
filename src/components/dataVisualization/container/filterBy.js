import { useState } from 'react'

import {
  equipmentFilterByOptions,
  feFilterByOptions,
  filterByTypes,
} from '../visualization.description'

const filterBy = ({ t, type }) => {
  const [filterTag, setFilterTag] = useState({
    tag: null,
    value: null,
    isClear: false,
  })

  const { equipment, fieldEngineer } = filterByTypes

  const getFilterByTagList = () => {
    switch (type) {
      case equipment:
        return equipmentFilterByOptions(t)
      case fieldEngineer:
        return feFilterByOptions(t)
      default:
        return equipmentFilterByOptions(t)
    }
  }

  const handleFilterBy = () => {
    setFilterTag(filterTag)
  }

  return {
    filterTag,
    handleFilterBy,
    getFilterByTagList,
  }
}

export default filterBy
