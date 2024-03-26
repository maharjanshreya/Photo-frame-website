const stripe = require("stripe")("sk_test_51OyOhcA4uLHwNxGYSXTrDJkBBiGlWFsUQljwGqVJNSryXlNvn2AJDiHbCJT7mwdyqRDlIwMM0wpWm4KZbokMx7ap00aY9jWGyQ");

const paymentController = async (req, res) => {
    try {
        const products = req.body.products; // Access the 'products' array directly
        
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

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            payment_method_types: [
                'card',
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error in paymentController:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { paymentController };
