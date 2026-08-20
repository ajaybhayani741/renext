import { createSlice } from '@reduxjs/toolkit'

import { getItem } from '../../utils/localstorage'

const initialState = {
  view_details: [],
  profile_details: JSON.parse(getItem('userData')),
  mandalDetails: {},
}

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    profileDetails: (state, action) => {
      state.profile_details = action.payload
    },
    setMandalDetails: (state, action) => {
      const { district, mandals } = action.payload
      state.mandalDetails[district] = mandals
    },
  },
})

export const { profileDetails, setMandalDetails } = user.actions

export default user.reducer
