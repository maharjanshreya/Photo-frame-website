import React, { useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { CategoryGetApi } from '../Components/categoryApi';
const UpdateProduct = ({ productId, onClose, refreshProductList }) => {
    console.log("update product: ", productId);
    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const categoryFunc = async () => {
        try {
          
          
        const datas = await CategoryGetApi();
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
            
          
            } catch (err) {
              console.log('Error in fetching data', err);
            }
        };
            
        useEffect(()=>{
          categoryFunc();
          productFunc();
    
        }, []);
        useEffect(() => {
          // Initialize updates state after productData is set
          setUpdates({
              productName: productData.productName || '',
              description: productData.description || '',
              image: productData.image || '',
              category: productData.category || '',
              shipping: productData.shipping || '',
              price: productData.price || '',
              quantity: productData.quantity || '',
              size: productData.size || '',
              border: productData.border || '',
              minDelivery: productData.minDelivery || '',
              maxDelivery: productData.maxDelivery || '',
          });
      }, [productData]);
      const [updates, setUpdates] = useState({
        productName: '',
        description: '',
        image: "",
        category: '',
        shipping: '',
        price: '',
        quantity: '',
        size: '',
        border: '',
        minDelivery: '',
        maxDelivery: '',
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
                toast.error('Product not updated.');
            }

    
            const updatedProduct = await response.json();
            if(response===201){
                 toast.success('Product Updated Successfully.');
            }
           
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
                <input type='text' placeholder='Enter product name' name="productName" className='category'   value={updates.productName} onChange={handleInputChange}/>
                <label>Description:</label>
                <input type='text' placeholder='Product Description' name="description" className='category'   value={updates.description || '' } onChange={handleInputChange}/>
                <label>Select image:</label>
                <input type='file' placeholder='Image' name="image" className='category'    onChange={handleInputChange}/>
                <label>Quantity:</label>
                <input type='number' placeholder='Enter the product quantity' name="quantity" className='category'   value={updates.quantity || ''} onChange={handleInputChange}/>
                <label>Price:</label>
                <input type='number' placeholder='Enter the product price' name="price" className='category'   value={updates.price || ''} onChange={handleInputChange}/>
                <select className='category' name='category'  style={{marginRight:'10px'}} onChange={handleInputChange} >
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
                      <input type='text' placeholder='stock' name="stock" className='category'   value={category.name} onChange={handleInputChange}/>*/}
                       <label>Size:</label>
                      <input type='text' placeholder='size' name="size" className='category'   value={updates.size || '' } onChange={handleInputChange}/>
                      <label>Border:</label>
                      <input type='text' placeholder='border' name="border" className='category'   value={updates.border || ''} onChange={handleInputChange}/>
                      <label>Shipping:</label>
                      <input type='number' placeholder='Shipping' name="shipping" className='category'   value={updates.shipping || ''} onChange={handleInputChange}/>
                      <label>Min delivery date:</label>
                      <input type='number' placeholder='Min delivery date' name="minDelivery" className='category'   value={updates.minDelivery || ''} onChange={handleInputChange}/>
                      <label>Max delivery date:</label>
                      <input type='number' placeholder='Max delivery date' name="maxDelivery" className='category'   value={updates.maxDelivery || ''} onChange={handleInputChange}/>
                     
                <Button type='submit' className='meterButtons' style={{backgroundColor: '#0d6efd', width:'100%'}}>Save details</Button><br/>
            </form> <Toaster position="top-center" reverseOrder={true} />
        </div>
        </>
    );
};

export default UpdateProduct;
