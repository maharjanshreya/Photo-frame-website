const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require('../model/orderModel');
const Product = require('../model/productModel');
const paymentController = async (req, res) => {
    try {
        const {products} = req.body; 
        if (!products || !Array.isArray(products)) {
            throw new Error('Invalid products data');
        }

        const metadata = {};
        products.forEach((product, index) => {
            metadata[`product_${index}_quantity`] = String(product.quantity);
            if (product.uploadId) {
                metadata[`product_${index}_uploadId`] = String(product.uploadId);
            }
        });

        const line_items = products.map((product) => {
            const lineItem = {
                price_data: {
                    currency: "NPR",
                    product_data: {
                        name: `${product.productId.productName} - Size: ${product.size}`,
                        
                    },
                    unit_amount: product.productId.price * 100,
                },
                quantity: product.quantity,
               
            };
           return lineItem;
        });
       
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
        
       //console.log("Size:",products.size);
        //console.log(JSON.stringify(line_items, null, 2));
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            metadata: metadata,
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
        res.json({ id: session.id });
    } catch (error) {
        console.error('Error in paymentController:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const handlePaymentSuccess = async (req, res) => {
    
    console.log("called once in create order");
    try {const userID = req.userID;
        
        
        const sessionID = req.params.session_id;
        const sessionData = await stripe.checkout.sessions.retrieve(sessionID);
         // Check if the order already exists for this session
         const existingOrder = await Order.findOne({ session_id: sessionData.id });
         if (existingOrder) {
             console.log('Order already exists for session:', sessionData.id);
             return; 
         }
         const metadata = sessionData.metadata;
         const uploadIds = [];

            
            for (const key in metadata) {
            if (Object.hasOwnProperty.call(metadata, key)) {
                // Check if the key contains 'uploadId'
                if (key.includes('uploadId')) {
                // Extract the uploadId value
                const uploadId = metadata[key];
                // Include the uploadId only if it exists
                if (uploadId) {
                    uploadIds.push(uploadId);
                }
                }
            }
            }
        
        const retrievedSession = await stripe.checkout.sessions.listLineItems(sessionData.id);
        const shipping = sessionData.shipping_options;
         
        if (retrievedSession.data) {
            console.log("ok");
        } else {
            console.log('Invoice or line items not found in session');
        }
        // Extract product data from the session
        const lineItems = retrievedSession.data;
      //  console.log("line uitems data: ",lineItems);
        
        const products = lineItems.map((item, index)=> {
            // Parse size from description
            const size = item.description.includes('Size:') ? item.description.split('Size: ')[1] : ''; // Extract size from description
          
            console.log('Extracted size:', size); // Log the extracted size
            //const product = await Product.findById(item.price.product);
            return {
                name: item.description,
                price: item.price.unit_amount / 100,
                quantity: item.quantity,
                size: size, 
                uploadId: uploadIds[index]
            };
        });
        const amountTotal = sessionData.amount_total / 100;
        const shippingDetails = sessionData.shipping_details;
      
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
        const orderDetails = await order.save();
        //await subtractProductQuantity(productIds);
        res.status(201).json({ orderDetails });
       
        console.log('Order created successfully:');
       
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

module.exports = { paymentController,handlePaymentSuccess };
