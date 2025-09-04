import { useDispatch, useSelector } from 'react-redux'

const useRedux = () => {
  const dispatch = useDispatch()
  const selector = params => useSelector(params)
  return { dispatch, selector }
}

export default useRedux
