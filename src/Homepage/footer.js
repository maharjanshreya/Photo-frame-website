import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { TiSocialFacebook } from "react-icons/ti";
import { BiLogoInstagramAlt } from "react-icons/bi";
import Logo from '../Images/Rectangle 1.png';
import './homepage.css';
import { useUser } from '../context/user';
import { Link } from "react-router-dom";
function Footer() {
  
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <TiSocialFacebook color='secondary' fab icon='facebook-f' className='facebook' size={26}/>
          </a>
          <a href='https://www.instagram.com/samanphotoframe/' className='me-4 text-reset'>
            <BiLogoInstagramAlt color='secondary' fab icon='twitter' className='instagram' size={26}/>
          </a>
          
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                
               
                <img src={Logo} alt="Wave Billing System" className="my-specific-image" style={{ paddingLeft: '40px', color: '#426751', display: 'inline-block' }} />

              </h6>
            <p> Photo frame website where you can purchase frames  for your photos. You can also upload and share your own photos.</p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Category</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Frames
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Borders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Gifts
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Laravel
                </a>
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
              <Link to="/account#report">report a problem</Link>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                Dallu, Kathmandu, Nepal
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-2' />
                samanmaharjan60@gmail.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-2' /> 9880602197
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-2' /> 01-4285602
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2021 Copyright:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
          SamanPhotoFrame.com
        </a>
      </div>
    </MDBFooter>
  );
}
export default Footer;