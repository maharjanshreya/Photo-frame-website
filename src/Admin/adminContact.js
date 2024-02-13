import React ,{useState,useEffect}from 'react';
import AdminNavbar from './adminNavbar';
import axios from 'axios';
function Contact(){
    const [reports, setReports] = useState([]);
    useEffect(() => {
        // Define the URL of your API endpoint
        const apiUrl = 'report'; // Replace with the actual endpoint
    
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
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, []); 
    return(
        <>
            <div className='d-flex'>

   
                <div>
                <AdminNavbar/>
                </div>
                <div style={{marginLeft:'250px'}}>
                    <p style={{marginLeft:'250px'}}>this is contact rating page </p>
                    {reports.map((report) => (
                    <li key={report._id}>
                        sds<strong>{report.title}</strong>: {report.description}
                    </li>
                    ))}
                </div>
                </div>
        </>
    );
}
export default Contact;