import Navbar from '../Navbar/navbar';
import { React, useEffect, useState, useContext } from 'react';
import './product.css';
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import  { Link } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBContainer, MDBIcon, MDBRow, MDBTypography,MDBBtn } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { useCart } from '../context/cart';
import { useParams, useLocation } from 'react-router-dom';
import { useUpload } from '../context/uploadId';
import { useDispatch, useSelector } from 'react-redux';
import { incrementItem, decrementItem } from './cartSlice';
let total = 0;
function Cart({ item }) {
  const { upload } = useUpload();
  const [error, setError] = useState('');
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ cart: { items: [] } });
  const [imageURL, setImageURL] = useState(null);
  const [im, setIm] = useState({});
  const userId = localStorage.getItem('userId');
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  const dispatch = useDispatch();
  const quantity = useSelector((state) => (item && item.productId && state.cart.items[item.productId._id]) || 0);


  const fetchImageData = async (uploadId, productId) => {
    
    try {
      const response = await fetch(`https://photo-frame-website.onrender.com/getImage-upload/${encodeURIComponent(uploadId)}`);
      if (!response.ok) {
       // throw new Error('Failed to fetch image data');
      }
      const imageData = await response.json();
     
      const base64String = btoa(
        new Uint8Array(imageData.imageData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      const url = `data:image/png;base64,${base64String}`;

      // Set the image URL for the corresponding product ID
      setIm(prevImages => {
        const updatedImages = {
          ...prevImages,
          [productId]: url
        };
        
        return updatedImages;
      });

      const productsWithImages = await Promise.all(cartData.cart.items.map(async (item) => {
        // Access the image URL corresponding to the product ID from the 'im' state
        const imageUrl = im[item.productId._id];
        return {
          ...item,
          imageUrl: imageUrl // Add the image URL to the product data
        };
      }));
     

    } catch (error) {
      //console.error('Error retrieving image data:', error);
    }
  };
  const updateQuantity = async (productId, quantity) => {
    try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`https://photo-frame-website.onrender.com/add-to-cart/update/${encodeURIComponent(userId)}/${encodeURIComponent(productId)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }),
        });

        if (response.ok) {
            const updatedCartData = await response.json();
            return updatedCartData;
        } else {
            throw new Error('Failed to update cart item quantity');
        }
    } catch (error) {
        throw new Error('Error updating cart item quantity: ' + error.message);
    }
};
  const handlePlus = async (productId) => {
    dispatch(incrementItem(productId));
    const userId = localStorage.getItem('userId');
    try {
      const updatedCartData = await updateQuantity(productId, 1);
      // Update the cart data in the state
      setCartData(updatedCartData);
      console.log(updatedCartData);
    } catch (error) {
        // Handle fetch error
        console.error('Error updating cart item quantity:', error);
    }
};
const handleMinus = async (productId) => {
  dispatch(decrementItem(productId));
  const userId = localStorage.getItem('userId');
  try {
    const updatedCartData = await updateQuantity(productId, -1);
    // Update the cart data in the state
    setCartData(updatedCartData);
    console.log(updatedCartData);
  } catch (error) {
      // Handle fetch error
      console.error('Error updating cart item quantity:', error);
  }
};

  

  const getCart = async () => {

    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        navigate('/login', { replace: true });
      }

      const res = await fetch(`https://photo-frame-website.onrender.com/add-to-cart/${encodeURIComponent(userId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();

      setCartData(datas);

      setCart(datas.cart.items.length);
      //console.log("cart: ", datas.cart.items);
      if (Array.isArray(datas.cart.items)) {
        datas.cart.items.forEach(item => {
          const { uploadId, productId } = item;
      
          fetchImageData(uploadId, productId._id); 
        });
      }



      if (datas.cart.items && datas.cart.items.length > 0) {
        const imagePromises = datas.cart.items.map(async (item) => {
          try {
            const imageRes = await fetch(`https://photo-frame-website.onrender.com/product-image/${encodeURIComponent(item.productId._id)}`, {
              method: 'GET',
              credentials: 'include',
            });

            if (!imageRes.ok) {
              throw new Error(`Failed to fetch image for product ID ${item.productId._id}`);
            }

            const buffer = await imageRes.arrayBuffer();
            const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
            return {
              productId: item.productId._id,
              url: `data:image/png;base64,${base64Image}`,
            };
          } catch (error) {
            navigate('/login', { replace: true });
           // console.error(error.message);
            return null;
          }
        });

        const resolvedImages = await Promise.all(imagePromises);     // Resolve all image promises
        const filteredImages = resolvedImages.filter((image) => image !== null);   // Filter out any null values from failed requests
        setImageURL(filteredImages);
      }
    } catch (err) {
     // console.log('Error in fetching data', err);
    }
  };

  // product delete from user cart
  const handleRemoveCart = async (_id) => {
    // console.log('The product name to be deleted is ' + _id);
    try {
      const response = await fetch(`https://photo-frame-website.onrender.com/remove-item/${encodeURIComponent(userId)}/${encodeURIComponent(_id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        try {
          const updatedCart = await fetch(`https://photo-frame-website.onrender.com/add-to-cart/${encodeURIComponent(userId)}`, {
            method: 'GET',
            credentials: 'include',
          });
          if (!updatedCart.ok) {
            throw new Error('Failed to fetch updated cart data');
          }

          const updatedCartData = await updatedCart.json();
          console.log("Deleted successfully");
          setCartData(updatedCartData);
          setCart(updatedCartData.cart.items.length);
        } catch (error) {
          console.error('Error during product deletion', error);

        }
      } else {
        console.error('Failed to delete product messafe');

      }
    } catch (error) {
      console.error('Error during product deletion', error);
    }
  };

  //payment integration
  const handleCheckout = async () => {

    try {
      const stripe = await loadStripe('pk_test_51OyOhcA4uLHwNxGYlwqMkbqvF6QOd73m6MqORxnhF54D3fXLO9Fz2D3ZrGd0Cc8dyQtvkZDKC6wh53uxEC0ZYiOb00xGrm5KBV');

      const productsWithImages = await Promise.all(cartData.cart.items.map(async (item) => {
        const imageUrl = im[item.productId._id];
        return {
          ...item,          
          uploadId: item.uploadId,
        };
      }));

      const body = {
        products: productsWithImages,
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch('https://photo-frame-website.onrender.com/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      // Parse response JSON
      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });
      console.log(session);

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  useEffect(() => {
    getCart();
    if (cartData?.cart && Array.isArray(cartData?.cart?.items)) {
      const subtotalValue = cartData.cart.items.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0);
      setSubtotal(subtotalValue);
    }
    // Calculating shipping cost
    let shippingCost = 0;
    cartData.cart.items.forEach(item => {
      shippingCost += item.productId.shipping;
    });

    // Calculating total (subtotal + shipping cost)
    const totalValue = subtotal + shippingCost; 
    setTotal(totalValue);
    setShipping(shippingCost);
  }, [userId, cartData]);

  const productView = (productId) => {
    navigate(`/productView/${productId}`, { state: { additionalInfo: "cart" } });
  }

  return (
    <>
      <Navbar />
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard>
                <MDBCardBody className="p-4">
                  <MDBRow>
                    <MDBCol lg="7">
                      <MDBTypography tag="h5">
                        <a href="/products" className="text-body">
                          <MDBIcon fas icon="long-arrow-alt-left me-2" /> Continue
                          shopping
                        </a>
                      </MDBTypography>

                      <hr />

                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                          <p className="mb-1">Shopping cart</p>

                          <p className="mb-0">You have {cartData?.cart?.items.length || 0} unique items in your cart</p>
                        </div>
                        
                      </div>


                      <MDBCard className="mb-3">
                        <MDBCardBody>
                          {cartData?.cart && Array.isArray(cartData?.cart?.items) && (
                            <>
                              {cartData?.cart?.items.map((item, index) => (
                                <div key={index}>
                                  <div className="d-flex justify-content-between">
                                    <div className="d-flex flex-row align-items-center">
                                      <div>
                                        {imageURL && imageURL.map((image) => (
                                          image.productId === item.productId._id && (
                                            <MDBCardImage key={image.productId} src={image.url}
                                              fluid className="rounded-3" style={{ width: "45px" }} alt="Avatar" />)
                                        ))}
                                        {im[item.productId._id] && <MDBCardImage src={im[item.productId._id]} alt="Product" fluid className="rounded-3" style={{ width: "45px" }} />}
                                      </div>
                                      <div className="ms-4">
                                        <MDBTypography tag="h5">
                                          <p onClick={() =>productView(item.productId._id)}>
                                          {item.productId.productName}</p>
                                        </MDBTypography>
                                        <p className="small mb-0">Size: {item.size}</p>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center"> 
                                    <div>
                                        
                                          <FaMinus onClick={() => handleMinus(item.productId._id)} />
                                      
                                      </div>
                                   
                                      <div style={{ }}>
                                      
                                        <MDBTypography tag="h5" className="fw-normal mb-0">
                                         
                                          {item.quantity}
                                         
                                        </MDBTypography>
                                      </div>
                                      <div>
                                        
                                          <FaPlus onClick={() => handlePlus(item.productId._id)} style={{marginRight:'30px'}}/>
                                        
                                      </div>
                                      <div style={{ width: "88px" }}>
                                        <MDBTypography tag="h5" className="mb-0" style={{ color: 'red' }}>



                                          Rs. {item.quantity * item.productId.price}

                                        </MDBTypography>
                                      </div>

                                      <div style={{ width: "20px" }}> <a href="#!" style={{ color: "#cecece" }}>
                                        <MdDelete fas icon="trash-alt" onClick={() => handleRemoveCart(item.productId._id)} />
                                      </a></div>
                                    </div>
                                  </div>
                                  <hr />
                                </div>
                              ))}
                            </>
                          )}
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>

                    <MDBCol lg="5">
                      <MDBCard className="bg-primary text-white rounded-3">
                        <MDBCardBody>
                          <div className="d-flex justify-content-between align-items-center mb-4">
                            <MDBTypography tag="h5" className="mb-0">
                              Order summary
                            </MDBTypography>
                          </div>
                          <hr />

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Subtotal.</p>
                            <p className="mb-2">Rs. {subtotal}</p>
                          </div>

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Shipping Cost.</p>
                            <p className="mb-2">Rs. {shipping}</p>
                          </div>

                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Total.</p>
                            <p className="mb-2">Rs. {total}</p>
                          </div>
                         
                          <Button style={{ backgroundColor: '#2596be' }} onClick={handleCheckout}>Checkout</Button>
                          {error && <div style={{ color: 'red', fontWeight: '500' }}>{error}</div>}
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>


    </>
  );
}
export default Cart;