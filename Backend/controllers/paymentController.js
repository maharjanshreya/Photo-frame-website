const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require('../model/orderModel');
const paymentController = async (req, res) => {
    try {
        const {products} = req.body; // Access the 'products' array directly
       console.log("Products:",products);
        if (!products || !Array.isArray(products)) {
            throw new Error('Invalid products data');
        }

        const line_items = products.map((product) => ({
            price_data: {
                currency: "NPR",
                product_data: {
                    name: `${product.productId.productName} - Size: ${product.size}`,
                   
                },
                
                unit_amount: product.productId.price * 100,
            },
            quantity: product.quantity,
            
            
            
        }));
        const sizeString = products.map(item => item.size).join(', ');
        const shippingOptions = products.map(ship => ({
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: ship.productId.shipping ||0,
                    currency: 'NPR',
                },
                display_name: 'Standard Shipping',
                delivery_estimate: {
                    minimum: {
                        unit: 'day',
                        value: ship.productId.minDelivery,
                    },
                    maximum: {
                        unit: 'day',
                        value: ship.productId.maxDelivery,
                    },
                },
            },
            
        }));
        
       console.log("Size:",products.size);
        console.log(JSON.stringify(line_items, null, 2));
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            payment_method_types: [
                'card',
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/cancel',
            
            shipping_address_collection: {
                allowed_countries: ['NP'], 
            },
            shipping_options: shippingOptions,
        });
       // Retrieve session details from Stripe
        const retrievedSession = await stripe.checkout.sessions.listLineItems(session.id);
        const userID = req.userID; // Assuming userID is obtained from the request
        //await createOrder(session, userID);
        console.log(session);
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error in paymentController:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// const handlePaymentSuccess = async (req, res) => {
//     try {
//         const sessionId = req.params.session_id; // Get the session ID from the query parameters
//         console.log("Session id: ",sessionId);
//         if (!sessionId) {
//             throw new Error('Session ID is missing');
//         }
//         // Fetch the session details from Stripe to verify payment success
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         // Check if payment was successful
//         if (session.payment_status === 'paid') {
            
//         const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            
//         const shipping = session.shipping_options;
//             const orderDetails = {
                
//                 productDetails: productDetails,
//                 totalAmount: totalAmount,
//                 currency: session.currency,
//             };
//             console.log('Payment successful:', orderDetails);
//             res.status(200).json(orderDetails);
//         } else {
//             res.status(400).send('Payment not successful');
//         }
//     } catch (error) {
//         console.error('Error in handlePaymentSuccess:', error);
//         res.status(500).send('Internal server error');
//     }
// };

const handlePaymentSuccess = async (req, res) => {
    try {
        // Assuming you have the session ID and user ID from the request
        const sessionID = req.params.session_id;
        console.log("Session id",sessionID);
        const userID = req.userID;

        // Retrieve the session from Stripe to get the order details
        const sessionData = await stripe.checkout.sessions.retrieve(sessionID);
        // Access line items in the session
        
        // Create the order and get the specific order details
        const orderDetails = await createOrder(sessionData, userID);
        console.log(orderDetails);
        // Render the success page with the specific order details
        res.json({ orderDetails });
    } catch (error) {
        console.error('Error handling success page:', error);
        res.status(500).send('Internal server error');
    }
};
// Function to create an order
const createOrder = async (sessionData, userID) => {
    try {
         // Check if the order already exists for this session
         const existingOrder = await Order.findOne({ session_id: sessionData.id });
         if (existingOrder) {
             console.log('Order already exists for session:', sessionData.id);
             return; // Do not create a new order
         }
        const retrievedSession = await stripe.checkout.sessions.listLineItems(sessionData.id);
        console.log("Session id in create order: ",sessionData.id);
        console.log("retrievedSession, ",retrievedSession.data);
        const shipping = sessionData.shipping_options;
         
       
        if (retrievedSession.data) {
            console.log("ok");
        } else {
            console.log('Invoice or line items not found in session');
        }
        // Extract product data from the session
        const lineItems = retrievedSession.data;
        console.log("line uitems data: ",lineItems);
        
        const products = lineItems.map(item => {
            // Parse size from description
            const size = item.description.includes('Size:') ? item.description.split('Size: ')[1] : ''; // Extract size from description
            console.log('Extracted size:', size); // Log the extracted size
            return {
                name: item.description,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                size: size // Assign the extracted size to the product
            };
        });
        const amountTotal = sessionData.amount_total / 100;
        const shippingDetails = sessionData.shipping_details;
       // Create a new order entry using the Order model
        const order = new Order({
            products: products,
            shippingAddress: {
                address: {
                    city: shippingDetails.address.city,
                    country: shippingDetails.address.country,
                    line1: shippingDetails.address.line1,
                    line2: shippingDetails.address.line2,
                    postal_code: shippingDetails.address.postal_code,
                    state: shippingDetails.address.state
                },
                name: shippingDetails.name
            },
            payment: amountTotal,
            buyer: userID,
            status: 'Processing', 
        });

        // Save the order to the database
        await order.save();

        console.log('Order created successfully:', order);
        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};


module.exports = { paymentController,handlePaymentSuccess };
