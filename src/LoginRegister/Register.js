import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
import axios from 'axios';
import React from 'react';
import {use,useState} from 'react';
import { Link } from 'react-router-dom';
function Register(){
    const [user, setUser] = useState({
        firstname:"",lastname:"",username:"",email:"",password:"",cpassword:"",contact:""
    });
    let name,value;
    const handleInputs = (e) =>{
        console.log(e);
        name =e.target.name;
        value = e.target.value;
        setUser({...user,[name]:value});
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const{firstname,lastname,username,email,password,cpassword,contact} =user;
        const res = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstname,lastname,username,email,password,cpassword,contact
            })
        });
        const data = await res.json();
        if(res.status=== 422 || !data){
            window.alert("Invalid Registration");
            console.log("Invalif res");
            
        }else{
            window.alert("valid registration");
            console.log("valid registration");
        }
    }
    return(
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image"  />
            </div>
            <div className="right-column">
                <p className='text'>Login and <br/>Design your frames with</p>
                <img src={Logo} alt="logout" className=""  />
                <form method='POST'>
                <input type="text" id="username" name="firstname" placeholder="Firstname"  required value={user.firstname} onChange={handleInputs}/><br/>
                <input type="text" id="username" name="lastname" placeholder="Lastname" required value={user.lastname} onChange={handleInputs}/><br/>
                <input type="text" id="username" name="username" placeholder="Username" required value={user.username} onChange={handleInputs}/><br/>
                <input type="text" id="username" name="email" placeholder="Email" required value={user.email} onChange={handleInputs}/><br/>
                <input type="text" id="password" name="password" placeholder="Password" required value={user.password} onChange={handleInputs}/><br/>
                <input type="text" id="password" name="cpassword" placeholder="Confirm Password" required value={user.cpassword} onChange={handleInputs}/><br/>
                <input type="text" id="password" name="contact" placeholder="Contact" required value={user.contact} onChange={handleInputs}/><br/>
                <input type="submit" value="Register" onClick={handleSubmit} />
                </form>
                <p>Already have an account<Link to="/login"> <u className='register-color'>Sign-in Now </u></Link></p>
            </div>
            
        
        </div>
    );
}
export default Register;