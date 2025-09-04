import { createSlice } from '@reduxjs/toolkit'

import { initialErrorCode } from '../../components/jobs/jobs.description'

const initialState = {
  activeTab: {},
  equipment: {
    userEinId: null,
    equipmentIdentificationNumberFreeText: null,
  },
  errorCode: initialErrorCode,
}

const jobsReducer = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobActiveTab: (state, action) => {
      state.activeTab = { ...state.activeTab, ...action.payload }
    },
    setEquipmentData: (state, action) => {
      state.equipment = { ...state.equipment, ...action.payload }
    },
    setErrorCodeData: (state, action) => {
      state.errorCode = { ...state.errorCode, ...action.payload }
    },
  },
})

export const { setJobActiveTab, setEquipmentData, setErrorCodeData } =
  jobsReducer.actions

export default jobsReducer.reducer
