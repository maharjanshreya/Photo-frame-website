
import  './admin.css';
import React from 'react';
import {useState} from 'react';
function PostUsers({refreshUserList }) {
    const [user, setUser] = useState({
        firstname:"",lastname:"",username:"",email:"",password:"",cpassword:"",contact:"",
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
        const res = await fetch("https://photo-frame-website.onrender.com/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstname,lastname,username,email,password,cpassword,contact,role:"consumer"
            })
        });
        const data = await res.json();
        if(res.status=== 422 || !data){
            window.alert("Invalid Registration");
            console.log("Invalif res");
            
        }else{
            window.alert("valid registration");
            refreshUserList();
            console.log("valid registration");

        }
    }
    return (<>
        <form method='POST' className=''>
            <input type="text" id="username" className='category' name="firstname" placeholder="Firstname" required value={user.firstname} onChange={handleInputs} />
            <input type="text" id="username" className='category' name="lastname" placeholder="Lastname" required value={user.lastname} onChange={handleInputs} /><br />
            <input type="text" id="username" className='category' name="username" placeholder="Username" required value={user.username} onChange={handleInputs} /><br />
            <input type="text" id="username" className='category' name="email" placeholder="Email" required value={user.email} onChange={handleInputs} /><br />
            <input type="text" id="password" className='category' name="password" placeholder="Password" required value={user.password} onChange={handleInputs} /><br />
            <input type="text" id="password" className='category' name="cpassword" placeholder="Confirm Password" required value={user.cpassword} onChange={handleInputs} /><br />
            <input type="text" id="password" className='category' name="contact" placeholder="Contact" required value={user.contact} onChange={handleInputs} /><br />
            <input type="submit" value="Register" onClick={handleSubmit} />
        </form>
    </>)
}
export default PostUsers;