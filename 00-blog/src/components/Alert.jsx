export default function Alert({ message, onClose, onConfirm }) {
  return (
    <div className="modal-background" onClick={onClose}>
      <div className="alert">
        <div className="page-title">
          <p>알림</p>
          <button className="btn-box-wh" onClick={onClose}>X</button>
        </div>
        <p className='msg-container'>{message}</p>
        <div className='btn-container'>
          { onConfirm && <button onClick={onConfirm}>확인</button> }
          <button onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  )
}