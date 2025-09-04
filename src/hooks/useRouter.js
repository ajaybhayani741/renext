import { useLocation, useNavigate, useParams } from 'react-router-dom'

const useRouter = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const queryParams = new URLSearchParams(window.location.search)

  return {
    location,
    navigate,
    params,
    queryParams,
  }
}

export default useRouter
