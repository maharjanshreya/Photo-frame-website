import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import { FaPhoneAlt } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import './homepage.css';
import Footer from './footer';
function Contact(){
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d613.83748789161!2d85.30232469876128!3d27.709523225122158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18f7472a7699%3A0xb9746c639eb67d58!2sSaman%20Photo%20Frame!5e0!3m2!1sen!2snp!4v1703425149052!5m2!1sen!2snp";
    
    const [userData, setUserData] = useState({email:"",contact:"",message:""});

    const userContact = async () => {
        try {
           const res = await fetch('https://photo-frame-website.onrender.com/getData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          if (!res.ok) {
            const error = new Error(res.statusText);
            throw error;
          }
      
          const data = await res.json();
          setUserData({...userData, email: data.email,contact: data.contact});
          console.log(data);
      
        } catch (err) {
          console.log('Error in fetching data', err);
          
        }
      };
      
    useEffect(()=>{
        userContact();

    }, []);

    //storing data
    const handleInputs = (e)=>{
        const name = e.target.name;
        const value = e.target.value;
        console.log(name,value);
        setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));

    }
    const contactForm = async (e) => {
        e.preventDefault();
        console.log("Contact form submitted");
        console.log(userData);
    
        try {
            const { email, contact, message } = userData;
            const res = await fetch('https://photo-frame-website.onrender.com/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    contact,
                    message,
                }),
                credentials: 'include', 
            });
    
            const data = await res.json();
            if (!data) {
                console.log("Message not sent");
            } else {
                window.alert("Successfully message sent");
                setUserData({ email: "", contact: "", message: "" }); // Clear the form fields
            }
        } catch (error) {
            console.error("Error sending contact form:", error);
        }
    };
    
    return(
        <div>
            <Navbar/>
            <iframe title="Google Map" width="100%" height="300"style={{ border: 0 }} src={mapUrl} allowFullScreen></iframe>
            <div className='text-center contact'>
           <p>If you have inquires, then you can fill the form below and submit it. You will get your response in 2 days minimum.<br/> If you need to contact to the owner, then there are details you might want to check up.</p>
             </div>
        
            <b><p className='text-center thankyou' style={{color:'green'}}>Thankyou!</p></b>
            <div className='d-flex'>
                <div className='d-flex text-center contact-owner'>
                    <div className='emoji'>
                        <FaPhoneAlt  style={{ color: '#0c8ce9' }}/>
                    </div>
                    <div className='para'>
                        <p>  <span style={{fontWeight:'bolder'}}>Phone</span><br/>01-4284602</p>
                    </div>
                    
                </div>
                <div className='d-flex contact-owner'>
                
                
                    <div className='emoji'>
                        <FaMapMarkedAlt  style={{ color: '#0c8ce9', fontSize:'20px' }}/>
                    </div>
                    <div className='para'>
                        <p>  <span style={{fontWeight:'bolder'}}>Address</span><br/>Dallu, Kathmandu</p>
                    </div>
                </div>
                <div className='d-flex contact-owner'>
                
                    <div className='emoji'>
                        <MdOutlineMail  style={{ color: '#0c8ce9', fontSize:'20px' }}/>
                    </div>
                    <div className='para'>
                        <p>  <span style={{fontWeight:'bolder'}}>Email</span><br/>saman.maharjan4123@gmail.com</p>
                    </div>
                </div>

            </div>
            <div className='center-container'>

            
            <div className='contact-form'>
                <h3 style={{padding:'30px',color:'white'}}>Get in touch.</h3>
                <form method='POST' onSubmit={contactForm}>
                    
                    <input type="email" id="email" name="email" value={userData.email} onChange={handleInputs}required className='email-input' placeholder='Enter your email' style={{marginRight:'20px'}}/>
                    
                    <input type="contact" id="contact" name="contact" value={userData.contact}onChange={handleInputs}required className='email-input'  placeholder='Enter your contact'/><br />
                    
                    <textarea id="message" name="message" rows="6" cols="50" value={userData.message}onChange={handleInputs} placeholder='Enter your message' className='placeholder'></textarea><br />
                    <input id='contact-submit' type="submit" value="Submit" />
                </form>
            </div>
            </div>
            <Footer/>
        </div>
    );
}
export default Contact;