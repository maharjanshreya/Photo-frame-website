import Navbar from '../Navbar/navbar';
import sideImage from '../Images/aboutus1.jpg';
import sideImage1 from '../Images/about.png';
import flex1 from '../Images/about1.png';
import flex2 from '../Images/about2.png';
import flex3 from '../Images/about3.png';
import AboutUs from '../Images/aaa.jpg';
import AboutUs2 from '../Images/AboutUs-2.jpg';
import AboutUs3 from '../Images/aboutUs-3.jpg';

import Footer from './footer';
import GetUserDetails from '../Admin/getUserDetails';
function Aboutus(){
    return(
        <div>
            <Navbar/>
            <div style={{ height: '300px', position: 'relative', overflow: 'hidden' }}>
  {/* Image covering the whole width */}
  <img src={AboutUs} alt="Background" style={{ width: '100%', height: 'auto' }} />

  {/* Text overlay */}
  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
    <h2>Our Story</h2>
    <p>Considered restwear that feels as good in bed as it looks. Innovative fabrics and functional silhouettes designed to make you rest-ready anytime.</p>
  </div>
</div>
         


<div className='container'>
  <div className='row vision'>
    <div className='col-md-6 d-flex align-items-center'>
      <div>
        <h1 className='vision1'>Our Vision</h1>
        <p className='para-about'>
          Our vision is to be the premier destination for individuals seeking not just frames, but expressions of their most cherished memories. 
          What sets us apart is our dedication to craftsmanship, quality, and customization. <br/><br/>Our curated collection of frames is a testament to our commitment to excellence. We strive to offer a range that caters to diverse tastes, ensuring that you find the perfect frame to encapsulate your unique story.
        </p>
      </div>
    </div>
    <div className='col-md-6 d-flex justify-content-center align-items-center'>
      <img src={sideImage} alt="logout" className="img-fluid image-height-about" />
    </div>
  </div>

  <div className='row vision'>
    <div className='col-md-6 d-flex justify-content-center align-items-center'>
      <img src={AboutUs3} alt="logout" className="img-fluid image-height-about" />
    </div>
    <div className='col-md-6 d-flex align-items-center'>
      <div>
        <h1 className='vision1'>Our Mission</h1>
        <p className='para-about'>
          We understand that every memory is unique, and our approach reflects this understanding. Our customization options allow you to tailor your frames to your preferences, ensuring that each piece is a reflection of your style and the significance of the moment it holds.
          Quality is the cornerstone of our approach. Each frame at [Your Company Name] is crafted with meticulous attention to detail. We use premium materials to ensure longevity and durability, so your memories are preserved for generations to come.
        </p>
      </div>
    </div>
  </div>

  <div className='row vision'>
    <div className='col-md-6 d-flex align-items-center'>
      <div>
        <h1 className='sub-heading'>Quality</h1>
        <h1 className='vision1'>Committed to Quality</h1>
        <p className='para-about'>
        We ensure our garments perform exactly as they ought to.<br/><br/>  Each piece is the product of years of testing, sourcing, innovating, and producing with only the highest-quality materials and luxury fabrics available. Wear tests, meticulous construction techniques, and high quality finishes — you could say we’re obsessed. The result? Long-lasting pieces that feel as good on you as they are in bed.</p>
      </div>
    </div>
    <div className='col-md-6 d-flex justify-content-center align-items-center'>
      <img src={AboutUs2} alt="logout" className="img-fluid image-height-about" />
    </div>
  </div>
</div>


            <div className='d-flex justify-content-between image-content'>
                <div>
                    <img src={flex2} alt="logout" className="center"  height={60}/>
                    <h5 className='text-center title'>Sustainable Sourcing</h5>
                    <p className='text-center'>Our frames are crafted from sustainably harvested wood, and we work closely with suppliers who share our commitment to environmental stewardship.</p>
                </div>
                <div>
                    <img src={flex1} alt="logout" className="center" height={60} />
                    <h5 className='text-center title' style={{color:'#3DCC4E'}}> Eco-Friendly Packaging</h5>
                    <p className='text-center'> Our packaging is eco-friendly, using recycled materials and minimizing excess packaging. We're proud to contribute to a reduction in environmental impact from the production to the delivery of our frames.</p>
                </div>
                <div>
                    <img src={flex3} alt="logout" className="center" height={60} />
                    <h5 className='text-center title' style={{color:'#6664B1'}}>Giving Back to Communities</h5>
                    <p className='text-center'>A portion of our proceeds goes toward supporting community initiatives, whether it's local arts programs, environmental conservation projects, or other causes close to our hearts.</p>
                </div>

            </div>
            <Footer/>
        </div>
    );
}
export default Aboutus;