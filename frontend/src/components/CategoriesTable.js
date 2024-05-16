import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

function CategoriesTable({ token }) {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const getDishById = (id) => {
    return menuItems.find(item => item.value === id);
  };
  // hook for menu items
  useEffect(() => {
    async function fetchData() {
      try {
        const menuResponse = await axios.get('http://localhost:5000/api/menu/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Raw menu data:', menuResponse.data); // Проверяем сырые данные меню
  
        const categoriesResponse = await axios.get('http://localhost:5000/api/menu/categories/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Raw categories data:', categoriesResponse.data); // Проверяем сырые данные категорий
  
        // Обработка данных меню
        const menuData = menuResponse.data && menuResponse.data.menu ? JSON.parse(menuResponse.data.menu) : [];
        if (!menuData || !Array.isArray(menuData)) {
          console.error('Invalid menu data:', menuData);
          return;
        }
        const menuItems = menuData.map(item => ({
          label: item.name,
          value: item._id.$oid
        }));
        setMenuItems(menuItems);
  
        // Обработка данных категорий
        const categoriesData = categoriesResponse.data && categoriesResponse.data.categories ? categoriesResponse.data.categories : [];
        if (!categoriesData || !Array.isArray(categoriesData)) {
          console.error('Invalid categories data:', categoriesData);
          return;
        }
        const categories = categoriesData.map(category => ({
          name: category.name,
          dishes: category.dishes // Теперь мы просто сохраняем ID блюд, не ищем их в menuItems
        }));
        
        setCategories(categories);
      
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, [token]);
  
  


  const handleAddDish = useCallback((categoryIndex) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      // Проверяем, создан ли уже селектор в этой категории
      if (!newCategories[categoryIndex].dishes.includes('')) {
        newCategories[categoryIndex].dishes.push('');
      }
      return newCategories;
    });
  }, [categories]); // Теперь `categories` включены в зависимости
  
  const handleRemoveDish = useCallback((categoryIndex, dishIndex) => {
    setCategories(prevCategories => {
      const newCategories = [...prevCategories];
      console.log(`Removing dish at category ${categoryIndex}, index ${dishIndex}`); // Логируем действие
  
      newCategories[categoryIndex].dishes.splice(dishIndex, 1);
  
      // Отправляем обновлённые данные на сервер, если у категории есть ID
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
    const { value } = e.target; // ID выбранного блюда
    setCategories(prevCategories => {
        const newCategories = [...prevCategories];
        newCategories[categoryIndex].dishes[dishIndex] = value; // Сохраняем ID в массиве блюд

        // Если у категории есть ID, отправляем изменения на сервер
        if (newCategories[categoryIndex]._id) {
            axios.put(`http://localhost:5000/api/menu/categories/${newCategories[categoryIndex]._id}`, {
                dishes: newCategories[categoryIndex].dishes.filter(dishId => dishId) // Отправка только валидных ID
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
  
        console.log('Raw menu data:', menuResponse.data); // Проверяем сырые данные меню
        console.log('Raw categories data:', categoriesResponse.data); // Проверяем сырые данные категорий
  
        // Обработка данных меню
        const menuData = menuResponse.data && menuResponse.data.menu ? JSON.parse(menuResponse.data.menu) : [];
        if (!menuData || !Array.isArray(menuData)) {
          console.error('Invalid menu data:', menuData);
          return;
        }
        const menuItems = menuData.map(item => ({
          label: item.name,
          value: item._id.$oid
        }));
  
        // Обработка данных категорий
        const categoriesData = categoriesResponse.data && categoriesResponse.data.categories ? categoriesResponse.data.categories : [];
        if (!categoriesData || !Array.isArray(categoriesData)) {
          console.error('Invalid categories data:', categoriesData);
          return;
        }
        const categories = categoriesData.map(category => ({
          name: category.name,
          dishes: category.dishes.map(dishId => {
            const dish = menuItems.find(item => item.value === dishId);
            return dish ? { label: dish.label, value: dish.value } : { label: 'Unknown Dish', value: dishId };
          })
        }));
  
        setMenuItems(menuItems);
        setCategories(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, [token]);
  const handleEditCategory = (categoryIndex) => {
    const oldCategoryName = categories[categoryIndex].name;
    const newCategoryName = prompt("Enter new category name", oldCategoryName);
    if (newCategoryName) {
        axios.put(`http://localhost:5000/api/menu/categories/`, {
          oldName: oldCategoryName,
          newName: newCategoryName,
          dishes: categories[categoryIndex].dishes
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          console.log(response);
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
      axios.delete(`http://localhost:5000/api/menu/categories/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          name: deletedCategory.name
        }
      })
        .then(response => {
          console.log(response);
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
      setCategories(prevCategories => [...prevCategories, { name: newCategoryName, dishes: [''] }]);
    }
  };
  

  const handleSubmit = () => {
    // Подготовка категорий к отправке
    const formattedCategories = categories.map(category => ({
      category: category.name,
      dishes: category.dishes.filter(dishId => dishId) // Фильтрация пустых и неправильных ID
    }));

    // Удаление категорий без блюд перед отправкой
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


  const maxRows = Math.max(...categories.map(category => category.dishes.length));
  return (
    <div className="table-responsive small" style={{ overflowX: 'auto' }}>
      <table className="table table-striped table-sm" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {categories.map((category, index) => (
              <th key={index} style={{ width: '200px' }}>
                {category.name}
                <Button onClick={() => handleEditCategory(index)} variant="outline-secondary">Edit</Button>
                <Button onClick={() => handleDeleteCategory(index)} variant="outline-warning">Delete</Button>
                <Button onClick={() => handleAddDish(index)} variant="outline-primary">Add Dish</Button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {categories.map((category, categoryIndex) => (
              <td key={categoryIndex}>
                {category.dishes.map((dishID, dishIndex) => (
                  <div key={dishIndex} className="d-flex align-items-center justify-content-between">
                    <select className="form-control" value={dishID || ""} onChange={e => handleChange(e, categoryIndex, dishIndex)}>
                      <option value="">Select...</option>
                      {menuItems.map(item => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <Button onClick={() => handleRemoveDish(categoryIndex, dishIndex)} variant="secondary">Remove</Button>
                  </div>
                ))}
              </td>
            ))}
          </tr>
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