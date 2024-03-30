import React,{useState,useEffect}from 'react';
import AdminNavbar from './adminNavbar';
import { formatDateString } from '../ProductView/time';
import Card from 'react-bootstrap/Card';
import CardBody from 'react-bootstrap/Card';
import ReactStars from "react-rating-stars-component";
import { MdOutlineSupervisorAccount } from "react-icons/md";
function Review(){
    const [review, setReviewData] = useState([]);
    const getReviewFunc = async () => {
        try {
          const res = await fetch('/get-all-review', {
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
    return(
        <>
            <div className='' style={{marginRight:'36px'}}>

   
                <div>
                <AdminNavbar/>
                </div>
                <div style={{marginLeft:'250px'}}>
                    <h2 >Reviews  </h2>
                    <div style={{width:'100%'}}>
                        {
                            review.map((review, index) => (  // This condition checks if the review data exists
                                <div key={index} className="review">
                                    <Card style={{ backgroundColor: '#fafafa', margin: '15px 0px' }}>
                                        <CardBody style={{ paddingBottom: "0px" }}>
                                            <div className="row">
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
                </div>
                </div>
        </>
    );
}
export  default Review;