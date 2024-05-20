import React, { useState } from 'react';
import { Button, Modal, Form, Card, Alert } from 'react-bootstrap';
import axios from 'axios';

function SettingsTable({ token }) {
  const [showModal, setShowModal] = useState(false);
  const [activeSetting, setActiveSetting] = useState('');
  const [formValue, setFormValue] = useState('');
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const openModal = (setting) => {
    setActiveSetting(setting);
    setShowModal(true);
    setError('');
    setDeleteConfirm('');
  };

  const closeModal = () => {
    setShowModal(false);
    setFormValue('');
    setError('');
    setDeleteConfirm('');
  };

  const handleChange = (e) => {
    setFormValue(e.target.value);
    setError('');
  };

  const handleDeleteChange = (e) => {
    setDeleteConfirm(e.target.value);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (activeSetting === 'email' && !validateEmail(formValue)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (activeSetting === 'delete' && deleteConfirm.toLowerCase() !== 'yes') {
      setError('You must type "Yes" to confirm deletion.');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    try {
      const response = await axios.post(`http://localhost:5000/api/menu/settings/`, {
        setting_type: activeSetting,
        value: formValue
      }, config);
      alert(response.data.success);
      closeModal();
    } catch (error) {
      alert('Error updating setting: ' + error.response.data.error);
    }
  };

  return (
    <div>
      <Card className="text-center bg-light" style={{ borderColor: '#ccc' }}>
        <Card.Body>
          <h4 className="mb-4">User Settings</h4>
          <Button variant="outline-secondary" className="m-2" onClick={() => openModal('username')}>Change Username</Button>
          <Button variant="outline-secondary" className="m-2" onClick={() => openModal('email')}>Change Email</Button>
          <Button variant="outline-secondary" className="m-2" onClick={() => openModal('password')}>Change Password</Button>
          <Button variant="outline-danger" className="m-2" onClick={() => openModal('delete')}>Delete Account</Button>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update {activeSetting}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            {activeSetting === 'delete' ? (
              <>
                <Form.Text>Please type "Yes" to confirm deletion:</Form.Text>
                <Form.Control 
                  type="text" 
                  value={deleteConfirm} 
                  onChange={handleDeleteChange} 
                  required
                  aria-label="delete-confirm-input"
                />
              </>
            ) : (
              <Form.Group>
                <Form.Label htmlFor="form-input">New {activeSetting}</Form.Label>
                <Form.Control 
                  id="form-input"
                  type="text" 
                  value={formValue} 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
            )}
            <Button variant="primary" type="submit">Save Changes</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default SettingsTable;
