import { Modal, QRCode } from "antd";

interface QrCodeModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  title?: string;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({
  open,
  onClose,
  url,
  title,
}) => {
  return (
    <Modal width={"auto"} open={open} onCancel={onClose} footer={null} centered>
      {title && <h3 className="mb-4">{title}</h3>}
      <QRCode value={url} size={200} />
    </Modal>
  );
};
export default QrCodeModal;
