const stripe = require("stripe")("sk_test_51OyOhcA4uLHwNxGYSXTrDJkBBiGlWFsUQljwGqVJNSryXlNvn2AJDiHbCJT7mwdyqRDlIwMM0wpWm4KZbokMx7ap00aY9jWGyQ");
const Order = require('../model/orderModel');
const paymentController = async (req, res) => {
    try {
        const {products} = req.body; // Access the 'products' array directly
        console.log("Products: ",products);
        if (!products || !Array.isArray(products)) {
            throw new Error('Invalid products data');
        }

        const line_items = products.map((product) => ({
            price_data: {
                currency: "NPR",
                product_data: {
                    name: product.productId.productName
                },
                unit_amount: product.productId.price * 100,
            },
            quantity: product.quantity
        }));
       
        console.log(JSON.stringify(line_items, null, 2));
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            payment_method_types: [
                'card',
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
        });
       // Retrieve session details from Stripe
        const retrievedSession = await stripe.checkout.sessions.listLineItems(session.id);
        // Access line items from retrieved session
        console.log(retrievedSession);
        console.log(retrievedSession.data);
        console.log("Session created");
        console.log(session.id);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error in paymentController:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const handlePaymentSuccess = async (req, res) => {
    try {
        const sessionId = req.params.session_id; // Get the session ID from the query parameters
        console.log("Session id in backend: ",sessionId);
        if (!sessionId) {
            throw new Error('Session ID is missing');
        }
        // Fetch the session details from Stripe to verify payment success
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Check if payment was successful
        if (session.payment_status === 'paid') {
            console.log("Paid payment");
            const userID = req.userID; 
            console.log("User id in backend: ",userID);
            createOrder(session,userID);
            res.status(200).send('Payment successful');
        } else {
            res.status(400).send('Payment not successful');
        }
    } catch (error) {
        console.error('Error in handlePaymentSuccess:', error);
        res.status(500).send('Internal server error');
    }
};
// Function to create an order
const createOrder = async (session, userID) => {
    try {
        const retrievedSession = await stripe.checkout.sessions.listLineItems(session.id);
        console.log("Creating order");
        
        if (retrievedSession.data) {
            console.log(retrievedSession.data);
        } else {
            console.log('Invoice or line items not found in session');
        }
        // Extract product data from the session
        const lineItems =retrievedSession.data
        const products = lineItems.map(item => ({
           
            name:  item.description,  // Product name or description
            price: item.price.unit_amount / 100, // Convert from cents to your currency
            quantity: item.quantity
        }))
        
        // Create a new order entry using the Order model
        const order = new Order({
            products: products,
            payment: session.payment_intent,
            buyer: userID,
            status: 'Processing', // Default status
        });

        // Save the order to the database
        await order.save();

        console.log('Order created successfully:', order);
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};



module.exports = { paymentController,handlePaymentSuccess };
