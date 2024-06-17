import { React, useState, useEffect,useRef } from 'react';

import {  useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
function TopRated() {
    const navigate = useNavigate();
    const [topRatedProducts, setTopRatedProducts] = useState([]);
    
    const getAllHighestRatedProduct = async () => {
        try {
            const response = await fetch('/all-highest-rate-product');
            if (!response.ok) {
                throw new Error('Failed to fetch order data');
            }
            const data = await response.json();

            setTopRatedProducts(data.topRatedProducts);

        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };
    const productView = (productId) => {
        navigate(`/productView/${productId}`, { state: { additionalInfo: "Top Rated Products" } });
      }
    useEffect(() => {
   
        getAllHighestRatedProduct();
      }, []);
    return (
        <div>
        <div className="product-container">
          {topRatedProducts.map((product, index) => (
            <div key={index} className="product-item">
              <img
                src={`/product-image//${product.productDetails._id}`}
                alt="Product Image"
                className="center" onClick={() => productView(product.productDetails._id)}
              />
              <p className="">{product.productDetails.productName}</p>
              <p className="">Rs. {product.productDetails.price}</p>
              <ReactStars size={24} edit={false} value={product.averageRating} />
            </div>
          ))}
        </div>
      </div>
      
    );
}
export default TopRated;