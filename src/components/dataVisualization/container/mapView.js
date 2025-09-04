import { useEffect, useState } from 'react'

import equipmentView from './equipmentView'
import useRedux from '../../../hooks/useRedux'
import { keys } from '../../../utils/javascript'

const mapView = () => {
  const [mapProps, setMapProps] = useState({
    center: { lat: '', lng: '' },
    zoom: 4,
    zoomDetail: {},
    addressType: 'txt_Country',
  })
  const { selector } = useRedux()
  const tabDetails = selector(state => state.dataVisualization.tabDetails)
  const [equipmentDetails, setEquipmentDetails] = useState({
    isOpen: false,
    data: {},
    selected: {},
  })
  const [isPopupOpen, setIsPopupOpen] = useState({})

  const {
    formData,
    setFormData,
    // getData,
  } = equipmentView()

  useEffect(() => {
    if (
      navigator.geolocation &&
      (!mapProps?.center?.lat || !mapProps?.center?.lng)
    ) {
      navigator.geolocation.getCurrentPosition(position => {
        setMapProps({
          ...mapProps,
          center: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      })
    }
  }, [])

  const handleZoomChange = async zoom => {
    if (!zoom?.bounds) return

    // const ne = zoom.bounds.getNorthEast()
    // const sw = zoom.bounds.getSouthWest()
    // const boundary = {
    //   latFrom: sw?.lat(),
    //   latTo: ne?.lat(),
    //   lngFrom: sw?.lng(),
    //   lngTo: ne?.lng(),
    // }
    const country = 3
    const state = 6
    const city = 9
    const pincode = 11
    const building = 14

    const zoomLevels = [country, state, city, pincode, building]
    const addressTypes = keys(formData)

    let addressType = 'txt_Country'
    // let nextTypeTag = 'txt_Country'

    zoomLevels.forEach((threshold, index) => {
      if (zoom.zoom >= threshold) {
        addressType = addressTypes[index]
        // nextTypeTag = addressTypes[index]
      }
    })

    setMapProps({
      ...mapProps,
      zoom: zoom.zoom,
      zoomDetail: zoom,
      addressType: addressType,
    })

    // getData({
    //   currentType: nextTypeTag,
    //   boundary,
    //   notStateCityList: false,
    // })
  }

  const handleClickPin = ({ value, addressType }) => {
    const currentType = addressType || mapProps?.addressType
    if (!addressType) {
      setEquipmentDetails({ isOpen: false, data: {}, selected: {} })
      setFormData(prev => {
        let updatedState = { ...prev }
        updatedState[currentType].selected = {}
        return updatedState
      })
    }
    setFormData(prev => {
      let updatedState = { ...prev }
      updatedState[currentType].selected = value
      return updatedState
    })
  }

  return {
    mapProps,
    formData,
    tabDetails,
    isPopupOpen,
    equipmentDetails,
    setIsPopupOpen,
    handleZoomChange,
    handleClickPin,
  }
}

export default mapView
