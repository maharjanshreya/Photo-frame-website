import Navbar from '../Navbar/navbar';
import sideImage from '../Images/aboutus1.jpg';
import sideImage1 from '../Images/about.png';
function Aboutus(){
    return(
        <div>
            <Navbar/>

            <h1 className="text-center mt-5 header-aboutus" >About Us</h1>
            <h3 className="text-center sub-header-aboutus">where we discuss our story</h3>
            <div className='d-flex justify-content-between vision'>
                <div className='col'>
                    <h1 style={{color:'#A40C0C'}}>Our Vision</h1>
                    <p style={{fontSize:'20px',fontFamily:'Poppins'}}>
                    Our vision is to be the premier destination for individuals seeking not just frames, but expressions of their most cherished memories. 
                    What sets us apart is our dedication to craftsmanship, quality, and customization. <br/><br/>Our curated collection of frames is a testament to our commitment to excellence. We strive to offer a range that caters to diverse tastes, ensuring that you find the perfect frame to encapsulate your unique story.
                    </p>
                </div>
                <div className='col text-center'>
                 <img src={sideImage} alt="logout" className="image-height"  />
                </div>

            </div>
            <div className='d-flex justify-content-between vision'>
                <div className='col text-center'>
                 <img src={sideImage1} alt="logout" className="image-height"  />
                </div>
                <div className='col'>
                    <h1 style={{color:'#A40C0C'}}>Our Mission</h1>
                    <p style={{fontSize:'20px',fontFamily:'Poppins'}}>
                    We understand that every memory is unique, and our approach reflects this understanding. Our customization options allow you to tailor your frames to your preferences, ensuring that each piece is a reflection of your style and the significance of the moment it holds.
Quality is the cornerstone of our approach. Each frame at [Your Company Name] is crafted with meticulous attention to detail. We use premium materials to ensure longevity and durability, so your memories are preserved for generations to come. </p>
                </div>
                

            </div>
        </div>
    );
}
export default Aboutus;