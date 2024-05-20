import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function CategoriesTable({ token }) {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [menuResponse, categoriesResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/menu/', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/menu/categories/', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const menuData = menuResponse.data && menuResponse.data.menu ? JSON.parse(menuResponse.data.menu) : [];
        const fetchedMenuItems = Array.isArray(menuData) ? menuData.map(item => ({
          label: item.label,
          value: item.value
        })) : [];

        const categoriesData = categoriesResponse.data && categoriesResponse.data.categories ? categoriesResponse.data.categories : [];
        const fetchedCategories = Array.isArray(categoriesData) ? categoriesData.map(category => ({
          _id: category._id,
          name: category.name,
          dishes: category.dishes
        })) : [];

        setMenuItems(fetchedMenuItems);
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const handleAddDish = useCallback((categoryIndex) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      if (!newCategories[categoryIndex].dishes.includes('')) {
        newCategories[categoryIndex].dishes.push('');
      }
      return newCategories;
    });
  }, []);

  const handleRemoveDish = useCallback((categoryIndex, dishIndex) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      newCategories[categoryIndex].dishes.splice(dishIndex, 1);

      if (newCategories[categoryIndex]._id) {
        axios.put(`http://localhost:5000/api/menu/categories/${newCategories[categoryIndex]._id}`, {
          dishes: newCategories[categoryIndex].dishes
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log(`Updated on server: ${response.data}`);
        })
        .catch(error => {
          console.error('There was an error updating the category on server!', error);
        });
      }

      return newCategories;
    });
  }, [token]);

  const handleChange = useCallback((e, categoryIndex, dishIndex) => {
    const { value } = e.target;
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      newCategories[categoryIndex].dishes[dishIndex] = value;

      if (newCategories[categoryIndex]._id) {
        axios.put(`http://localhost:5000/api/menu/categories/${newCategories[categoryIndex]._id}`, {
          dishes: newCategories[categoryIndex].dishes.filter(dishId => dishId)
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => console.log(response))
        .catch(error => console.error('There was an error!', error));
      }

      return newCategories;
    });
  }, [token]);

  const handleEditCategory = (categoryIndex) => {
    const oldCategoryName = categories[categoryIndex].name;
    const newCategoryName = prompt("Enter new category name", oldCategoryName);
    if (newCategoryName) {
      axios.put(`http://localhost:5000/api/menu/categories/${categories[categoryIndex]._id}`, {
        name: newCategoryName,
        dishes: categories[categoryIndex].dishes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setCategories(prevCategories => {
          const newCategories = [...prevCategories];
          newCategories[categoryIndex].name = newCategoryName;
          return newCategories;
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    }
  };

  const handleDeleteCategory = (categoryIndex) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      const deletedCategory = categories[categoryIndex];
      axios.delete(`http://localhost:5000/api/menu/categories/${deletedCategory._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setCategories(prevCategories => {
          const newCategories = [...prevCategories];
          newCategories.splice(categoryIndex, 1);
          return newCategories;
        });
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
    }
  };

  const handleAddCategory = () => {
    const newCategoryName = prompt("Enter new category name");
    if (newCategoryName) {
      const newCategory = {
        _id: { $oid: (new Date()).getTime().toString() },
        name: newCategoryName,
        dishes: ['']
      };
      setCategories(prevCategories => [...prevCategories, newCategory]);
    }
  };

  const handleSubmit = () => {
    const formattedCategories = categories.map(category => ({
      category: category.name,
      dishes: category.dishes.filter(dishId => dishId)
    }));

    const filteredCategories = formattedCategories.filter(category => category.dishes.length > 0);

    axios.post('http://localhost:5000/api/menu/categories/', filteredCategories, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  const maxDishes = categories.length ? Math.max(...categories.map(category => category.dishes.length)) : 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="table-responsive small" style={{ overflowX: 'auto' }}>
      <table className="table table-striped table-sm" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {categories.map((category, index) => (
              <th key={category._id?.$oid || index} style={{ width: '200px' }}>
                {category.name}
                <Button onClick={() => handleEditCategory(index)} variant="outline-secondary">Edit</Button>
                <Button onClick={() => handleDeleteCategory(index)} variant="outline-warning">Delete</Button>
                <Button onClick={() => handleAddDish(index)} variant="outline-primary">Add Dish</Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(maxDishes)].map((_, dishIndex) => (
            <tr key={dishIndex}>
              {categories.map((category, categoryIndex) => (
                <td key={category._id?.$oid || categoryIndex}>
                  {category.dishes[dishIndex] !== undefined && (
                    <div className="d-flex align-items-center justify-content-between">
                      <select className="form-control" value={category.dishes[dishIndex] || ""} onChange={e => handleChange(e, categoryIndex, dishIndex)}>
                        <option value="">Select...</option>
                        {menuItems.map(item => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <Button onClick={() => handleRemoveDish(categoryIndex, dishIndex)} variant="secondary">Remove</Button>
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2">
        <Button onClick={handleAddCategory} variant="success">Add Category</Button>
        <Button onClick={handleSubmit} variant="primary">Submit</Button>
      </div>
    </div>
  );
}

export default CategoriesTable;
