import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';

function Notification() {
  const [notification, setNotification] = useState([]);
    
    const fetchReportData = async () => {
        try {
          // Retrieve user ID from local storage or wherever it's stored
          const userId = localStorage.getItem('userId');
      
          if (!userId) {
            console.error('User ID not found');
            return;
          }
      
          // Include user ID in request headers
          const response = await fetch(`report/reply/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setNotification(data);
          console.log('Notification: ', notification);
        } catch (error) {
          console.error('Error fetching Notification:', error);
        }
      };

  useEffect(() => {
    fetchReportData();
  }, []);

  return (
    <>
      <Navbar />
      This is notification
    </>
  );
}

export default Notification;
