import { Input } from 'antd'

function ANTDInput({ ...props }) {
  return <Input {...props} />
}

export default ANTDInput

function ANTDPassword({ autoComplete, ...props }) {
  return <Input.Password {...props} autoComplete={autoComplete || 'on'} />
}

function ANTDSearch({ ...props }) {
  const { Search } = Input
  return <Search {...props} enterButton />
}
function ANTDTextArea({ ...props }) {
  const { TextArea } = Input
  return <TextArea {...props} />
}

export { ANTDPassword, ANTDSearch, ANTDTextArea }
