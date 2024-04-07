import React, {useState, useEffect } from 'react';
import AdminNavbar from './adminNavbar';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { Chart }            from 'react-chartjs-2';
import Card from 'react-bootstrap/Card';
function Anaylsis(){
  const[highestProduct,setHighestProduct]=useState([]);
  const[overall,setOverall]=useState([]);
  const[image,setImage]=useState([]);
  const [imageURL, setImageURL] = useState(null);
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
    return(
        <>
            <div className='d-flex'>

   
                <div>
                <AdminNavbar/>
                </div>
                <div style={{ marginLeft: '250px' }}>
                    <h2 style={{ marginTop: '20px',color:'#b3b7b8'}}>Analytics</h2><hr/>
                    
                   <Card style={{padding:"20px",backgroundColor:"#f5f5f5",marginTop:'50px'}}>
                    <Card.Title style={{color:'#33bcde',fontSize:'16px'}}>Number of Orders per Day</Card.Title>
                    {orderData.datasets[0].data.length > 0 ? (
                        <Line data={orderData} options={options}style={{ width: '600px', height: '400px' }}  />
                    ) : (
                        <p>Loading...</p>
                    )}
                    </Card>
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
                </div>
            </div>
        </>
    );
}
export default Anaylsis;
