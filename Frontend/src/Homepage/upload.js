import Navbar from '../Navbar/navbar';
import sideImage from '../Images/aboutus1.jpg';
import sideImage1 from '../Images/about.png';
import flex1 from '../Images/about1.png';
import flex2 from '../Images/about2.png';
import flex3 from '../Images/about3.png';
import Footer from './footer';
import New from './new';
function Upload(){
    return(
        <div>
            <Navbar/>
            <div style={{marginLeft:'30px',marginTop:'30px'}}>
                <New />
            </div>
            

        </div>
    );
}
export default Upload;