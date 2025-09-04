import { Layout } from 'antd'

const { Header, Content, Footer, Sider } = Layout

function ANTDLayout({ ...props }) {
  return <Layout {...props} />
}

function ANTDHeader({ ...props }) {
  return <Header {...props} />
}
function ANTDContent({ ...props }) {
  return <Content {...props} />
}
function ANTDFooter({ ...props }) {
  return <Footer {...props} />
}
function ANTDSider({ ...props }) {
  return <Sider {...props} />
}

export default ANTDLayout
export { ANTDContent, ANTDFooter, ANTDHeader, ANTDSider }
