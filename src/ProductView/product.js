import {React,useState,useEffect} from 'react';
import Navbar from '../Navbar/navbar';
import { useParams } from 'react-router-dom';
import { CiStar } from "react-icons/ci";
import './product.css';
function Product(){
    const { productId } = useParams();
    const [productData, setProductData] = useState([]);
    const [imageURL, setImageURL] = useState(null);
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
        console.log('API Response in products:', datas); 
        setProductData(datas.product);
        console.log("Datas.data",datas.product);
      
        } catch (err) {
          console.log('Error in fetching data', err);
        }
    };
    

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

    useEffect(()=>{
        productFunc();
        imageFunc();
    }, []);
    const starStyle = { color: '#B8930F', size: 30, fill: '#B8930F' };  
    return(<>
        <Navbar />
       
        <div className='product-single'>
        
        <div className=''>
            <div className='image-product'>
                {imageURL && <img src={imageURL} alt="Product Image" style={{ width: '400px', height: '450px' }}/>}

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
                        <p style={{fontWeight:'600'}}>Available({productData.quantity})</p>


                    </div>
                )}
            </div>
        </div>
        </div>

    </>);
}
export default Product;