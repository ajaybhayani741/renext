import { Form } from 'antd'
import React from 'react'

const useFormFn = () => {
  const [form] = Form.useForm()
  return form
}

const useWatchFn = (...arg) => Form.useWatch(...arg)
const useFormInstanceFn = () => Form.useFormInstance()

function ANTDForm({ ...props }) {
  return <Form {...props} />
}

export default ANTDForm

function ANTDFormItem({ ...props }) {
  return <Form.Item {...props} />
}

function ANTDFormList({ ...props }) {
  return <Form.List {...props} />
}

export { ANTDFormItem, ANTDFormList, useFormFn, useWatchFn, useFormInstanceFn }
