import { useState } from 'react'

import useTranslations from '../../../../hooks/useTranslations'
import ANTDColumn from '../../../../shared/antd/ANTDColumn'
import { ANTDFormItem } from '../../../../shared/antd/ANTDForm'
import { ANTDTextArea } from '../../../../shared/antd/ANTDInput'
import ANTDRow from '../../../../shared/antd/ANTDRow'
import ANTDSelect from '../../../../shared/antd/ANTDSelect'
import {
  entries,
  include,
  isEqual,
  keys,
  notEqual,
} from '../../../../utils/javascript'
import {
  cityOptions,
  countryData,
  countryOptions,
  pincodeOptions,
  stateOptions,
} from '../../../userManagement/addressData'

const AddressSelector = ({ form, parentKey }) => {
  const { t } = useTranslations()
  const addressSelector = {
    pincode: {
      label: 'user_Pincode',
      options: pincodeOptions,
      className: 'show-clear-icon',
      allowClear: true,
    },
    country: {
      label: 'txt_Country',
      disabled: true,
      options: countryOptions,
    },
    state: {
      label: 'user_State',
      options: stateOptions,
    },
    city: {
      label: 'user_City',
      options: cityOptions,
    },
  }
  const [addressAttr, setAddressAttr] = useState(addressSelector)

  const handleOnChange = e => {
    const currentKey = keys(e).at(0)
    const data = form.getFieldsValue()
    const formData = data[parentKey]
    let tempAddressAttr = { ...addressAttr }
    if (isEqual(currentKey, 'pincode') && !e?.pincode) {
      formData.city = null
      formData.state = null
      formData.country = null
      tempAddressAttr = {
        ...tempAddressAttr,
        pincode: {
          ...tempAddressAttr?.pincode,
          options: pincodeOptions,
        },
        city: {
          ...tempAddressAttr?.city,
          options: cityOptions,
        },
        state: {
          ...tempAddressAttr?.state,
          options: stateOptions,
        },
      }
    }
    if (e?.pincode) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) =>
          entries(cityObj).some(([cityKey, pinArr]) => {
            if (!include(pinArr, e.pincode)) return false
            if (!formData.country) {
              formData.country = countryKey
            }
            if (!formData.state) {
              formData.state = stateKey
              tempAddressAttr.state = {
                ...tempAddressAttr.state,
                options: keys(stateObj)?.map(v => ({
                  label: v,
                  value: v,
                })),
              }
            }
            if (!formData.city) {
              formData.city = cityKey
              tempAddressAttr.city = {
                ...tempAddressAttr.city,
                options: keys(cityObj)?.map(v => ({
                  label: v,
                  value: v,
                })),
              }
            }

            tempAddressAttr.pincode = {
              ...tempAddressAttr.pincode,
              options: pinArr?.map(v => ({
                label: v,
                value: v,
              })),
            }
            return true
          }),
        ),
      )
    }
    if (e?.state) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) => {
          if (notEqual(stateKey, e?.state)) return false
          if (!formData.country) {
            formData.country = countryKey
          }
          formData.state = stateKey
          const stateOpt = keys(stateObj)?.map(v => ({
            label: v,
            value: v,
          }))
          const cityOpt = keys(cityObj)?.map(v => ({
            label: v,
            value: v,
          }))
          formData.city = cityOpt?.at(0)?.value
          const pincodeOpt = cityObj?.[formData.city]?.map(pin => ({
            label: pin,
            value: pin,
          }))
          formData.pincode = pincodeOpt?.at(0)?.value

          tempAddressAttr = {
            ...tempAddressAttr,
            state: {
              ...tempAddressAttr.state,
              options: stateOpt,
            },
            city: {
              ...tempAddressAttr.city,
              options: cityOpt,
            },
            pincode: {
              ...tempAddressAttr.pincode,
              options: pincodeOpt,
            },
          }
          return true
        }),
      )
    }
    if (e?.city) {
      entries(countryData).some(([countryKey, stateObj]) =>
        entries(stateObj).some(([stateKey, cityObj]) =>
          entries(cityObj).some(([cityKey, pinArr]) => {
            if (notEqual(cityKey, e?.city)) return false
            if (!formData.country) {
              formData.country = countryKey
            }
            if (!formData.state) {
              formData.state = stateKey
              tempAddressAttr.state = {
                ...tempAddressAttr.state,
                options: keys(stateObj)?.map(v => ({
                  label: v,
                  value: v,
                })),
              }
            }
            formData.city = cityKey
            tempAddressAttr.city = {
              ...tempAddressAttr.city,
              options: keys(cityObj)?.map(v => ({
                label: v,
                value: v,
              })),
            }
            const pincodeOpt = pinArr?.map(pin => ({
              label: pin,
              value: pin,
            }))
            formData.pincode = pincodeOpt.at(0)?.value
            tempAddressAttr.pincode = {
              ...tempAddressAttr.pincode,
              options: pincodeOpt,
            }
            return true
          }),
        ),
      )
    }
    if (e?.country) {
      entries(countryData).some(([countryKey, stateObj]) => {
        if (notEqual(countryKey, e?.country)) return false
        formData.country = countryKey
        const stateOpt = keys(stateObj)?.map(v => ({
          label: v,
          value: v,
        }))
        formData.state = stateOpt?.at(0)?.value
        const cityOpt = keys(stateObj?.[formData?.state])?.map(v => ({
          label: v,
          value: v,
        }))
        formData.city = cityOpt?.at(0)?.value
        const pincodeOpt = stateObj?.[formData?.state]?.[formData?.city]?.map(
          pin => ({
            label: pin,
            value: pin,
          }),
        )
        formData.pincode = pincodeOpt?.at(0)?.value
        tempAddressAttr = {
          ...tempAddressAttr,
          state: {
            ...tempAddressAttr.state,
            options: stateOpt,
          },
          city: {
            ...tempAddressAttr.city,
            options: cityOpt,
          },
          pincode: {
            ...tempAddressAttr.pincode,
            options: pincodeOpt,
          },
        }
        return true
      })
    }
    setAddressAttr(tempAddressAttr)
    form.setFieldValue(parentKey, formData)
  }

  return (
    <div className="w-100">
      <ANTDRow gutter={8}>
        {entries(addressAttr).map(([key, { inputType, ...attr }]) => {
          return (
            <ANTDColumn key={key} xs={6}>
              <ANTDFormItem
                validateTrigger="onChange"
                label={t(attr?.label)}
                name={[parentKey, key]}
              >
                <ANTDSelect
                  {...attr}
                  onChange={value => handleOnChange({ [key]: value })}
                />
              </ANTDFormItem>
            </ANTDColumn>
          )
        })}
      </ANTDRow>
      <ANTDRow className="mt-20">
        <ANTDColumn xs={24}>
          <ANTDFormItem
            name={[parentKey, 'address']}
            validateTrigger="onChange"
            label={t('user_Address')}
          >
            <ANTDTextArea />
          </ANTDFormItem>
        </ANTDColumn>
      </ANTDRow>
    </div>
  )
}

export default AddressSelector
