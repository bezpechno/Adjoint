// src/components/Modal.js
import React from 'react';
import './Modal.css'; // Убедитесь, что CSS для модального окна подключен

const Modal = ({ message, onClose }) => (
  <div className="modal-error">
    <div className="modal-content-error">
      <p>{message}</p>
      <button onClick={onClose}>Go to Login</button>
    </div>
  </div>
);

export default Modal;
