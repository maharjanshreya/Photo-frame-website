import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import './homepage.css';
function Contact(){
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d613.83748789161!2d85.30232469876128!3d27.709523225122158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18f7472a7699%3A0xb9746c639eb67d58!2sSaman%20Photo%20Frame!5e0!3m2!1sen!2snp!4v1703425149052!5m2!1sen!2snp";
    return(
        <div>
            <Navbar/>
            <iframe title="Google Map" width="100%" height="300"style={{ border: 0 }} src={mapUrl} allowFullScreen></iframe>
            <div className='text-center contact'>
           <p>If you have inquires, then you can fill the form below and submit it. You will get your response in 2 days minimum.<br/> If you need to contact to the owner, then there are details you might want to check up.</p>
             </div>
        
            <b><p className='text-center thankyou' >Thankyou!</p></b>
            <div>
                <form>
                    <label for="fname">Email:</label><br />
                    <input type="email" id="email" name="email" required /><br />
                    <label for="contact">Contact</label><br />
                    <input type="contact" id="contact" name="contact" required /><br />
                    <textarea id="inquiry" name="inquiry" rows="5" cols="30"></textarea><br />
                </form>
            </div>
        </div>
    );
}
export default Contact;