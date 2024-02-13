import React from 'react';
import AdminNavbar from './adminNavbar';
function Order(){
    return(

    <> <div className='d-flex'>

   
        <div>
        <AdminNavbar/>
        </div>
        <div>
            <p style={{marginLeft:'250px'}}>this is admin order page </p>
        </div>
     </div>
    </>
    );
}
export default Order;