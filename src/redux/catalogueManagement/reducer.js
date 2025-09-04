import { SET_SELECTED } from './types'
import { initialCatalogueSelect } from '../../components/catalogueManagement/catalogue.description'

const initialState = {
  selected: initialCatalogueSelect,
}

const catalogueReducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_SELECTED:
      return {
        ...state,
        selected: { ...state?.selected, ...payload },
      }

    default:
      return state
  }
}

export default catalogueReducer
