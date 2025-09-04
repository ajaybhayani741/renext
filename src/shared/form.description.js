import ANTDButton from './antd/ANTDButton'
import ANTDCheckbox, { ANTDCheckboxGroup } from './antd/ANTDCheckbox'
import { ANTDDatePicker } from './antd/ANTDDatePicker'
import ANTDInput, { ANTDPassword, ANTDTextArea } from './antd/ANTDInput'
import ANTDInputNumber from './antd/ANTDInputNumber'
import { ANTDRadioGroup } from './antd/ANTDRadio'
import ANTDSelect from './antd/ANTDSelect'
import AddressAutocomplete from '../components/common/presentation/AddressAutocomplete'
import FormUpload from '../components/common/presentation/FormUpload'
import UploadImage from '../components/common/presentation/UploadImage'

const getFormInput = ({ inputType }) => {
  switch (inputType) {
    case 'input':
    case 'INPUT':
      return ANTDInput
    case 'password':
      return ANTDPassword
    case 'inputNumber':
    case 'INPUT_NUMBER':
      return ANTDInputNumber
    case 'textArea':
    case 'TEXT_AREA':
      return ANTDTextArea
    case 'select':
      return ANTDSelect
    case 'checkbox':
      return ANTDCheckbox
    case 'checkboxGroup':
    case 'CHECKBOX':
      return ANTDCheckboxGroup
    case 'RADIO_BUTTON':
    case 'TOGGLE_BUTTON':
      return ANTDRadioGroup
    case 'image':
    case 'IMAGE':
      return UploadImage
    case 'dateTimePicker':
      return ANTDDatePicker
    case 'formUpload':
      return FormUpload
    case 'button':
      return ANTDButton
    case 'autoCompleteAddress':
      return AddressAutocomplete

    default:
      return ANTDInput
  }
}
export default getFormInput
