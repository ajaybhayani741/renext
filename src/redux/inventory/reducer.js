import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeTab: {},
}

const inventoryReducer = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setVehicleActiveTab: (state, action) => {
      state.activeTab = { ...state.activeTab, ...action.payload }
    },
  },
})

export const { setVehicleActiveTab } = inventoryReducer.actions

export default inventoryReducer.reducer
