import {React,useState,useEffect} from 'react';
import Navbar from '../Navbar/navbar';
import { useParams } from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import './product.css';
import Button from 'react-bootstrap/Button';
import { MdCheck } from "react-icons/md";
import Cart from '../ProductView/cart';
import { useAuth } from '../context/token';
import axios from 'axios';
import Image from '../Homepage/image';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
let product_id = null;

function Product(){
    const { productId } = useParams();
    const [productData, setProductData] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [quantity, setQuantity] = useState(productData.quantity);
    const productFunc = async () => {
        try {
          const res = await fetch(`/products/${encodeURIComponent(productId)}`,  {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
          
        const datas = await res.json();
        //console.log('API Response in products:', datas); 
        setProductData(datas.product);
        product_id = datas.product._id; // Set product_id here
        setQuantity(datas.product.quantity); // Reset quantity
        //console.log("Datas.data",datas.product);
      
        } catch (err) {
          console.log('Error in fetching data', err);
        }
    };
    //const [product_id, setProduct_Id] = useState(productData._id);
    
    const handleCart = ()=>{
      //setProduct_Id(p_id);
      if (product_id) {
      addToCart();
    }
    }
    
    
    const imageFunc = async () => {
        try {
          const res = await fetch(`/product-image/${encodeURIComponent(productId)}`  ,  {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const error = new Error(res.statusText);
          throw error;
        }
          
         // Read the binary data as an ArrayBuffer
         const buffer = await res.arrayBuffer();

         // Convert the ArrayBuffer to a base64 string
         const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

         // Set the base64 string as the image source
         setImageURL(`data:image/png;base64,${base64Image}`);
        
      
        } catch (err) {
          console.log('Error in fetching image data', err);
        }
    }; 
    const addToCart = async () => {
      const data = {
        userId: userData.userId,
        items: [
          {
            productId: product_id,
            quantity: quantity,
          },
        ],
      };
      try {
          const response = await axios.post('/add-to-cart', data);
          toast.success('Item added to cart!');
        //  console.log("cart: ",response.data);
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      };
      const [userData, setUserData] = useState({userId:""});

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
          setUserData({...userData, userId: data._id});
         // console.log(data);
      
        } catch (err) {
          console.log('Error in fetching data', err);
          
        }
      };
      useEffect(() => {
        // Ensure product_id is not null or undefined
        if (product_id) {
          // Use the latest state value when calling addToCart
          addToCart();
        }
      }, [product_id]);

    useEffect(()=>{   
        productFunc();
        imageFunc();
        userContact();
        
    }, [product_id]);
    const starStyle = { color: '#B8930F', size: 30, fill: '#B8930F' };  
    return(<>
        <Navbar />
       
        <div className='product-single'>
        
        <div className=''>
        <div className='image-product'>
          <div className='image-overlay'>
            {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }} />}
          </div>
          <Image />
        </div>
            <div>
            
                {productData && (
                    <div>
                        <h3 className='product-names'>{productData.productName}</h3>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CiStar key={index} style={starStyle} />
                        ))}
                        <p className='price-single-product'>Rs. {productData.price}</p>
                        <hr style={{paddingRight:'60px'}}/>
                        <p style={{textAlign:'justify'}}>{productData.description}</p>
                    
                        {productData.category && (
                            <p> <span style={{fontWeight:'600'}}>Category: </span>{productData.category.name}</p>
                        )}

                        
                        
                        <p style={{fontWeight:'600'}}>Size: {productData.size}</p>
                        
                        <p style={{fontWeight:'600'}}>Dimension: {productData.dimension}</p>
                        <p style={{ fontWeight: '600' }}>
                          {productData.quantity > 0 ? `Available(${productData.quantity})` : <span style={{color:'red', fontWeight:'800'}}>Out of Stock</span>}
                        </p>
                        <button className='add-to-cart' onClick={(e) =>{e.preventDefault();handleCart();}}>Add To Cart</button>
                        
                    </div>
                )}<Toaster
                          position="top-center"
                          reverseOrder={true}
                        />
            </div>
        
        </div>
        </div>

    </>);
}
export default Product;