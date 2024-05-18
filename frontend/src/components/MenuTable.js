import React, { useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import ModalComponent from './ModalComponent';
import useApiData from './useApiData';
import './custom.css';
import axios from 'axios';

function MenuTable({ token }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [rows, setRows] = useState([{ name: '', details: '', price: '', allergens: {}, photo: '', status: 'active' }]);
  const [editIndex, setEditIndex] = useState(null);
  const [photoError, setPhotoError] = useState(null); // New state for photo URL error

  const { data: existingRows, isLoading, error, setData: setExistingRows, setLoading, setApiError } = useApiData(token);
  const allergensList = [
    'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soybeans',
    'Milk', 'Nuts', 'Celery', 'Mustard', 'Sesame', 'Sulphites', 'Lupin', 'Molluscs'
  ];

  const handleClose = () => setShowModal(false);
  const handleShow = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleRemoveClick = index => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleAddClick = () => {
    setRows([...rows, { name: '', details: '', price: '', allergens: {}, photo: '', status: 'active' }]);
  };

  const handleSubmit = async () => {
    if (photoError) {
      alert('Please fix the errors before submitting.');
      return;
    }

    if (editIndex !== null && editIndex >= 0) {
      const itemToUpdate = { ...existingRows[editIndex] };

      if (!itemToUpdate._id || !itemToUpdate._id.$oid) {
        console.error('Invalid ID for the item to be updated');
        return;
      }

      try {
        const response = await axios.put(`http://localhost:5000/api/menu/`, itemToUpdate, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Data updated:', response.data);
        refreshData();
        setEditIndex(null);
      } catch (err) {
        console.error('Error during update:', err);
        setApiError(err.message || 'Unknown error during update');
      }
    }

    const newRowsToSubmit = rows.filter(row => row.name.trim() !== '');
    if (newRowsToSubmit.length > 0) {
      try {
        const response = await axios.post('http://localhost:5000/api/menu/', newRowsToSubmit, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('New data submitted:', response.data);
        refreshData();
        setRows([{ name: '', details: '', price: '', allergens: {}, photo: '', status: 'active' }]);
      } catch (err) {
        console.error('Error during submission of new data:', err);
        setApiError(err.message || 'Unknown error during submission of new data');
      }
    }

    if (editIndex === null && newRowsToSubmit.length === 0) {
      refreshData();
    }
  };

  const refreshData = useCallback(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/menu/', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(response => {
        const menu = JSON.parse(response.data.menu);
        setExistingRows(menu.map(item => ({ ...item, _id: item._id })));
        setLoading(false);
      })
      .catch(err => {
        setApiError('Failed to fetch menu data: ' + err.message);
        setLoading(false);
      });
  }, [token, setLoading, setApiError, setExistingRows]);

  const handleDelete = async (_id) => {
    setLoading(true);
    try {
      const response = await axios.delete('http://localhost:5000/api/menu/', {
        data: _id,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        refreshData();
        setShowModal(false);
      } else {
        throw new Error('Deletion was not successful');
      }
    } catch (err) {
      console.error('Error during deletion:', err);
      setApiError(`Failed to delete item with _id ${_id}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    switch (value) {
      case 'edit':
        setEditIndex(index);
        break;
      case 'delete':
        if (existingRows[index] && existingRows[index]._id && existingRows[index]._id.$oid) {
          handleShow({
            title: 'Confirm Delete',
            body: 'Are you sure you want to delete this item?',
            buttons: (
              <>
                <Button variant="secondary" onClick={handleClose}>No</Button>
                <Button variant="danger" onClick={() => handleDelete(existingRows[index]._id.$oid)}>Delete</Button>
              </>
            ),
          });
        } else {
          console.error('Attempted to delete an item without a valid _id');
        }
        break;
      case 'disable':
        if (existingRows[index] && existingRows[index]._id && existingRows[index]._id.$oid) {
          handleShow({
            title: 'Change Status',
            body: 'Do you want to activate or disable this item?',
            buttons: (
              <>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={() => handleChangeStatus(existingRows[index]._id.$oid, 'active')}>Activate</Button>
                <Button variant="primary" onClick={() => handleChangeStatus(existingRows[index]._id.$oid, 'disabled')}>Disable</Button>
              </>
            ),
          });
        } else {
          console.error('Attempted to change status of an item without a valid _id');
        }
        break;
      default:
        setEditIndex(null);
        break;
    }
  };

  const handleInputChange = useCallback((e, index) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      // Validate URL
      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

      if (!urlPattern.test(value)) {
        setPhotoError('Invalid URL');
      } else {
        setPhotoError(null);
      }
    }

    setExistingRows(currentRows => {
      const updatedRows = [...currentRows];
      updatedRows[index] = { ...updatedRows[index], [name]: value };
      return updatedRows;
    });
  }, [setExistingRows]);

  const handleChangeStatus = async (_id, newStatus) => {
    setLoading(true);
    try {
      const updatedItem = { _id, status: newStatus };
      const response = await axios.put('http://localhost:5000/api/menu/', updatedItem, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        refreshData();
        setShowModal(false);
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      setApiError(`Failed to update status for item with _id ${_id}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAllergenChange = useCallback((index, allergen, isChecked) => {
    setExistingRows(currentRows => {
      const updatedRows = [...currentRows];
      const updatedAllergens = updatedRows[index].allergens
        ? { ...updatedRows[index].allergens, [allergen]: isChecked }
        : { [allergen]: isChecked };
      updatedRows[index] = { ...updatedRows[index], allergens: updatedAllergens };
      return updatedRows;
    });
  }, [setExistingRows]);

  const handleNewAllergenChange = (index, allergen, isChecked) => {
    setRows(currentRows => {
      const updatedRows = [...currentRows];
      const updatedAllergens = updatedRows[index].allergens
        ? { ...updatedRows[index].allergens, [allergen]: isChecked }
        : { [allergen]: isChecked };
      updatedRows[index] = { ...updatedRows[index], allergens: updatedAllergens };
      return updatedRows;
    });
  };

  const AllergenCheckboxes = ({ index, allergens, isNew }) => {
    const changeHandler = isNew ? handleNewAllergenChange : handleAllergenChange;
    return (
      <div>
        {allergensList.map(allergen => (
          <div key={allergen}>
            <input
              type="checkbox"
              checked={allergens && allergens[allergen]}
              onChange={e => changeHandler(index, allergen, e.target.checked)}
            /> {allergen}
          </div>
        ))}
      </div>
    );
  };

  const handleNewRowInputChange = useCallback((e, index) => {
    const { name, value } = e.target;

    if (name === 'photo') {
      // Validate URL
      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

      if (!urlPattern.test(value)) {
        setPhotoError('Invalid URL');
      } else {
        setPhotoError(null);
      }
    }

    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [name]: value };
    setRows(updatedRows);
  }, [rows, setRows]);

  return (
    <div className="table-responsive-sm">
      <table className="table table-striped table-sm custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Details</th>
            <th>Price</th>
            <th>Allergens</th>
            <th>Photo</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {existingRows.map((x, i) => (
            <tr key={`existing-${i}`}>
              <td>
                {editIndex === i ? (
                  <input name="name" value={x.name} onChange={e => handleInputChange(e, i)} />
                ) : (
                  x.name
                )}
              </td>
              <td>
                {editIndex === i ? (
                  <input name="details" value={x.details} onChange={e => handleInputChange(e, i)} />
                ) : (
                  x.details
                )}
              </td>
              <td>
                {editIndex === i ? (
                  <input type="number" name="price" value={x.price} onChange={e => handleInputChange(e, i)} />
                ) : (
                  x.price
                )}
              </td>
              <td>
                {editIndex === i ? (
                  <AllergenCheckboxes index={i} allergens={x.allergens || {}} isNew={false} />
                ) : (
                  Object.keys(x.allergens).filter(key => x.allergens[key]).join(', ')
                )}
              </td>
              <td>
                {editIndex === i ? (
                  <input name="photo" value={x.photo} onChange={e => handleInputChange(e, i)} />
                ) : (
                  x.photo
                )}
              </td>
              <td>{x.status}</td>
              <td>
                <select name="action" onChange={e => handleChange(e, i)}>
                  <option value="">Select...</option>
                  <option value="edit">Edit</option>
                  <option value="delete">Delete</option>
                  <option value="disable">Disable</option>
                </select>
              </td>
            </tr>
          ))}
          {rows.map((x, i) => (
            <tr key={`new-${i}`}>
              <td><input name="name" value={x.name} onChange={e => handleNewRowInputChange(e, i)} /></td>
              <td><input name="details" value={x.details} onChange={e => handleNewRowInputChange(e, i)} /></td>
              <td><input type="number" name="price" value={x.price} onChange={e => handleNewRowInputChange(e, i)} step="0.01" /></td>
              <td><AllergenCheckboxes index={i} allergens={x.allergens || {}} isNew={true} /></td>
              <td><input name="photo" value={x.photo} onChange={e => handleNewRowInputChange(e, i)} /></td>
              <td>New</td>
              <td>
                {rows.length !== 1 && <Button onClick={() => handleRemoveClick(i)} variant="secondary">Remove</Button>}
                {rows.length - 1 === i && <Button onClick={handleAddClick} variant="primary">Add</Button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        {photoError && <div style={{ color: 'red' }}>{photoError}</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <Button onClick={handleSubmit} variant="success">Submit</Button>
      </div>
      <ModalComponent showModal={showModal} handleClose={handleClose} modalContent={modalContent} />
    </div>
  );
}

export default MenuTable;
