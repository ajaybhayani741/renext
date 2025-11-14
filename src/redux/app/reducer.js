import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isDesktop: true,
  isMobile: false,
  fiscalYear: {
    value: null,
    options: [],
    dateRange: { from: null, to: null, min: null, max: null },
  },
  popUpMsgModel: { open: false, message: '' },
  store: {
    list: [],
    selected: null,
  },
  shift: {
    shiftType: null,
    shiftId: null,
  },
  notificationsList: [],
}

const appReducer = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setDeviceStatus: (state, action) => {
      state.isDesktop = action.payload
    },
    setMobileStatus: (state, action) => {
      state.isMobile = action.payload
    },
    setFiscalYear: (state, action) => {
      state.fiscalYear = { ...state?.fiscalYear, ...action?.payload }
    },
    setPopupMessageModel: (state, action) => {
      state.popUpMsgModel = action.payload
    },
    setStoreDetails: (state, action) => {
      state.store = { ...state?.store, ...action?.payload }
    },
    setShiftDetails: (state, action) => {
      state.shift = { ...state?.shift, ...action?.payload }
    },
    setNotificationList: (state, action) => {
      state.notificationsList = action?.payload
    },
  },
})

export const {
  setDeviceStatus,
  setMobileStatus,
  setFiscalYear,
  setPopupMessageModel,
  setStoreDetails,
  setShiftDetails,
  setNotificationList,
} = appReducer.actions

export default appReducer.reducer
