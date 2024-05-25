import Navbar from '../Navbar/navbar';
import { React, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import Button from 'react-bootstrap/Button';
import { MdOutlinePrivacyTip } from "react-icons/md";
import User from '../Images/user.png';
import { RiEditLine } from "react-icons/ri";
import { TbLogout2 } from "react-icons/tb";
import { useUser } from '../context/user';
import Modal from 'react-bootstrap/Modal';
import Warning from '../Images/warning.png';
import OrderPage from '../Profile/myOrders';
import Footer from '../Homepage/footer';
import { MdOutlineSupervisorAccount } from "react-icons/md";
import Report from '../Homepage/report';
function Account() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const userId = localStorage.getItem('userId');
  const handleClose = () => setShow(false);

  const callMyAccount = async () => {
    try {
      const res = await fetch('/account', {
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

      const data = await res.json();
      setUserData(data);
      //console.log(data);

    } catch (err) {
      console.log('Error in fetching data', err);
      navigate('/login', { replace: true });
    }
  };

  useEffect(() => {
    callMyAccount();

  }, [userData]);
  const handleLogout = async () => {
    try {
      const response = await fetch('/logout', {
        method: 'GET',
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        // Handle successful logout on the client side
        localStorage.removeItem('tokens');
        localStorage.removeItem('userId');
        console.log('Logout successful');
        navigate('/login', { replace: true });
      } else {
        // Handle errors or display appropriate messages
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
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
      const response = await fetch(`/user-update/${encodeURIComponent(userId)}`, {
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
      // Call refreshCategoryList to fetch the updated category list
      callMyAccount();

    } catch (error) {
      console.error('Error:', error.message);
    }
  };


  return (
    <>
      <div>
        <Navbar userId={userData && userData._id} />
        <div style={{ margin: '30px' }}>
          <Accordion defaultActiveKey="0" style={{ margin: '30px' }}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Your Profile</Accordion.Header>
              <Accordion.Body>
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
                    <input type="number" className="form-control" id="contact" name="contact" value={updates.contact || (userData && userData.contact)} onChange={handleInputChange}  maxLength="10" />
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
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1" id='orders'>
              <Accordion.Header>Your orders</Accordion.Header>
              <Accordion.Body>
                <OrderPage />

              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2" id="report">
              <Accordion.Header>Report a problem</Accordion.Header>
              <Accordion.Body>
                <div >
                  <Report />
                </div>

              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Help center</Accordion.Header>
              <Accordion.Body>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim id est laborum.
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Privacy and Policy</Accordion.Header>
              <Accordion.Body>
                <div className='privacy'>
                  <p ><MdOutlinePrivacyTip /> Privacy Policy</p>
                  <p>
                    At Saman Photo Frame, we take your privacy seriously. We are committed to protecting the personal information you provide to us. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website.
                  </p><hr />
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>Information We Collect:</p>
                  <p>
                    When you visit our website, we may collect certain information about you, such as your name, email address, shipping address, and payment information. Additionally, we may automatically collect certain information about your device, including your IP address, browser type, and operating system.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>How We Use Your Information:</p>
                  <p >
                    We may use the information we collect from you to process your orders, communicate with you about your orders, and provide you with customer support. Additionally, we may use your information to improve our website and services, personalize your experience, and send you promotional offers and updates.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>Information Sharing:</p>
                  <p>
                    We may share your personal information with third-party service providers who assist us in operating our website, conducting our business, or servicing you. These third parties are obligated to keep your information confidential and are prohibited from using your information for any other purpose.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>Data Security:</p>
                  <p>
                    We take reasonable precautions to protect your information from unauthorized access, use, or disclosure. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee the absolute security of your information.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>Updates to Privacy Policy:</p>
                  <p>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this Privacy Policy periodically for any updates.
                  </p>
                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>Contact Us:</p>
                  <p>
                    If you have any questions or concerns about our Privacy Policy, or if you would like to exercise your rights regarding your personal information, please contact us at 01-438439.
                  </p>
                  <p>
                    By using our website, you consent to the terms of this Privacy Policy.
                  </p>
                </div>

              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <Button  variant="primary" onClick={(e) => {e.preventDefault(); e.stopPropagation(); setShow(true);}} style={{ marginTop: '20px', marginLeft: '30px' }}>
            <TbLogout2 /> Log out
          </Button>
        </div>

        <Footer />
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <div className="modal show" style={{ display: 'block', position: 'initial', padding: 0 }}>
          <Modal.Dialog style={{ margin: 0 }} centered>
            <Modal.Header closeButton className="d-flex align-items-center justify-content-center" centered></Modal.Header>
            <Modal.Body style={{ padding: '30px 40px' }}>
              <div className="text-center">
                <img src={Warning} width={30} height={20} />
                <br />
                <b>
                  <h3>Log out?</h3>
                </b>
              </div>
              <p className="text-center">Are you sure you want to log out!</p>
              <br />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', width: 'auto', borderColor: '#6c757d', marginRight: '8px' }}>
                  Close
                </Button>
                <Button variant="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleLogout();
                    handleClose();
                  }}>
                  Log out
                </Button>
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>
      </Modal>
    </>
  );
}
export default Account;