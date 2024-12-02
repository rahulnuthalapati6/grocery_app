import React, { useEffect, useState } from "react";
import axios from "axios";
import Display from "./Components/Display";
import './Cart.css'; 

const API_URL = "http://localhost:3000";

function App() {
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("fruits");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "", category: "" });
  const [searchQuery, setSearchQuery] = useState(""); 
  useEffect(() => {
    if (!isAdmin) fetchCategoryData();
  }, [category, isAdmin]);

  const fetchCategoryData = () => {
    axios
      .get(`${API_URL}/${category}`)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const addToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.category === category
    );
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.category === category
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, category, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.category === category
    );
    if (existingItem.quantity > 1) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id && cartItem.category === category
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      setCart(
        cart.filter(
          (cartItem) =>
            !(cartItem.id === item.id && cartItem.category === category)
        )
      );
    }
  };
  const createProduct = () => {
    const { name, price, image, category } = newProduct;
    if (!name || !price || !image || !category) {
      alert("All fields are required!");
      return;
    }
    axios
      .post(`${API_URL}/${category}`, { name, price, image })
      .then(() => {
        fetchCategoryData();
        setNewProduct({ name: "", price: "", image: "", category: "" });
        alert("Product created successfully!");
      })
      .catch((error) => console.error("Error creating product:", error));
  };

  const updateProduct = (id) => {
    const updatedPrice = prompt("Enter the new price:");
    if (updatedPrice) {
      axios
        .patch(`${API_URL}/${category}/${id}`, { price: updatedPrice })
        .then(() => {
          fetchCategoryData();
          alert("Product price updated successfully!");
        })
        .catch((error) => console.error("Error updating product:", error));
    }
  };

  const deleteProduct = (id) => {
    console.log(`Attempting to delete product with ID: ${id}`);
    if (window.confirm("Are you sure you want to delete this product?")) {
      const url = `${API_URL}/${category}/${id}`;
      console.log("Deleting product from URL:", url); 
      axios
        .delete(url)
        .then(() => {
          fetchCategoryData();
          alert("Product deleted successfully!");
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  const handleSearch = () => {
    if (searchQuery) {
      const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setData(filteredData);
    } else {
      fetchCategoryData(); 
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Grocery Store</h1>
        
        <div className="search-container" >
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <button onClick={handleSearch}>Search</button>
        
      </div>
      <div className="cart-button" onClick={() => setShowCart(!showCart)}>
          🛒
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>
      </header>

      <div className="categories">
        <button onClick={() => setCategory("fruits")}>Fruits</button>
        <button onClick={() => setCategory("vegetables")}>Vegetables</button>
        <button onClick={() => setCategory("dairyProducts")}>Dairy</button>
        <button onClick={() => setCategory("snacks")}>Snacks</button>
        <button onClick={() => setCategory("chocolates")}>Chocolates</button>
        <button onClick={() => setCategory("icecreams")}>Ice Creams</button>
        <button onClick={() => setIsAdmin(!isAdmin)}>CRUD Operations</button>
      </div>

      {isAdmin ? (
        <div className="admin-mode">
          <h2>Admin Mode</h2>
          <div className="crud-form">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Product Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Product Image URL"
              value={newProduct.image}
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            />
            <input
              type="text"
              placeholder="Product Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            />
            <button onClick={createProduct}>Create Product</button>
          </div>
          <h3>Existing Products in {category}</h3>
          <div className="crud-items">
            {data.length > 0 ? (
              data.map((item) => (
                <div key={item.id} className="crud-item">
                  <p>{item.name}</p>
                  <p>Price: ₹{item.price}</p>
                  <button onClick={() => updateProduct(item.id)}>Update Price</button>
                  <button onClick={() => deleteProduct(item.id)}>Delete</button>
                </div>
              ))
            ) : (
              <p>No products available in this category.</p>
            )}
          </div>
        </div>
      ) : (
        <Display
          data={data}
          category={category}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
        />
      )}

      {showCart && (
        <div className="cart-modal">
          <h2>Cart</h2>
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={`${item.id}-${item.category}`} className="cart-item">
                {item.name} ({item.category}) - {item.quantity} x ₹{item.price} = ₹
                {item.quantity * item.price}
                <button onClick={() => removeFromCart(item)}>Remove</button>
              </div>
            ))
          ) : (
            <p>Cart is empty</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
