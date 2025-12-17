import useRouter from '../../../hooks/useRouter'
import pathName from '../../../routing/pathName.constant'
import { photosDashboardData } from '../dashboard.description'

const photos = () => {
  const { navigate } = useRouter()

  const handlePhotosCardClick = item => {
    const photoKey = photosDashboardData[item]?.key
    if (photoKey) {
      navigate(pathName.PHOTO_DASHBOARD.replace(':photoType', photoKey))
    }
  }

  return { handlePhotosCardClick }
}

export default photos
