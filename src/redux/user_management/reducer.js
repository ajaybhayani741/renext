import { createSlice } from '@reduxjs/toolkit'

import { getItem } from '../../utils/localstorage'

const initialState = {
  view_details: [],
  profile_details: JSON.parse(getItem('userData')),
}

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    profileDetails: (state, action) => {
      state.profile_details = action.payload
    },
  },
})

export const { profileDetails } = user.actions

export default user.reducer
