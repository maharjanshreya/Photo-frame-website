import Navbar from '../Navbar/navbar';
import sideImage from '../Images/aboutus1.jpg';
function Aboutus(){
    return(
        <div>
            <Navbar/>

            <h1 className="text-center mt-5 header-aboutus" >About Us</h1>
            <h3 className="text-center sub-header-aboutus">where we discuss our story</h3>
            <div className='d-flex justify-content-between vision'>
                <div className='col'>
                    <h1>Our Story</h1>
                    <p>
                    Our vision is to be the premier destination for individuals seeking not just frames, but expressions of their most cherished memories. 
                    What sets us apart is our dedication to craftsmanship, quality, and customization. Our curated collection of frames is a testament to our commitment to excellence. We strive to offer a range that caters to diverse tastes, ensuring that you find the perfect frame to encapsulate your unique story.
                    </p>
                </div>
                <div className='col text-center'>
                 <img src={sideImage} alt="logout" className="image-height"  />
                </div>

            </div>
        </div>
    );
}
export default Aboutus;