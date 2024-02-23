import React, { useState, useEffect } from 'react';
import AdminNavbar from './adminNavbar';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { CiSearch } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
function Contact() {
  const [reports, setReports] = useState([]);
  const [userData, setUserData] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const sendReplyToServer = async (event, reportId) => {
    console.log("repl text in frontend: ",replyText);
    event.preventDefault();
    try {
      const response = await fetch('/report/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: reportId,
          adminReply: replyText,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reply');
      }
  
      // Handle success, update UI or state accordingly
      console.log('Reply sent successfully');
      setReplyText('');
    } catch (error) {
      // Handle error, show error message, or retry logic
      console.error('Error sending reply:', error.message);
    }
  };
  useEffect(() => {
    const apiUrl = 'report'; 
    
    // Fetch the data from the API
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Update the state with the fetched data
        setReports(data);
        console.log("data",data);
        // Extract user IDs from reports
        const userIds = data.map((report) => report.user);
       
         // Fetch user data for each user ID
         Promise.all(userIds.map((userId) => fetch(`account/${userId}`).then((response) => response.json())))
         .then((userData) => {
           setUserData(userData);
           console.log("User data: ",userData);
         })
         .catch((error) => {
           console.error('Error fetching user data:', error);
         });
     })

      .catch((error) => {
        console.error('Error fetching data:', error);
      });
      
  }, []);
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedReports = filteredReports.sort((a, b) => {
    const sortOrder = sortDirection === 'asc' ? 1 : -1;

    if (sortBy === 'title') {
      return a.title.localeCompare(b.title) * sortOrder;
    } else if (sortBy === 'description') {
      return a.description.localeCompare(b.description) * sortOrder;
    } else if (sortBy === 'createdAt') {
      return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
    }

    return 0; // Default to no sorting
  });
  const toggleSortDirection = () => {
    setSortDirection((prevSortDirection) => (prevSortDirection === 'asc' ? 'desc' : 'asc'));
  };
  return (
    <>
      <div className='d-flex'>
        <div>
          <AdminNavbar />
        </div>
        <div style={{ marginLeft: '250px', marginTop: '30px', marginRight: '80px', width: '100%' }}>
          <div className='report'>
            <h1 >Report by users </h1>
            <hr />
            <div class="d-flex align-items-center" style={{ marginBottom: '20px' }}>
              <div class=" flex-grow-1 ">
                <InputGroup className="mb-1">
                  <InputGroup.Text id="inputGroup-sizing-default">
                    <CiSearch />
                  </InputGroup.Text>
                  <Form.Control
                    aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" placeholder='Search' className='searchBar'  value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
              </div>
              <div class="d-flex align-items-center" style={{ marginLeft: '10px' }}>
                <label style={{ marginRight: '5px' }}>
                  Sort:
                </label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="createdAt">Date</option>
                  <option value="title">Title</option>
                  <option value="description">Description</option>
                </Form.Select>
              </div>
              <div class="ml-2">
                <Button style={{ marginLeft: '10px' }} onClick={toggleSortDirection}>
                  {sortDirection === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                </Button>
              </div>
            </div>
            {sortedReports.map((report,index) => (
              <p key={report._id} className='report-section'>
                <span style={{color:'gray'}}>From: {userData[index]?.email}  </span><br/>
                <strong>Title: </strong>{report.title}<br />
                <strong>Description: </strong> {report.description}<br />
                {report.adminReply && report.adminReply.length > 0 && (
                <div>
                  <strong>Report replies: </strong>
                  {report.adminReply.map((reply, index) => (
                    <div key={index}>
                      <p>{reply}</p>
                      {/* Add any styling or additional content for each reply */}
                    </div>
                  ))}
                </div>
              )}
                <CiCalendar /> {new Date(report.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}<br/>
                Reply back:
                <form>
                  <Form.Control as="textarea" rows={3} placeholder="Reply back to user" onChange={(e) => setReplyText(e.target.value)} />
                  <Button variant="primary" name="replies" type="submit" style={{ marginTop: '10px' }} onClick={(e) => sendReplyToServer(e, report._id)}>
                    Submit
                  </Button>
                </form>

              </p>
            ))}

          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;