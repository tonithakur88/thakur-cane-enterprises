import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [qty, setQty] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await API.get(`/api/products/${id}`);

      setProduct(data);

      const imgs = [data.image, ...(data.images || [])].filter(Boolean);
      setImages(imgs);
      setSelectedImage(imgs[0] || "");
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const checkCart = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const { data } = await API.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const exists = data.items.find((item) => item.product._id === id);

      if (exists) setInCart(true);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    checkCart();
  }, [fetchProduct, checkCart]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Login First ❌");
        return;
      }

      await API.post(
        "/api/cart/add",
        { productId: product._id, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInCart(true);
      alert("Added to Cart ✅");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart ❌");
    }
  };

  if (!product) return <h2 style={{ padding: "40px" }}>Loading...</h2>;

  const nextImage = () => {
    const index = images.indexOf(selectedImage);
    const next = (index + 1) % images.length;
    setSelectedImage(images[next]);
  };

  const prevImage = () => {
    const index = images.indexOf(selectedImage);
    const prev = (index - 1 + images.length) % images.length;
    setSelectedImage(images[prev]);
  };

  const outOfStock = product.stock === 0;
  const fewLeft = product.stock > 0 && product.stock <= 10;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* IMAGE SECTION */}
        <div style={styles.imageSection}>

          <div style={styles.thumbColumn}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                style={{
                  ...styles.thumb,
                  border:
                    selectedImage === img
                      ? "2px solid #000"
                      : "1px solid #ddd",
                }}
              />
            ))}
          </div>

          <div style={styles.mainImageBox}>

            <button onClick={prevImage} style={styles.sliderLeft}>
              ‹
            </button>

            <img
              src={selectedImage}
              alt={product.name}
              style={styles.mainImage}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.15)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />

            <button onClick={nextImage} style={styles.sliderRight}>
              ›
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div style={styles.infoSection}>
          <h1>{product.name}</h1>

          <div style={styles.price}>₹ {product.price}</div>

          {outOfStock && (
            <span style={styles.outStock}>Out of Stock</span>
          )}

          {fewLeft && (
            <span style={styles.fewLeft}>
              🔥 Hurry! Few items left
            </span>
          )}

          {!outOfStock && (
            <div style={styles.qtyRow}>
              <button
                onClick={() => qty > 1 && setQty(qty - 1)}
                style={styles.qtyBtn}
              >
                −
              </button>

              <span style={{ fontWeight: "bold" }}>{qty}</span>

              <button
                onClick={() =>
                  qty < product.stock && setQty(qty + 1)
                }
                style={styles.qtyBtn}
              >
                +
              </button>
            </div>
          )}

          {!outOfStock && (
            <button
              onClick={
                inCart
                  ? () => (window.location.href = "/cart")
                  : addToCart
              }
              style={styles.cartBtn}
            >
              {inCart ? "View Cart 🛒" : "Add To Cart 🛍️"}
            </button>
          )}

          {/* TABS */}
          <div style={{ marginTop: "40px" }}>
            <div style={styles.tabs}>
              <span
                onClick={() => setActiveTab("description")}
                style={styles.tab(activeTab === "description")}
              >
                Description
              </span>

              <span
                onClick={() => setActiveTab("specs")}
                style={styles.tab(activeTab === "specs")}
              >
                Specifications
              </span>
            </div>

            <div style={{ marginTop: "20px" }}>
              {activeTab === "description" && (
                <p style={{ lineHeight: "1.7" }}>
                  {product.description}
                </p>
              )}

              {activeTab === "specs" && (
                <table style={{ width: "100%" }}>
                  <tbody>
                    {product.specifications &&
                      Object.entries(product.specifications).map(
                        ([key, value], index) => (
                          <tr key={index}>
                            <td style={styles.specKey}>{key}</td>
                            <td style={styles.specVal}>{value}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {

page:{
padding:"50px 5%",
background:"#f5f5f5"
},

container:{
display:"flex",
flexWrap:"wrap",
gap:"40px",
background:"#fff",
padding:"30px",
borderRadius:"15px"
},

imageSection:{
display:"flex",
gap:"15px",
flexWrap:"wrap"
},

thumbColumn:{
display:"flex",
flexDirection:"column",
gap:"10px"
},

thumb:{
width:"60px",
height:"60px",
objectFit:"cover",
borderRadius:"8px",
cursor:"pointer"
},

mainImageBox:{
width:"420px",
height:"420px",
position:"relative",
borderRadius:"15px",
overflow:"hidden"
},

mainImage:{
width:"100%",
height:"100%",
objectFit:"cover",
transition:"0.4s"
},

sliderLeft:{
position:"absolute",
left:"10px",
top:"50%",
transform:"translateY(-50%)",
background:"rgba(0,0,0,0.6)",
color:"#fff",
border:"none",
fontSize:"26px",
padding:"6px 14px",
cursor:"pointer",
borderRadius:"50%",
zIndex:10
},

sliderRight:{
position:"absolute",
right:"10px",
top:"50%",
transform:"translateY(-50%)",
background:"rgba(0,0,0,0.6)",
color:"#fff",
border:"none",
fontSize:"26px",
padding:"6px 14px",
cursor:"pointer",
borderRadius:"50%",
zIndex:10
},

infoSection:{
flex:"1",
minWidth:"280px"
},

price:{
fontSize:"26px",
fontWeight:"bold",
margin:"10px 0"
},

fewLeft:{
background:"#ffe5e5",
color:"red",
padding:"6px 12px",
borderRadius:"20px",
fontWeight:"bold"
},

outStock:{
background:"#ffe5e5",
color:"red",
padding:"6px 12px",
borderRadius:"20px",
fontWeight:"bold"
},

qtyRow:{
display:"flex",
alignItems:"center",
gap:"10px",
marginTop:"20px"
},

qtyBtn:{
width:"35px",
height:"35px",
border:"1px solid #ddd",
borderRadius:"6px",
cursor:"pointer"
},

cartBtn:{
marginTop:"25px",
padding:"12px 35px",
borderRadius:"10px",
border:"none",
background:"black",
color:"white",
cursor:"pointer"
},

tabs:{
display:"flex",
gap:"25px"
},

tab:(active)=>({
cursor:"pointer",
fontWeight:active?"bold":"normal",
borderBottom:active?"2px solid black":"none"
}),

specKey:{
padding:"8px",
fontWeight:"bold",
background:"#f5f5f5"
},

specVal:{
padding:"8px"
}

};

export default ProductDetail;