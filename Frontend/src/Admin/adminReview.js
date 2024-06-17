import React, { useState, useEffect } from 'react';
import Navbar from './adminNavbar';
import { formatDateString } from '../ProductView/time';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/Card';
import ReactStars from "react-rating-stars-component";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import AdminLayout from './admin';
import { paginate } from '../Components/paginate';
import { Pagination } from 'react-bootstrap';  
function Review() {
  const [review, setReviewData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
  const getReviewFunc = async () => {
    try {
      const res = await fetch('https://photo-frame-website.onrender.com/get-all-review', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) {
        const error = new Error(res.statusText);
        throw error;
      }

      const response = await res.json();
      setReviewData(response.reviews);
      console.log('API Response:', response.reviews);
    } catch (err) {
      console.log('Error in fetching data', err);
    }
  };

  useEffect(() => {
    getReviewFunc();
  }, []);
  return (
    <>
      <div className='' style={{ marginRight: '36px' }}>

        <AdminLayout >
          <h2 >Reviews  </h2>
          <div className="row">
            <div className="col-auto">
              <MdOutlineSupervisorAccount color='green' />
            </div>
            <div className="col">
              <p>Reviews and ratings of the customers.</p>
            </div>
          </div>
          <div style={{ width: '100%' }}>
            {
              paginate(review, currentPage, itemsPerPage).map((review, index) => (  // This condition checks if the review data exists
                <div key={index} className="review">
                  <Card style={{ backgroundColor: '#fafafa', margin: '15px 0px' }}>
                    <CardBody style={{ paddingBottom: "0px" }}>
                      <div className="row" style={{ padding: '15px' }}>
                        <div className="col-auto">
                          <MdOutlineSupervisorAccount />
                        </div>
                        <div className="col">
                          <p>{review.user.email}</p>
                          <ReactStars size={24} edit={false} value={review.rating} />
                          <p>{review.review}</p>
                          <p style={{ color: "#808080", fontSize: '17px' }}>{formatDateString(review.createdAt)}</p>
                        </div>
                      </div>
                    </CardBody>
                   
                  </Card>
                </div>
              ))}</div>
        </AdminLayout> <Pagination style={{justifyContent:"center",marginTop:'9px'}}>
                                {Array.from({ length: Math.ceil(review.length / itemsPerPage) }).map((_, index) => (
                                    <Pagination.Item
                                    key={index}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                    >
                                    {index + 1}
                                    </Pagination.Item>
                                ))}
                                </Pagination>
      </div>
    </>
  );
}
export default Review;