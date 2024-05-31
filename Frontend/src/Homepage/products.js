import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar/navbar';
import { useNavigate } from 'react-router-dom';
import Banner from '../Images/productBanner.jpg';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

function Products() {
  const [imageURL, setImageURL] = useState([]);
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('price'); 
  const [sortOrder, setSortOrder] = useState('asc');

  const imageFunc = async (productId) => {
    try {
      const res = await fetch(`/product-image/${encodeURIComponent(productId)}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      const buffer = await res.arrayBuffer();
      const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      return `data:image/png;base64,${base64Image}`;
    } catch (err) {
      console.log('Error in fetching image data', err);
      return null;
    }
  };

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
        throw new Error(res.statusText);
      }

      const data = await res.json();
      setCategoryData(data.categories);
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0]);
      }
    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const res = await fetch(`/category-product/${categoryId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      console.log('Products:', data.products);
      const productIds = data.products.map((item) => item._id);
      const imageURLs = await Promise.all(productIds.map((productId) => imageFunc(productId)));
      setProducts(data.products);
      setImageURL(imageURLs);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    categoryFunc();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory.id);
    }
  }, [selectedCategory]);

  const productView = (productId) => {
    navigate(`/productView/${productId}`, { state: { additionalInfo: "Category" } });
  };

  const sortProducts = (products, images, criteria, order) => {
    const combinedArray = products.map((product, index) => ({
      product,
      image: images[index],
    }));

    combinedArray.sort((a, b) => {
      if (criteria === 'price') {
        return order === 'asc' ? a.product.price - b.product.price : b.product.price - a.product.price;
      } else if (criteria === 'name') {
        return order === 'asc' ? a.product.productName.localeCompare(b.product.productName) : b.product.productName.localeCompare(a.product.productName);
      }
      return 0;
    });

    return {
      sortedProducts: combinedArray.map((item) => item.product),
      sortedImages: combinedArray.map((item) => item.image),
    };
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
    const sortedData = sortProducts(products, imageURL, criteria, sortOrder);
    setProducts(sortedData.sortedProducts);
    setImageURL(sortedData.sortedImages);
  };

  const handleOrderChange = (order) => {
    setSortOrder(order);
    const sortedData = sortProducts(products, imageURL, sortCriteria, order);
    setProducts(sortedData.sortedProducts);
    setImageURL(sortedData.sortedImages);
  };

  return (
    <div>
      <Navbar />
      <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
        <img src={Banner} alt="Background" style={{ width: '100%', height: 'auto' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
          <h2>Frames with aesthetics</h2>
          <p>Considered restwear that feels as good in bed as it looks. Innovative fabrics and functional silhouettes designed to make you rest-ready anytime.</p>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-3">
            <p style={{ fontWeight: '600' }}>Categories</p>
            {categoryData.length > 0 ? (
              <div>
                {categoryData.map((category) => (
                  <ListGroup key={category.id} defaultActiveKey={`#${selectedCategory?.id}`}>
                    <ListGroup.Item
                      action
                      href={`#${category.id}`}
                      onClick={() => setSelectedCategory(category)}
                      active={selectedCategory?.id === category.id}
                      style={{ backgroundColor: selectedCategory?.id === category.id ? 'rgb(170 137 102)' : 'white', color: selectedCategory?.id === category.id ? 'white' : 'black', border: 'none' }}
                    >
                      {category.name}
                    </ListGroup.Item>
                  </ListGroup>
                ))}
              </div>
            ) : (
              <p>No categories found</p>
            )}
          </div>
          <div className="col-md-9">
            <div>
              <label style={{ fontWeight: '600' }}>Sort By:</label>
             
              <Form.Select aria-label="Default select example" onChange={(e) => handleSortChange(e.target.value)} value={sortCriteria}>
               
                <option value="price">Price</option>
                <option value="name">Name</option>
              </Form.Select>
            </div>
            <div>
              <label style={{ fontWeight: '600' }}>Order:</label>
              <Form.Select aria-label="Default select example" onChange={(e) => handleOrderChange(e.target.value)} value={sortCriteria}>
               
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Form.Select>
              
            </div>
            <div className="container mt-4">
              {products.length > 0 && (
                <div>
                  {products.reduce((rows, product, index) => {
                    if (index % 3 === 0) rows.push([]);
                    rows[rows.length - 1].push(product);
                    return rows;
                  }, []).map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                      {row.map((product) => (
                        <div key={product._id} className="col-md-4 mb-4">
                          <div className="list-group-item">
                            {imageURL && imageURL[products.indexOf(product)] && (
                              <img
                                src={imageURL[products.indexOf(product)]}
                                alt={`Product Image ${products.indexOf(product) + 1}`}
                                style={{ width: '193px', height: '220px', marginBottom: '10px' }} onClick={() => productView(product?._id)}
                              />
                            )}
                            <br />
                            {product.productName}
                            <br />
                            {product.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
