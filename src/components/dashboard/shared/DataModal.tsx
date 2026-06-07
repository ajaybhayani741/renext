import { Modal, Table, Button, Space } from "antd";
import { DownloadOutlined, FilePdfOutlined, FileExcelOutlined } from "@ant-design/icons";

interface DataModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  columns: any[];
  data: any[];
}

const DataModal = ({ open, onClose, title, columns, data }: DataModalProps) => {
  return (
    <Modal
      title={<span className="text-lg font-semibold">{title}</span>}
      open={open}
      onCancel={onClose}
      width={900}
      footer={
        <Space>
          <Button icon={<FilePdfOutlined />} type="primary" style={{ background: "#1D5BE0" }}>Download PDF</Button>
          <Button icon={<FileExcelOutlined />} style={{ color: "#1D5BE0", borderColor: "#1D5BE0" }}>
            <span className="flex items-center gap-1"><DownloadOutlined /> Download Excel</span>
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        pagination={{ pageSize: 8 }}
        scroll={{ x: 700 }}
        className="mt-4"
      />
    </Modal>
  );
};

export default DataModal;
