import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/navbar';
import { CiCalendar } from "react-icons/ci";
import { FaCircle } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
function Notification() {
  const [reports, setReports] = useState([]);

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
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.reports && Array.isArray(data.reports)) {
        setReports(data.reports);
        console.log('Notification: ', data.reports);
      } else {
        console.error('Invalid data structure in API response');
      }

      console.log('Notification: ', data);
    } catch (error) {
      console.error('Error fetching Notification:', error);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatDateString = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Separate reports into two arrays: today's and older based on adminReply creation date
  const today = new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(
    (report) =>
      report.adminReply &&
      Array.isArray(report.adminReply) &&
      report.adminReply.length > 0 &&
      report.adminReply[0] &&
      report.adminReply[0].createdAt &&
      new Date(report.adminReply[0].createdAt).toISOString().split('T')[0] === today
  );
  
  const olderReports = reports.filter(
    (report) =>
      report.adminReply &&
      Array.isArray(report.adminReply) &&
      report.adminReply.length > 0 &&
      report.adminReply[0] &&
      report.adminReply[0].createdAt &&
      new Date(report.adminReply[0].createdAt).toISOString().split('T')[0] !== today
  );
  const formatTimeString = (dateString) => {
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
  
    return new Date(dateString).toLocaleTimeString('en-US', options);
  };
  return (
    <>
      <Navbar />
  
      <div style={{ margin: '40px' }}>
        <h3>Today</h3>
        {Array.isArray(todayReports) && todayReports.length > 0 ? (
          todayReports.map((report, index) => (
            <div key={index} className='section-notify-today'>
              
            
              <div>
                <FaCircle color='#57C0EB' style={{marginRight:'7px',boxShadow:'0 0 5px rgba(0, 0, 0, 0.3)',background:'transparent',borderRadius:'50%'}}/><strong>Admin</strong> replied to your report: <strong>{report.title}</strong>  
                {report.adminReply.map((reply, replyIndex) => (
                  <div key={replyIndex} style={{paddingLeft:'25px', fontFamily:'fenix', color:'#4B4B4B'}}>
                    <p>
                      {reply && reply.replyText !== null && reply.replyText !== undefined
                        ? 
                        <>
                          <p>{reply.replyText}</p>
                          <p style={{color:'gray',fontSize:'14px'}}><IoTimeOutline />{formatTimeString(reply.createdAt)}</p>
                          
                        </>


                        : 'No reply text available'}
                    </p>
                    {/* Add any styling or additional content for each reply */}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No reports available for today.</p>
        )}
  
        <div style={{ marginTop: '40px' }}>
          <h3>This week</h3>
          {Array.isArray(olderReports) && olderReports.length > 0 ? (
            olderReports.map((report, index) => (
              <div key={index} className='section-notify'>
                <p>Title: {report.title}</p>
                <p>Created At: {formatDateString(report.adminReply[0].createdAt)}</p>
  
                <div>
                  <strong>Admin replies: </strong>
                  {report.adminReply.map((reply, replyIndex) => (
                    <div key={replyIndex}>
                      <p>
                        {reply && reply.replyText !== null && reply.replyText !== undefined
                          ? reply.replyText
                          : 'No reply text available'}
                      </p>
                      {/* Add any styling or additional content for each reply */}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No older reports available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Notification;
