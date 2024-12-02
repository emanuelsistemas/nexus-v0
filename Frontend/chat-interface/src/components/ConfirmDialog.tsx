import "./ConfirmDialog.css";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3 className={`confirm-title ${type}`}>{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button onClick={onCancel} className="cancel-button">
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`confirm-button ${type}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
