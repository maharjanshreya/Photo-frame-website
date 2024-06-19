import { React, useEffect, useState } from 'react';
import {MyAccount} from '../Components/myAccount';
import AdminLayout from './admin';
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function AdminAccount(){
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [updates, setUpdates] = useState({
        firstname: userData.firstname || '',
        lastname: userData.lastname || '',
        email: userData.email || '',
        contact: userData.contact || '',
      });
      let name, value;
      const handleInputChange = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUpdates({
          ...updates,
          [name]: value,
        });
      };
    const callMyAccount = async () => {
        try {
          const data = await MyAccount();
          setUserData(data);
        } catch (err) {
          console.log('Error in fetching data', err);
          navigate('/login', { replace: true });
        }
      };
      useEffect(() => {
        callMyAccount();
    
      }, [userData]);
      const handleFormSubmit = async (event) => {
        event.preventDefault();
        let updatedUpdates = { ...updates };
    
        // Check if any field is left empty and set default values
        if (!updatedUpdates.firstname) {
          updatedUpdates.firstname = userData.firstname || '';
        }
        if (!updatedUpdates.lastname) {
          updatedUpdates.lastname = userData.lastname || '';
        }
        if (!updatedUpdates.email) {
          updatedUpdates.email = userData.email || '';
        }
        if (!updatedUpdates.contact) {
          updatedUpdates.contact = userData.contact || '';
        }
        try {
          const response = await fetch(`https://photo-frame-website.onrender.com/user-update/${encodeURIComponent(userId)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUpdates),
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
    
          const updatedUser = await response.json();
          toast.success('Account Updated Successfully.');
          callMyAccount();
    
        } catch (error) {
          console.error('Error:', error.message);
        }
      };
    
    
    return(
            <AdminLayout>
          <div>
            <h1>My Account</h1>
            <div className="row">
                  <div className="col-auto">
                    <MdOutlineSupervisorAccount color='green' />
                  </div>
                  <div className="col">
                    <p>General Info</p>
                  </div>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstname" className="form-label">First Name</label>
                      <input type="text" className="form-control" id="firstname" name="firstname" value={updates.firstname || (userData && userData.firstname)} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastname" className="form-label">Last Name</label>
                      <input type="text" className="form-control" id="lastname" name="lastname" value={updates.lastname || (userData && userData.lastname)} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input type="email" className="form-control" id="email" name="email" value={updates.email || (userData && userData.email)} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contact" className="form-label">
                      Contact
                    </label>
                    <input type="text" className="form-control" id="contact" name="contact" value={updates.contact || (userData && userData.contact)} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    {/*<input type="password" className="form-control" id="password" /> */}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                </form>
                <Toaster position="top-center" reverseOrder={true} />
        </div>
        </AdminLayout>
    );
}
export default AdminAccount;