const Display = ({
  data,
  category,
  cart,
  addToCart,
  removeFromCart,
  handleUpdateProduct,
  handleDeleteProduct,
}) => {
  return (
    <div>
      <h2>{category.toUpperCase()}</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
                width: "150px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100px",
                  objectFit: "cover",
                }}
              />
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              {handleUpdateProduct && (
                <div>
                  <button onClick={() => handleUpdateProduct(item.id)}>Update</button>
                  <button onClick={() => handleDeleteProduct(item.id)}>Delete</button>
                </div>
              )}
              {!handleUpdateProduct && cart.some(
                (cartItem) =>
                  cartItem.id === item.id && cartItem.category === category
              ) ? (
                <div>
                  <button onClick={() => removeFromCart(item)}> - </button>
                  <span>
                    {
                      cart.find(
                        (cartItem) =>
                          cartItem.id === item.id &&
                          cartItem.category === category
                      ).quantity
                    }
                  </span>
                  <button onClick={() => addToCart(item)}> + </button>
                </div>
              ) : (
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              )}
            </div>
          ))
        ) : (
          <p>No data available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Display;
