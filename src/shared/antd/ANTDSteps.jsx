import { Steps } from 'antd'
const { Step } = Steps

function ANTDSteps({ ...props }) {
  return <Steps labelPlacement="vertical" {...props} />
}

export default ANTDSteps

function ANTDStep({ ...props }) {
  return <Step {...props} />
}

export { ANTDStep }
