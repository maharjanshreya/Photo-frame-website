import Navbar from '../Navbar/navbar';
import { React, useEffect, useState } from 'react';
import './product.css';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { loadStripe } from '@stripe/stripe-js';
import {MDBCard,MDBCardBody,MDBCardImage,MDBCol,MDBContainer,MDBIcon,MDBRow,MDBTypography,} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import { useCart } from '../context/cart';
import Map from '../ProductView/map';
let total = 0;
function Cart() {
 
  const [error, setError] = useState('');
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({ cart: { items: [] } });
  const [imageURL, setImageURL] = useState(null);
  const userId = localStorage.getItem('userId');
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);

  const getCart = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found');
        navigate('/login', { replace: true });
      }

      const res = await fetch(`/add-to-cart/${encodeURIComponent(userId)}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const datas = await res.json();
      setCartData(datas);
     // console.log("cart data quantity ", datas);
      setCart(datas.cart.items.length);
      console.log(datas.cart);
      //console.log("cart data for image",datas.cart.items[0].productId._id);
      //console.log("cardData",cartData);
      //console.log("Items length in cart: ",datas.cart.items.length);
      if (datas.cart.items && datas.cart.items.length > 0) {
        const imagePromises = datas.cart.items.map(async (item) => {
          try {
            const imageRes = await fetch(`/product-image/${encodeURIComponent(item.productId._id)}`, {
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
            console.error(error.message);
            return null;
          }
        });

        const resolvedImages = await Promise.all(imagePromises);     // Resolve all image promises
        const filteredImages = resolvedImages.filter((image) => image !== null);   // Filter out any null values from failed requests
        setImageURL(filteredImages);
      }
    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };
  // product delete from user cart
  const handleRemoveCart = async (_id) => {
    // console.log('The product name to be deleted is ' + _id);
    try {
      // Make an API call to delete the categoryuserData.userId
      const response = await fetch(`/remove-item/${encodeURIComponent(userId)}/${encodeURIComponent(_id)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        try {
          const updatedCart = await fetch(`/add-to-cart/${encodeURIComponent(userId)}`, {
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
       
      // Load Stripe.js
      const stripe = await loadStripe('pk_test_51OyOhcA4uLHwNxGYlwqMkbqvF6QOd73m6MqORxnhF54D3fXLO9Fz2D3ZrGd0Cc8dyQtvkZDKC6wh53uxEC0ZYiOb00xGrm5KBV');

      console.log("Cart data", cartData.cart.items);

      // Prepare request body
      const body = {
        products: cartData.cart.items,
        
      };

      // Prepare request headers
      const headers = {
        'Content-Type': 'application/json',
      };

      const response = await fetch('/create-checkout-session', {
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
    // Calculate shipping cost
    let shippingCost = 0;
    cartData.cart.items.forEach(item => {
        // Add shipping cost of each item to the total
        shippingCost += item.productId.shipping;
    });
    
    // Calculate total (subtotal + shipping cost)
    const totalValue = subtotal + shippingCost; // Adding 20 for additional costs
    setTotal(totalValue);
    setShipping(shippingCost);
  }, [userId, cartData]);


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

                          <p className="mb-0">You have {cartData?.cart?.items.length || 0} items in your cart</p>
                        </div>
                        <div>
                          <p>
                            <span className="text-muted">Sort by:</span>
                            <ul><a href="#!" className="text-body">
                              price
                              <FaAngleDown fas icon="angle-down mt-1" />
                            </a></ul>

                          </p>
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
                                      </div>
                                      <div className="ms-4">
                                        <MDBTypography tag="h5">
                                          {item.productId.productName}
                                        </MDBTypography>
                                        <p className="small mb-0">Size: {item.size}</p>
                                      </div>
                                    </div>
                                    <div className="d-flex flex-row align-items-center">
                                      <div style={{ width: "50px" }}>
                                        <MDBTypography tag="h5" className="fw-normal mb-0">
                                          {item.quantity}
                                        </MDBTypography>
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
                          <div className="d-flex justify-content-between">
                            <p className="mb-2">Shipping address.</p>
                            {/* <Map /> */}
                            
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