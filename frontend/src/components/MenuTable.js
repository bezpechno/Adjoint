import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MenuTable({token}) {
  const [rows, setRows] = useState([
    { name: '', details: '', price: '', allergens: '', photo: '', status: '', action: '' }
  ]);
  const [existingRows, setExistingRows] = useState([]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...rows];
    list[index][name] = value;
    setRows(list);
  };

  const handleRemoveClick = index => {
    const list = [...rows];
    list.splice(index, 1);
    setRows(list);
  };

  const handleAddClick = () => {
    setRows([...rows, { name: '', details: '', price: '', allergens: '', photo: '', status: '', action: '' }]);
  };

  const handleSubmit = () => {
    console.log(token)
    axios.post('http://localhost:5000/api/menu/', rows, {
      headers: {
        'Authorization': `Bearer ${token}`  // Use the token in the Authorization header
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };
  useEffect(() => {
    console.log(token)
    axios.get('http://localhost:5000/api/menu/', {
      headers: {
        'Authorization': `Bearer ${token}`  // Use the token in the Authorization header
      }
    })
    .then(response => {
      const { username, menu } = response.data;
      // Try to parse menu as JSON
      let parsedMenu;
      try {
        parsedMenu = JSON.parse(menu);
      } catch (error) {
        console.error('Failed to parse menu:', error);
      }
      // Check if parsedMenu is an array before setting existingRows
      if (Array.isArray(parsedMenu)) {
        setExistingRows(parsedMenu);
      } else {
        console.error('Menu is not an array:', parsedMenu);
      }
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, [token]);  // Re-run the effect when the token changes

  return (
    <div className="table-responsive-sm">
      <table className="table table-striped table-sm">
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
        {existingRows.map((x, i) => {
            return (
                <tr key={i}>
                <td>{x.name}</td>
                <td>{x.details}</td>
                <td>{x.price}</td>
                <td>{x.allergens}</td>
                <td>{x.photo}</td>
                <td>{x.status}</td>
                <td>
                    <select name="action" value={x.action} onChange={e => handleChange(e, i)}>
                    <option value="">Select...</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                    <option value="disable">Disable</option>
                    </select>
                </td>
                </tr>
            );
            })}
            {rows.map((x, i) => {
            return (
                <tr key={i}>
                <td><input name="name" value={x.name} onChange={e => handleChange(e, i)} /></td>
                <td><input name="details" value={x.details} onChange={e => handleChange(e, i)} /></td>
                <td><input name="price" value={x.price} onChange={e => handleChange(e, i)} /></td>
                <td><input name="allergens" value={x.allergens} onChange={e => handleChange(e, i)} /></td>
                <td><input name="photo" value={x.photo} onChange={e => handleChange(e, i)} /></td>
                <td><input name="status" value={x.status} onChange={e => handleChange(e, i)} /></td>
                <td>
                    <select name="action" value={x.action} onChange={e => handleChange(e, i)}>
                    <option value="">Select...</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                    <option value="disable">Disable</option>
                    </select>
                    {rows.length !== 1 && <button onClick={() => handleRemoveClick(i)}>Remove</button>}
                    {rows.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
                </td>
                </tr>
            );
            })}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default MenuTable;