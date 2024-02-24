import React, { useState, useEffect } from 'react';
import AdminNavbar from './adminNavbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { CiSearch } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { FaReply } from "react-icons/fa";

function Contact() {
  const [reports, setReports] = useState([]);
  const [userData, setUserData] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' for ascending, 'desc' for descending
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeFormId, setActiveFormId] = useState(null);
  const createdAt = new Date().toISOString();
  const handleButtonClick = (reportId) => {
   
     setActiveFormId((prevId) => (prevId === reportId ? null : reportId));
  };
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
          reportId,
          replyText,
          createdAt,
          }),
          credentials: 'include', // Add this line
      });
      
      if (!response.ok) {
        throw new Error('Failed to send reply');
      }
      fetchReportData();
        // After successfully sending the reply, reset the active form
        setActiveFormId(null);

        // Reset the replyText state
        setReplyText('');
      // Handle success, update UI or state accordingly
      console.log('Reply sent successfully');
      setReplyText('');
    } catch (error) {
      // Handle error, show error message, or retry logic
      console.error('Error sending reply:', error.message);
    }
  };
  const fetchReportData = async () => {
    try {
      const response = await fetch('report');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setReports(data);

      // Fetch user data for each user ID
      const userIds = data.map((report) => report.user);
      Promise.all(userIds.map((userId) => fetch(`account/${userId}`).then((response) => response.json())))
        .then((userData) => {
          setUserData(userData);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchReportData();
    
      
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
            <div className="d-flex align-items-center" style={{ marginBottom: '20px' }}>
              <div className=" flex-grow-1 ">
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
              <div className="d-flex align-items-center" style={{ marginLeft: '10px' }}>
                <label style={{ marginRight: '5px' }}>
                  Sort:
                </label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="createdAt">Date</option>
                  <option value="title">Title</option>
                  <option value="description">Description</option>
                </Form.Select>
              </div>
              <div className="ml-2">
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
                {Array.isArray(report.adminReply) && report.adminReply.length > 0 && (
                <div>
                  <strong>Admin replies: </strong>
                  {report.adminReply.map((reply, index) => (
                    <div key={index}>
                      {reply && reply.replyText && <p>{reply.replyText}</p>}
                      {/* Add any styling or additional content for each valid reply */}
                    </div>
                  ))}
                </div>
              )}
                <CiCalendar /> {new Date(report.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}<br/>
                <Button variant="secondary" style={{marginTop:'6px',marginBottom:'6px'}} onClick={() => handleButtonClick(report._id)}><FaReply style={{marginRight:'6px'}} />Reply</Button>
                {activeFormId === report._id && (
                  <form>
                    <Form.Control as="textarea" rows={3} placeholder="Reply back to user" onChange={(e) => setReplyText(e.target.value)} />
                    <Button variant="success" name="replies" type="submit" style={{ marginTop: '10px' }} onClick={(e) => sendReplyToServer(e, report._id)}>
                      Submit
                    </Button>
                  </form>
                )}
              </p>
            ))}

          </div>
        </div>
      </div>
    </>
  );
}
export default Contact;