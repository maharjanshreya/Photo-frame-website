import React, { useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
const UpdateProduct = ({ productId, onClose, refreshProductList }) => {
    console.log("update product: ", productId);
    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
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
          
        const datas = await res.json();
        console.log('API Response:', datas); 
        setCategoryData(datas.categories);
        console.log("Datas.data",datas.categories);
      
        } catch (err) {
          console.log('Error in fetching data', err);
        }
        };

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
            console.log("Hello product data",datas.product);
          
            } catch (err) {
              console.log('Error in fetching data', err);
            }
        };
            
        useEffect(()=>{
          categoryFunc();
          productFunc();
    
        }, []);
    const [updates, setUpdates] = useState({
        productName: '',
        description: '',
        image: '',
        price: '',
        quantity: '',
        category: '',
        size: '',
        dimension: ''
    });
    let name,value,file;
    const handleInputChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        file = e.target.files;
      
        setUpdates({...updates, [name]:name === 'image' ? file[0] : value});
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            // Append each field from updates to the FormData object
            for (const key in updates) {
                formData.append(key, updates[key]);
            }
            const response = await fetch(`/product-update/${encodeURIComponent(productId)}`, {
                method: 'PUT',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const updatedProduct = await response.json();
            console.log('Product updated:', updatedProduct);
            // Call refreshCategoryList to fetch the updated product list
            refreshProductList();
            onClose();
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <>
        <div className='formedit'>
            <form onSubmit={handleFormSubmit} >
              <label>Product name:</label>
                <input type='text' placeholder='Enter product name' name="productName" className='category'  required value={updates.productName || productData.productName} onChange={handleInputChange}/>
                <label>Description:</label>
                <input type='text' placeholder='Product Description' name="description" className='category'  required value={updates.description || productData.description} onChange={handleInputChange}/>
                <label>Select image:</label>
                <input type='file' placeholder='Image' name="image" className='category'  required  onChange={handleInputChange}/>
                <label>Quantity:</label>
                <input type='number' placeholder='Enter the product quantity' name="quantity" className='category'  required value={updates.quantity || productData.quantity} onChange={handleInputChange}/>
                <label>Price:</label>
                <input type='number' placeholder='Enter the product price' name="price" className='category'  required value={updates.price || productData.price} onChange={handleInputChange}/>
                <select className='category' name='category' required style={{marginRight:'10px'}} onChange={handleInputChange} >
                                        <option>Select the category name</option>
                                        {/* fetch the data */}
                                        {
                                            categoryData.map((row) => (
                                            <option key={row.id} value={row.id}>
                                            {row.name} 
                                            </option>                                      
                                        ))}
                                    </select>
                      {/*Dropdown menu : out of stock or stock
                      <input type='text' placeholder='stock' name="stock" className='category'  required value={category.name} onChange={handleInputChange}/>*/}
                       <label>Size:</label>
                      <input type='text' placeholder='size' name="size" className='category'  required value={updates.size || productData.size} onChange={handleInputChange}/>
                      <label>Dimension:</label>
                      <input type='text' placeholder='dimension' name="dimension" className='category'  required value={updates.dimension || productData.dimension} onChange={handleInputChange}/>
                <Button type='submit' className='meterButtons' style={{backgroundColor: '#0d6efd', width:'100%'}}>Save details</Button><br/>
            </form>
        </div>
        </>
    );
};

export default UpdateProduct;
