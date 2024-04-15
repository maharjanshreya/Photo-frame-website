import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
function PostProduct({ refreshProductList }) {
  const [categoryData, setCategoryData] = useState([]);

  const categoryFunc = async () => {
    try {
      const res = await fetch('/category', {
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
      console.log("Datas.data", datas.categories);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    categoryFunc();

  }, []);
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    image: "",
    category: "",
    price: "",
    quantity: "",
    size: "",
    dimension: "",
    shipping: "",
    minDelivery: "",
    maxDelivery: "",
  });

  let name, value, file;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    file = e.target.files;
    setProduct({ ...product, [name]: name === 'image' ? file[0] : value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", product.productName);
    formData.append("description", product.description);
    formData.append("image", product.image); // Assuming product.image is a file input
    formData.append("price", product.price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);
    formData.append("size", product.size);
    formData.append("dimension", product.dimension);
    formData.append("shipping", product.shipping);
    formData.append("minDelivery", product.minDelivery);
    formData.append("maxDelivery", product.maxDelivery);
    try {
      const res = await fetch("/products", {
        method: "POST",
        credentials: 'include',
        body: formData,

      });


      const data = await res.json();

      if (res.status === 500 || !data) {
        toast.error(data.error);
        console.log("Product already exists");
      } else {
        toast.success("Product added successfully");
        console.log("Product Valid");
        refreshProductList();
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Error during fetch:', error);
    }
  }
  return (<>
    <form onSubmit={handleSubmit}>
      <input type='text' placeholder='Enter product name' name="productName" className='category' required value={product.productName} onChange={handleInputs} />
      <input type='text' placeholder='Product Description' name="description" className='category' required value={product.description} onChange={handleInputs} />
      <input type='file' placeholder='Image' name="image" className='category' required onChange={handleInputs} />
      <input type='number' placeholder='Enter the product quantity' name="quantity" className='category' required value={product.quantity} onChange={handleInputs} />
      <input type='number' placeholder='Enter the product price' name="price" className='category' required value={product.price} onChange={handleInputs} />
      <select className='category' name='category' required style={{ marginRight: '10px' }} onChange={handleInputs} >
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
                      <input type='text' placeholder='stock' name="stock" className='category'  required value={category.name} onChange={handleInputs}/>*/}
      <input type='text' placeholder='Enter size' name="size" className='category' required value={product.size} onChange={handleInputs} />
      <input type='text' placeholder='Enter dimension' name="dimension" className='category' required value={product.dimension} onChange={handleInputs} />
      <input type='number' placeholder='Minimum Delivery time' name="minDelivery" className='category' required value={product.minDelivery} onChange={handleInputs} />
      <input type='number' placeholder='Maximum Delivery time' name="maxDelivery" className='category' required value={product.maxDelivery} onChange={handleInputs} />

      <input type='number' placeholder='Shipping cost' name="shipping" className='category' value={product.shipping} onChange={handleInputs} />

      {/*<input type='text' placeholder='color options' name="dimension" className='category'  required value={category.name} onChange={handleInputs}/>
                     ratings by users
                      <input type='text' placeholder='ratings' name="ratings" className='category'  required value={category.name} onChange={handleInputs}/>
                    */}<hr />

      <input type='submit' value="Add Product"  /><Toaster position="top-center" reverseOrder={true} />
    </form>
  </>);
}
export default PostProduct;