import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalComponent = ({ showModal, handleClose, modalContent }) => {
  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalContent.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalContent.body}</Modal.Body>
      <Modal.Footer>{modalContent.buttons}</Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
