import React, {useEffect, useState } from 'react';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
function Products(){
    const [categoryData, setCategoryData] = useState([]);

    const categoryFunc = async () => {
        try {
           const res = await fetch('/category',  {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
       
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
      
          const data = await res.json();
          setCategoryData(data);
          console.log(data);
      
        } catch (err) {
          console.log('Error in fetching data', err);
        
        }
      };
      
    useEffect(()=>{
        categoryFunc();

    }, []);
    return(
        <div>
            <Navbar/>
            <h1 className="text-center mt-5">Products</h1>
            
                {categoryData.length > 0 ? (
        <div>
          {categoryData.map((category) => (
            <h3
              key={category._id}
              className="text-center"
              style={{
                color: '#ECB800',
                fontFamily: 'Poppins',
                fontWeight: 'bolder',
              }}
            >
              {category}{' '}!
            </h3>
          ))}
        </div>
      ) : (
        <p>No categories found</p>
      )}
        </div>
    );

}
export default Products;