import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Button, Modal, Offcanvas, Form } from 'react-bootstrap';
import axios from 'axios';
import './MenuApp.css';

const allergensList = [
  'Gluten', 'Crustaceans', 'Eggs', 'Fish', 'Peanuts', 'Soybeans',
  'Milk', 'Nuts', 'Celery', 'Mustard', 'Sesame', 'Sulphites', 'Lupin', 'Molluscs'
];

function MenuApp() {
  const { username } = useParams();
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [excludedAllergens, setExcludedAllergens] = useState([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchCategories = axios.get(`http://localhost:5000/api/public/${username}/categories`);
    const fetchDishes = axios.get(`http://localhost:5000/api/public/${username}/dishes`);

    Promise.all([fetchCategories, fetchDishes]).then(([categoriesRes, dishesRes]) => {
      console.log('Categories API response:', categoriesRes.data);
      console.log('Dishes API response:', dishesRes.data);

      setCategories(categoriesRes.data);
      setDishes(dishesRes.data);

      setSelectedCategoryId(categoriesRes.data[0]?._id);
      setIsLoading(false);
    }).catch(error => {
      console.error('Failed to fetch data:', error);
      setHasError(true);
    });
  }, [username]);
  if (hasError) {
    return <Navigate to="/" />;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }



  const getCurrentDishes = () => {
    const currentCategory = categories.find(cat => cat._id === selectedCategoryId);
    if (!currentCategory) {
      console.error(`Category not found for ID: ${selectedCategoryId}`);
      return [];
    }
    const currentDishes = currentCategory.dishes.map(dishId => {
      const dish = dishes.find(d => d._id === dishId);
      if (!dish) {
        console.error(`Dish not found for ID: ${dishId}`);
      }
      return dish;
    }).filter(dish => dish);

    return currentDishes.filter(dish => 
      !excludedAllergens.some(allergen => dish.allergens && dish.allergens[allergen])
    );
  };

  const handleSelectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handleSelectDish = (dish) => {
    setSelectedDish(dish);
    setShowModal(true);
    trackClick('dish_view', { dish_id: dish._id });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleLikeDish = (dishId) => {
    axios.post(`http://localhost:5000/api/public/dishes/${dishId}/like`, { username: username })
      .then(response => {
        console.log('Dish liked:', response.data);
        trackClick('like', { dish_id: dishId });
      })
      .catch(error => {
        console.error('Failed to like dish:', error);
      });
  };

  const trackClick = (eventType, data) => {
    axios.post('http://localhost:5000/api/public/analytics/click', {
      event_type: eventType,
      data: data,
      username: username
    }).then(response => {
      console.log('Click tracked:', response.data);
    }).catch(error => {
      console.error('Failed to track click:', error);
    });
  };

  const handleToggleFilter = () => setShowFilter(!showFilter);

  const handleAllergenChange = (allergen) => {
    setExcludedAllergens(prevState => {
      if (prevState.includes(allergen)) {
        return prevState.filter(a => a !== allergen);
      } else {
        return [...prevState, allergen];
      }
    });
  };


  return (
    <Container>
      <div className="menu-navbar shadow-sm mb-4">
        <Container fluid>
          <div className="d-flex align-items-center justify-content-between">
            <div className="text-uppercase fw-bold">Menu</div>
            <Nav className="flex-grow-1 justify-content-center">
              {categories.map((category) => (
                <Nav.Link 
                  key={category._id} 
                  onClick={() => handleSelectCategory(category._id)}
                  className={`nav-item ${category._id === selectedCategoryId ? 'active' : ''}`}
                >
                  {category.name}
                </Nav.Link>
              ))}
            </Nav>
            <Button variant="outline-primary" onClick={handleToggleFilter}>Filter Allergens</Button>
          </div>
        </Container>
      </div>

      <Row>
        {getCurrentDishes().map((dish, index) => (
          dish ? (
            <Col key={dish._id || index} md={4} className="mb-4">
              <Card className="shadow-sm h-100">
                <Card.Img variant="top" src={dish.photo || 'default-placeholder.png'} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{dish.name}</Card.Title>
                  <Card.Text className="flex-grow-1">{dish.details}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fw-bold">{dish.price}₴</div>
                    <div>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleSelectDish(dish)}>Details</Button>
                      <Button variant="outline-success" size="sm" onClick={() => handleLikeDish(dish._id)}>Like</Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <Col key={`missing-${index}`} md={4}>Dish not found</Col>
          )
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDish?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedDish?.details}</p>
          <ul className="list-unstyled">
            {Object.keys(selectedDish?.allergens || {}).map(allergen => (
              <li key={allergen} className="text-danger">{allergen}</li>
            ))}
          </ul>
          <img src={selectedDish?.photo} alt={selectedDish?.name} className="img-fluid" />
        </Modal.Body>
      </Modal>

      <Offcanvas show={showFilter} onHide={handleToggleFilter}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter by Allergens</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            {allergensList.map(allergen => (
              <Form.Check
                key={allergen}
                type="checkbox"
                label={allergen}
                onChange={() => handleAllergenChange(allergen)}
                checked={excludedAllergens.includes(allergen)}
              />
            ))}
          </Form>
          <Button variant="primary" onClick={handleToggleFilter} className="mt-3">Apply Filters</Button>
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
}

export default MenuApp;