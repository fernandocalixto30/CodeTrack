import './style.css';

const ModalConfirmacao = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <p>Tem certeza que deseja excluir este cliente?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-confirm">Sim</button>
          <button onClick={onCancel} className="btn-cancel">Não</button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;
