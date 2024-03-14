import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import './product.css';
import axios from 'axios';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import {
MDBBtn,
MDBCard,
MDBCardBody,
MDBCardImage,
MDBCol,
MDBContainer,
MDBIcon,
MDBInput,
MDBRow,
MDBTypography,
} from "mdb-react-ui-kit";
import { MdDelete } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";

import { useCart } from '../context/cart';
function Cart(){
    const { cart,setCart } = useCart();
    
    const [userData, setUserData] = useState({userId:""});
    const [cartData, setCartData] = useState({ cart: { items: [] } });
    const [vat, setVa] = useState([]);
    
    const [imageURL, setImageURL] = useState(null);
    const userContact = async () => {
      try {
        const res = await fetch('/getData', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
    
        const data = await res.json();
        setUserData((prevUserData) => ({ ...prevUserData, userId: data._id }));
    
      } catch (err) {
        console.log('Error in fetching data', err);
      }
    };
    let va;
    const getCart = async () => {
      try {
        const res = await fetch(`/add-to-cart/${encodeURIComponent(userData.userId)}`,  {
        method: 'GET',
        credentials: 'include',
        });
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
          
        const datas = await res.json();
        setCartData(datas);
        console.log("cart data",datas);
        setCart(datas.cart.items.length);
        console.log("cart data for image",datas.cart.items[0].productId._id);
        console.log("cardData",cartData);
        console.log("Items length in cart: ",datas.cart.items.length);
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
 // Function to handle product deletion
 const handleRemoveCart = async (_id) => {
  console.log('The product name to be deleted is ' + _id);
  try {
    // Make an API call to delete the categoryuserData.userId
    const response = await fetch(`/remove-item/${encodeURIComponent(userData.userId)}/${encodeURIComponent(_id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers as needed (e.g., authentication token)
      },
    });

    if (response.ok) {
      // If deletion is successful, update the state to reflect the changes
      try {
        const updatedCart = await fetch(`/add-to-cart/${encodeURIComponent(userData.userId)}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!updatedCart.ok) {
          throw new Error('Failed to fetch updated cart data');
        }

        const updatedCartData = await updatedCart.json();
        console.log("Deleted successfully");
        // Update the state to remove the deleted category
        setCartData(updatedCartData);
        setCart(updatedCartData.cart.items.length);
    } catch (error) {
        console.error('Error during product deletion', error);
        // Handle error, show a message, etc.
    }
    } else {
      console.error('Failed to delete product messafe');
      // Handle error, show a message, etc.
    }
  } catch (error) {
    console.error('Error during product deletion', error);
    // Handle error, show a message, etc.
  }
};

    
    useEffect(() => {
        getCart();
        userContact();
    }, [userData.userId]); 


  return(
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
                    
                    <p className="mb-0">You have {cartData?.cart?.items.length ||0} items in your cart</p>
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
                        fluid className="rounded-3" style={{ width: "45px" }} alt="Avatar" /> )
                        ))}
                        </div>
                        <div className="ms-4">
                          <MDBTypography tag="h5">
                          {item.productId.productName}
                          </MDBTypography>
                          <p className="small mb-0">1TB, Graphite</p>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center">
                        <div style={{ width: "50px" }}>
                          <MDBTypography tag="h5" className="fw-normal mb-0">
                          {item.quantity}
                          </MDBTypography>
                        </div>
                        <div style={{ width: "88px" }}>
                          <MDBTypography tag="h5" className="mb-0"  style={{color:'red'}}>
                          
                              
                             
                          Rs. {item.quantity * item.productId.price}
                                
                             
                          </MDBTypography>
                        </div>
                        
                       <div style={{ width: "20px" }}> <a href="#!" style={{ color: "#cecece" }}>
                          <MdDelete fas icon="trash-alt" onClick={() => handleRemoveCart(item.productId._id)}/>
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
                        Card details
                      </MDBTypography>
                      
                    </div>

                    <p className="small">Card type</p>
                    <a href="#!" type="submit" className="text-white">
                      <MDBIcon fab icon="cc-mastercard fa-2x me-2" />
                    </a>
                    <a href="#!" type="submit" className="text-white">
                      <MDBIcon fab icon="cc-visa fa-2x me-2" />
                    </a>
                    <a href="#!" type="submit" className="text-white">
                      <MDBIcon fab icon="cc-amex fa-2x me-2" />
                    </a>
                    <a href="#!" type="submit" className="text-white">
                      <MDBIcon fab icon="cc-paypal fa-2x me-2" />
                    </a>

                    <form className="mt-4">
                      <MDBInput className="mb-4" label="Cardholder's Name" type="text" size="lg"
                        placeholder="Cardholder's Name" contrast />

                      <MDBInput className="mb-4" label="Card Number" type="text" size="lg"
                        minLength="19" maxLength="19" placeholder="1234 5678 9012 3457" contrast />

                      <MDBRow className="mb-4">
                        <MDBCol md="6">
                          <MDBInput className="mb-4" label="Expiration" type="text" size="lg"
                            minLength="7" maxLength="7" placeholder="MM/YYYY" contrast />
                        </MDBCol>
                        <MDBCol md="6">
                          <MDBInput className="mb-4" label="Cvv" type="text" size="lg" minLength="3"
                            maxLength="3" placeholder="&#9679;&#9679;&#9679;" contrast />
                        </MDBCol>
                      </MDBRow>
                    </form>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <p className="mb-2">Subtotal</p>
                      <p className="mb-2">$4798.00</p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="mb-2">Shipping</p>
                      <p className="mb-2">$20.00</p>
                    </div>

                    <div className="d-flex justify-content-between">
                      <p className="mb-2">Total(Incl. taxes)</p>
                      <p className="mb-2">$4818.00</p>
                    </div>

                    <MDBBtn color="info" block size="lg">
                      <div className="d-flex justify-content-between">
                        <span>$4818.00</span>
                        <span>
                          Checkout{" "}
                          <i className="fas fa-long-arrow-alt-right ms-2"></i>
                        </span>
                      </div>
                    </MDBBtn>
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