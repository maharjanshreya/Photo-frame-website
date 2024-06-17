import React, {useState} from 'react';
import { 
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCol,
  MDBBadge,
  MDBCardBody,
  MDBBtn,
  MDBIcon,
  MDBCardFooter
} from 'mdb-react-ui-kit';

import userFunc from '../Admin/user'; 
function Component() {
    const [userLength, setUserData] = useState([]);
    const [orderLeft, setOrderLeft] = useState([]);
    const [orderDelivered, setOrderDelivered] = useState([]);
    const fetchData = async () => {
        try {
          const userData = await userFunc();
          console.log('User data:', userData.length);
          setUserData(userData.length);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      const fetchOrderData = async () => {
        try {
          const response = await fetch('/view-order');
          if (!response.ok) {
            throw new Error('Failed to fetch order data');
          }
          const data = await response.json();
          const processingOrders = data.filter(order => order.status === 'Processing');
          const deliveredOrders = data.filter(order => order.status === 'Delivered');
          const processingOrdersCount = processingOrders.length;
          setOrderLeft(processingOrdersCount);
          setOrderDelivered(deliveredOrders.length);
          console.log('Number of orders with status "Processing":', processingOrdersCount);

        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      };
      fetchOrderData();
      fetchData();
  return (
    <MDBContainer fluid>
      <MDBRow className='justify-content-start'>
        <MDBCol md='12'>
          <section>
           
            <MDBRow>
              <MDBCol md='3' className='mb-md-0' style={{paddingLeft:'0px'}}>
                <MDBCard>
                  <MDBCardBody>
                    <div className='d-flex align-items-center'>
                      <div className='flex-shrink-0'>
                        <div className='p-3 bg-primary rounded-4 shadow-2-strong'>
                          <MDBIcon icon='hand-point-up' size='lg' className='text-white fa-fw' />
                        </div>
                      </div>
                      <div className='flex-grow-1 ms-4'>
                        <p className='text-muted mb-1'>Total Sales</p>
                        <h2 className='mb-0'>
                          71
                          <span className='text-success' style={{ fontSize: '0.875rem' }}>
                            <MDBIcon icon='arrow-up' className='ms-1' size='sm' />
                            <span> 453</span>
                          </span>
                        </h2>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md='3' className='mb-md-0' style={{paddingLeft:'0px'}}>
                <MDBCard>
                  <MDBCardBody>
                    <div className='d-flex align-items-center'>
                      <div className='flex-shrink-0'>
                        <div className='p-3 bg-primary rounded-4 shadow-2-strong'>
                          <MDBIcon icon='eye' size='lg' className='text-white fa-fw' />
                        </div>
                      </div>
                      <div className='flex-grow-1 ms-4'>
                        <p className='text-muted mb-1'>Total Users</p>
                        <h2 className='mb-0'>
                          {userLength}
                          <span className='text-success' style={{ fontSize: '0.875rem' }}>
                            <MDBIcon icon='arrow-up' className='ms-1' size='sm' />
                            <span> 8.3%</span>
                          </span>
                        </h2>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              <MDBCol md='3' className='mb-md-0' style={{paddingLeft:'0px'}}>
                <MDBCard>
                  <MDBCardBody>
                    <div className='d-flex align-items-center'>
                      <div className='flex-shrink-0'>
                        <div className='p-3 bg-primary rounded-4 shadow-2-strong'>
                          <MDBIcon icon='chart-pie' size='lg' className='text-white fa-fw' />
                        </div>
                      </div>
                      <div className='flex-grow-1 ms-4'>
                        <p className='text-muted mb-1'>Orders Left</p>
                        <h2 className='mb-0'>
                          {orderLeft}
                          <span className='text-danger' style={{ fontSize: '0.875rem' }}>
                            <MDBIcon icon='arrow-down' className='ms-1' size='sm' />
                            <span> 3.9%</span>
                          </span>
                        </h2>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md='3' className='mb-md-0' style={{paddingLeft:'0px'}}>
                <MDBCard>
                  <MDBCardBody>
                    <div className='d-flex align-items-center'>
                      <div className='flex-shrink-0'>
                        <div className='p-3 bg-primary rounded-4 shadow-2-strong'>
                          <MDBIcon icon='chart-pie' size='lg' className='text-white fa-fw' />
                        </div>
                      </div>
                      <div className='flex-grow-1 ms-4'>
                        <p className='text-muted mb-1'>Delivered Orders</p>
                        <h2 className='mb-0'>
                          {orderDelivered}
                          <span className='text-danger' style={{ fontSize: '0.875rem' }}>
                            <MDBIcon icon='arrow-down' className='ms-1' size='sm' />
                            <span> 3.9%</span>
                          </span>
                        </h2>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </section>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Component;