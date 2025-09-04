import useRedux from '../../../hooks/useRedux'
import {
  setFilterDetails,
  setTabDetails,
} from '../../../redux/dataVisualization/reducer'
import { isEqual } from '../../../utils/javascript'
import { tabList } from '../visualization.description'

const visualizationTab = () => {
  const { dispatch } = useRedux()

  const handleTabChange = value => {
    dispatch(
      setTabDetails({
        currentTab: value,
        currentSubTab: tabList
          .find(({ key }) => isEqual(key, value))
          ?.subTabList?.at(0)?.key,
      }),
    )
    dispatch(setFilterDetails({ tag: '', value: '' }))
  }
  const handleSubTabChange = value => {
    dispatch(setFilterDetails({ tag: '', value: '' }))

    dispatch(
      setTabDetails({
        currentSubTab: value,
      }),
    )
  }

  return { handleTabChange, handleSubTabChange }
}

export default visualizationTab
