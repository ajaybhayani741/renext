/* eslint-disable import/no-anonymous-default-export */
import { createSlice } from '@reduxjs/toolkit'

import { tabList } from '../../components/dataVisualization/visualization.description'
const firstTab = tabList.at(0)

const initialState = {
  tabDetails: {
    currentTab: firstTab.key,
    currentSubTab: firstTab.subTabList.at(0).key,
  },
  filterDetails: {
    tag: '',
    value: '',
  },
}

const dataVisualization = createSlice({
  name: 'dataVisualization',
  initialState,
  reducers: {
    setTabDetails: (state, action) => {
      state.tabDetails = { ...state.tabDetails, ...action.payload }
    },
    setFilterDetails: (state, action) => {
      state.filterDetails = { ...state.filterDetails, ...action.payload }
    },
  },
})

export const { setTabDetails, setFilterDetails } = dataVisualization.actions

export default dataVisualization.reducer
