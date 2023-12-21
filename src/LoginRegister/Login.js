import sideImage from '../Images/LoginImage.png';
import Logo from '../Images/Rectangle 1.png';
import  '../CSS/style.css';
function Login(){
    return(
        <div className="full-screen-image">
            <div className="left-column">
                <img src={sideImage} alt="logout" className="full-height-image"  />
            </div>
            <div className="right-column">
                <p className='text'>Login and <br/>Design your frames with</p>
                <img src={Logo} alt="logout" className=""  />
                <form>
                <input type="text" id="username" name="username" placeholder="Username" /><br/>
                <input type="text" id="password" name="password" placeholder="Password" /><br/>
                <input type="submit" value="Login" />
                </form>
                <p>Don't have an account? <u className='register-color'>Register Now </u></p>
            </div>
            
        
        </div>
    );
}
export default Login;