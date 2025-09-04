import { useJsApiLoader } from '@react-google-maps/api'
import { AutoComplete, Input } from 'antd'
import React, { useCallback, useState } from 'react'

import debounce from '../../../utils/debounce'

const libraries = ['places']
const AddressAutocomplete = ({ getAddressData, currentAddress, ...props }) => {
  const [options, setOptions] = useState([])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAP_KEY,
    libraries,
  })

  const handleSearch = useCallback(
    debounce(value => {
      if (!isLoaded || !value) return

      const service = new window.google.maps.places.AutocompleteService()
      service.getPlacePredictions({ input: value }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setOptions(
            predictions.map(prediction => ({
              value: prediction.description,
              label: prediction.description,
              placeId: prediction.place_id,
            })),
          )
        }
      })
    }, 500),
    [isLoaded],
  )

  const fetchPlaceDetails = (value, placeId) => {
    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ placeId }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
        const place = results[0]
        const components = place.address_components
        const geometry = place.geometry

        const getComponent = types =>
          components.find(c => types.some(type => c.types.includes(type)))
            ?.long_name

        const getCity = () => {
          return (
            getComponent(['locality']) ||
            getComponent(['administrative_area_level_3']) ||
            getComponent(['administrative_area_level_2'])
          )
        }

        const details = {
          address: place.formatted_address,
          latitude: geometry.location.lat(),
          longitude: geometry.location.lng(),
          state: getComponent(['administrative_area_level_1']),
          city: getCity(),
          pincode: getComponent(['postal_code']),
          country: components
            .find(c => c.types.includes('country'))
            ?.short_name.toLowerCase(),
        }
        getAddressData({ currentAddress: value, googleAddress: details })
      }
    })
  }

  const handleSelect = (value, option) => {
    fetchPlaceDetails(value, option.placeId)
  }

  return (
    <AutoComplete
      {...props}
      options={options}
      onSearch={handleSearch}
      onSelect={handleSelect}
      onBlur={() => getAddressData({ currentAddress: currentAddress })}
    >
      <Input />
    </AutoComplete>
  )
}

export default AddressAutocomplete
