import GoogleMapReact from 'google-maps-react-markers'

import EquipmentCardView from './EquipmentCardView'
import FinalProductCardView from './FinalProductCardView'
import mapPin from '../../../assets/map-pin.png'
import ANTDPopover from '../../../shared/antd/ANTDPopover'
import { CloseOutlined } from '../../../utils/icons'
import { isEqual, keys, length, ternary } from '../../../utils/javascript'
import mapView from '../container/mapView'

function MapView() {
  const {
    formData,
    mapProps,
    tabDetails,
    isPopupOpen,
    equipmentDetails,
    handleZoomChange,
    setIsPopupOpen,
    handleClickPin,
  } = mapView()

  return (
    <div>
      <div className="select-option mt-30">
        <div className="map-data-view">
          {mapProps.center.lng && mapProps.center.lat ? (
            <GoogleMapReact
              apiKey={process.env.REACT_APP_MAP_KEY}
              defaultCenter={mapProps.center}
              defaultZoom={4}
              onChange={handleZoomChange}
              options={{ streetViewControl: false, minZoom: 3 }}
            >
              <img
                src="https://icon-library.com/images/pin-icon-png/pin-icon-png-9.jpg"
                alt="location"
                lat={mapProps.center.lat}
                lng={mapProps.center.lng}
                className="current-location"
              />
              {formData?.[mapProps?.addressType]?.filtered?.map(value => {
                return value.latitude && value.longitude ? (
                  <ANTDPopover
                    key={value?.id}
                    content={
                      <div className="data-vis-map">
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: 18,
                          }}
                          className="mb-10"
                        >
                          <h4>{value.name}</h4>
                          <CloseOutlined
                            onClick={() => {
                              setIsPopupOpen({
                                ...isPopupOpen,
                                [value?.id]: false,
                              })
                            }}
                          />
                        </div>
                        <div className="d-flex">
                          <>
                            {ternary(
                              isEqual(tabDetails?.currentSubTab, 'mapScrap'),
                              <EquipmentCardView
                                {...{
                                  currentSelectedType: length(
                                    keys(equipmentDetails?.selected),
                                  )
                                    ? 'txt_Equipment'
                                    : mapProps?.addressType,
                                  viewType: 'map',
                                }}
                              />,
                              <FinalProductCardView />,
                            )}
                          </>
                        </div>
                      </div>
                    }
                    trigger="click"
                    open={isPopupOpen?.[value?.id]}
                    onOpenChange={newOpen =>
                      setIsPopupOpen({ ...isPopupOpen, [value?.id]: newOpen })
                    }
                    lat={value.latitude}
                    lng={value.longitude}
                  >
                    <img
                      src={mapPin}
                      alt="location"
                      lat={value.latitude}
                      lng={value.longitude}
                      className="current-location"
                      onClick={() =>
                        handleClickPin({
                          value,
                        })
                      }
                    />
                  </ANTDPopover>
                ) : null
              })}
            </GoogleMapReact>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default MapView
