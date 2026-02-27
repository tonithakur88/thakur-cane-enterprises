import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Admin = () => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("active");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [depth, setDepth] = useState("");

  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const fetchProducts = async () => {
    const { data } = await API.get(
      "/products"
    );
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("status", status);

    if (status === "active") {
      formData.append("price", price);
      formData.append("stock", stock);
    }

    formData.append("image", image);

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    formData.append("description", description);

    const specsObject = {};
    specifications.split("\n").forEach((line) => {
      const [key, value] = line.split(":");
      if (key && value) {
        specsObject[key.trim()] = value.trim();
      }
    });

    formData.append("specifications", JSON.stringify(specsObject));
    formData.append("weight", weight);
    formData.append("height", height);
    formData.append("width", width);
    formData.append("depth", depth);

    try {
      await API.post(
        "/products",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product Added Successfully ✅");

      setName("");
      setPrice("");
      setStock("");
      setImage(null);
      setImages([]);
      setDescription("");
      setSpecifications("");
      setWeight("");
      setHeight("");
      setWidth("");
      setDepth("");
      setStatus("active");

      fetchProducts();

    } catch (err) {
      console.error(err);
      setMessage("Error adding product ❌");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(
        `/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStock = async (id) => {
    try {
      await API.put(
        `/products/update-stock/${id}`,
        { stock: stockValues[id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    background: "#f9fafb",
  };

  const smallBtnStyle = {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#2e7d32",
    color: "#fff",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2f7,#ffffff)",
        padding: "50px 8%",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: "1300px", margin: "auto" }}>

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "5px",
              }}
            >
              Admin Dashboard
            </h1>
            <p style={{ color: "#6b7280" }}>
              Manage products & inventory
            </p>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <button
              onClick={() => navigate("/admin/orders")}
              style={{
                padding: "10px 22px",
                background: "#2e7d32",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              View Orders
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("adminToken");
                window.location.href = "/admin/login";
              }}
              style={{
                padding: "10px 22px",
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* ADD PRODUCT SECTION */}
        <div
          style={{
            background: "#fff",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 25px 70px rgba(0,0,0,0.07)",
            marginBottom: "60px",
          }}
        >
          <h2 style={{ marginBottom: "30px" }}>
            Add New Product
          </h2>

          <form
            onSubmit={handleAddProduct}
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="active">
                Active / Sell Now
              </option>
              <option value="coming_soon">
                Coming Soon
              </option>
            </select>

            {status === "active" && (
              <>
                <input
                  type="number"
                  placeholder="Product Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  style={inputStyle}
                />

                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  style={inputStyle}
                />
              </>
            )}

            <textarea
              placeholder="Product Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                ...inputStyle,
                gridColumn: "1/-1",
                height: "100px",
              }}
            />

            <textarea
              placeholder="Specifications"
              value={specifications}
              onChange={(e) =>
                setSpecifications(e.target.value)
              }
              style={{
                ...inputStyle,
                gridColumn: "1/-1",
                height: "100px",
              }}
            />

            <div
              style={{
                gridColumn: "1/-1",
                marginTop: "10px",
              }}
            >
              <h4 style={{ marginBottom: "10px" }}>
                Dimensions
              </h4>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit,minmax(150px,1fr))",
                  gap: "15px",
                }}
              >
                <input
                  type="text"
                  placeholder="Weight"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value)
                  }
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Height"
                  value={height}
                  onChange={(e) =>
                    setHeight(e.target.value)
                  }
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Width"
                  value={width}
                  onChange={(e) =>
                    setWidth(e.target.value)
                  }
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder="Depth"
                  value={depth}
                  onChange={(e) =>
                    setDepth(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label>Main Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setImage(e.target.files[0])
                }
                required
                style={{ marginTop: "5px" }}
              />
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <label>More Images</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setImages(e.target.files)
                }
                style={{ marginTop: "5px" }}
              />
            </div>

            <button
              type="submit"
              style={{
                gridColumn: "1/-1",
                padding: "14px",
                background:
                  "linear-gradient(90deg,#111,#2e7d32)",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Add Product
            </button>
          </form>

          {message && (
            <p
              style={{
                marginTop: "20px",
                color: "#16a34a",
                fontWeight: "600",
              }}
            >
              {message}
            </p>
          )}
        </div>

        {/* PRODUCTS LIST */}
        <h2 style={{ marginBottom: "30px" }}>
          All Products
        </h2>

        <div
          style={{
            display: "grid",
            gap: "25px",
          }}
        >
          {products.map((p) => (
            <div
              key={p._id}
              style={{
                background: "#fff",
                padding: "25px",
                borderRadius: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow:
                  "0 15px 40px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <img
                  src={p.image}
                  alt=""
                  width="80"
                  style={{
                    borderRadius: "12px",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <p
                    style={{
                      fontWeight: "600",
                      fontSize: "16px",
                    }}
                  >
                    {p.name}
                  </p>
                  <p>₹ {p.price}</p>
                  <p style={{ color: "#6b7280" }}>
                    Stock: {p.stock}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="number"
                  placeholder="New Stock"
                  value={stockValues[p._id] || ""}
                  onChange={(e) =>
                    setStockValues({
                      ...stockValues,
                      [p._id]: e.target.value,
                    })
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    width: "110px",
                  }}
                />

                <button
                  onClick={() =>
                    updateStock(p._id)
                  }
                  style={smallBtnStyle}
                >
                  Update
                </button>

                <button
                  onClick={() =>
                    deleteProduct(p._id)
                  }
                  style={{
                    ...smallBtnStyle,
                    background: "#ef4444",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

};

export default Admin;
