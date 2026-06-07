import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const BackButton = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
  <Button
    icon={<ArrowLeftOutlined />}
    onClick={onClick}
    type="text"
    className={`font-medium text-slate-500 hover:!text-slate-800 ${className}`}
  >
    Back
  </Button>
);

export default BackButton;
