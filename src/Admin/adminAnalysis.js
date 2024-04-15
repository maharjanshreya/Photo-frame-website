import React, { useState, useEffect } from 'react';
import AdminNavbar from './adminNavbar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaPlus } from "react-icons/fa6";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
function Anaylsis() {
  const [highestProduct, setHighestProduct] = useState([]);
  const [overall, setOverall] = useState([]);
  const [image, setImage] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [userData, setUserData] = useState([]);
  const options = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 1, // Set the step size to 1 to display only integer values
        }
      }]
    },

  };

  const [orderData, setOrderData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

    datasets: [
      {
        label: 'Number of Orders',
        data: [],
        fill: true, // Set fill to true for area chart
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Set background color for the area
        borderColor: 'rgba(75, 192, 192, 1)', // Set border color for the line
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    fetchOrderData();
    getHighestRatedProduct();
    imageFunc();
    userFunc();
  }, []);

  const fetchOrderData = async () => {
    try {
      const response = await fetch('/view-order');
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      const ordersPerDay = processData(data); // Process fetched data
      updateOrderData(ordersPerDay);
      console.log('Order data:', ordersPerDay);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const getHighestRatedProduct = async () => {
    try {
      const response = await fetch('/highest-rate-product');
      if (!response.ok) {
        throw new Error('Failed to fetch order data');
      }
      const data = await response.json();
      setOverall(data.overallRating);
      setHighestProduct(data.productDetails);
      console.log(data);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  const processData = (data) => {
    const orderCounts = [0, 0, 0, 0, 0, 0, 0];
    data.forEach(order => {
      // Extract the day of the week from the createdAt date
      const createdAtDate = new Date(order.createdAt);
      const dayOfWeek = createdAtDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      // Increment the count of orders for the corresponding day of the week
      orderCounts[dayOfWeek]++;
    });
    return orderCounts;
  };

  const updateOrderData = (ordersPerDay) => {
    // Update the orderData state with the processed data
    setOrderData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: ordersPerDay,
        },
      ],
    }));
  };

  const imageFunc = async () => {
    try {
      const res = await fetch('/highest-rate-product', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }
      const data = await res.json();
      const imageDataArray = new Uint8Array(data.productDetails.image.data.data); // Access the 'data' property of imageDataBuffer
      const buffer = imageDataArray.buffer;

      // Convert the ArrayBuffer to a base64 string
      const base64Image = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));

      // Set the base64 string as the image source
      setImageURL(`data:image/png;base64,${base64Image}`);


    } catch (err) {
      console.log('Error in fetching image data', err);
    }
  };

  const userFunc = async () => {
    try {
      const res = await fetch('/getUser', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const userInfo = await res.json();
      setUserData(userInfo);

    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };
  const [messages, setMessage] = useState({
    userId: "", message: "",
  });
  let name, value;
  const handleInputs = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setMessage({ ...messages, [name]: value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const{userId,message} =messages;
    const res = await fetch("/create-notification", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId,message
        })
    });
    const data = await res.json();
    if(res.status=== 422 || !data){
        window.alert("Invalid Notification");
        console.log("Invalif notification");
      
    }
    else if(res.status=== 404 || !data){
      toast.error(data.message);
     
      console.log("valid notification");

  }
    else{
        window.alert("valid notification");
       
        console.log("valid notification");

    }
}
  return (
    <>
      <div className='d-flex'>
        <div>
          <AdminNavbar />
        </div>
        <div style={{ marginLeft: '250px' }}>
          <h2 style={{ marginTop: '20px', color: 'black' }}>Dashboard</h2><hr />
          <div className='d-flex flex-column align-items-center'>
            <Button variant='warning' className='mb-3 align-self-start'>Add notification</Button>
            <div className='d-flex justify-content-center'>
              <Card style={{ padding: "20px", backgroundColor: "#f5f5f5", marginTop: '50px', marginRight: '10px' }}>
                <Card.Title style={{ color: '#33bcde', fontSize: '16px' }}>Number of Orders per Day</Card.Title>
                {orderData.datasets[0].data.length > 0 ? (
                  <Line data={orderData} options={options} style={{ width: '600px', height: '400px' }} />
                ) : (
                  <p>Loading...</p>
                )}
              </Card>
            </div>
          </div>


          <div>
            {highestProduct ? (
              <div>
                <h2>Highest Rated Product</h2>
                {imageURL && <img src={imageURL} alt="Product" />}
                <p>Name: {highestProduct.productName}</p>
                <p>Rating: {overall}</p>
                {/* Add more details here as needed */}
              </div>
            ) : (
              <p>Loading highest rated product...</p>
            )}
          </div>

          <div>
            <p>Send notification</p>
            <form method='POST' onSubmit={handleSubmit}>
              <select className='' name='userId' required style={{ marginRight: '10px' }} onChange={handleInputs} >
                <option>Select the user name</option>
                {
                  userData.map((row) => (
                    <option key={row._id} value={row._id}>
                      {row.firstname}{row.lastname}
                    </option>
                  ))}
              </select>   <br/>
              <textarea
                name="message"
                id="notification"
                cols="30"
                rows="10" required 
                placeholder="Enter notification message" onChange={handleInputs}
              ></textarea>   <br/>
              <Button type='submit'>Send Notification</Button></form>
              <Toaster position="top-center" reverseOrder={true} />
          </div>

        </div>
      </div>
    </>
  );
}
export default Anaylsis;
