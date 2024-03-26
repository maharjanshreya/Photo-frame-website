import Navbar from '../Navbar/navbar';
import {React, useEffect,useState} from 'react';
import { useLocation } from 'react-router-dom';
function Checkout(){
    const location = useLocation();
    const total = location.state?.value;
    console.log("total: ",total);
    return(<>
        <Navbar/>
        <div style={{margin:'30px 30px 30px 60px'}}>

        <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
    <label>Amount</label><br/><input type="text" id="amount" name="amount" value={total} required/>  <br/>                                                                                               
    <label>Tax</label><br/><input type="text" id="tax_amount" name="tax_amount" value="10" required/> <br/>     
    <label>Total</label><br/><input type="text" id="total_amount" name="total_amount" value={total+10} required/> <br/>     
    <label>Transaction id</label><br/><input type="hidden" id="transaction_uuid" name="transaction_uuid" value="ab14a8f2b02c3"/> <br/>     
    <label>Product code</label><br/><input type="text" id="product_code" name="product_code" value="EPAYTEST" required/> <br/>     
    <label>Product service charge</label><br/><input type="text" id="product_service_charge" name="product_service_charge" value="0" required/> <br/>     
    <label>Product Delivery charge</label><br/><input type="text" id="product_delivery_charge" name="product_delivery_charge" value="0" required/> <br/>     
    <input type="text" id="success_url" name="success_url" value="https://esewa.com.np" required/> <br/>     
    <input type="text" id="failure_url" name="failure_url" value="https://google.com" required/> <br/>     
    <input type="hidden" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required/> <br/>     
    <input type="hidden" id="signature" name="signature" value="[GENERATED_SIGNATURE]" required/> <br/>     
   <input value="Submit" type="submit"/>
</form>
</div>
    
    </>);
}
export default Checkout;