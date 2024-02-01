import { useState } from 'react';
import Navbar from '../Navbar/navbar';
import { useSearch } from '../context/search';

import { useNavigate } from "react-router-dom";
function SearchPage(){
    const[values] = useSearch();
    const navigate = useNavigate();
    console.log('Search Results Found: ', values.results ? values.results.length : undefined);
    const productView = (productId) =>{
      
        navigate(`/productView/${productId}`);
    }
  
    return(<>
    <Navbar />
    <div className='search-container'>
        <h1>Search</h1>
        <h3 className='found-text'>
            
            {values?.results?.length <1  
            ? 'No products found'
            : `Found ${values?.results?.length}`
            }

        </h3>
        <hr />
        <div className='d-flex justify-content-between product-homepage'>
            {values?.results.map((row) => (

                <div key={row?._id}>
                    <img
                        src={`/product-image//${row._id}`} // Update with your actual backend URL and endpoint
                        alt="Product Image"
                        className="center"
                        height={300}
                        width={250} onClick={() =>productView(row?._id)}
                    />
                    <div className='product-name'>
                      <div style={{width:'200px',marginRight:'20px'}}>
                        <p className=''>{row?.productName}</p>
                      </div>
                      
                    </div>
                    <div className='d-flex'>
                     <div><p className='price' style={{marginRight:'155px'}}>Rs. {row?.price}</p>
                      </div>
                    <div>
                      
                    </div> </div>

                </div>
                ))}
                
            </div>
       
    </div>
    </>);
};
export default SearchPage;