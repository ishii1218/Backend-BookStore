const router = require('express').Router();
const User = require('../models/user');
const {authenticateToken} = require('./userAuth');
const Book = require('../models/book');
const Order = require('../models/order');

router.post('/updateOrder', authenticateToken, async (req, res) => {
    try {
        // console.log('Order', req.header);
        const { id,bookid } = req.headers;
        // const { order } = req.body;

        
            const existingOrder = await Order.findOne({ user: id, book: bookid });
            if (!existingOrder) {
                const newOrder = new Order({
                    user: id,
                    book: bookid,
                });
                const orderDataFromDB = await newOrder.save();
                await User.findByIdAndUpdate(id, {
                    $push: { orders: orderDataFromDB._id }
                });
            
        }
        return res.status(200).json({
            status: "success",
            message: "Order updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete order
router.delete('/deleteOrder/:bookId', authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { bookId } = req.params;
        const existingOrder=Order.findOne({ user: id, book: bookId });

        const order = await Order.findOneAndDelete({ user: id, book: bookId });
        if (order) {
            await User.findByIdAndUpdate(id, {
                $pull: { orders: order._id }
            });
        }
        // await Order.findOneAndDelete({ user: id, book: bookId });
        // await User.findByIdAndUpdate(id, {
        //     $pull: { orders: { bookid } }
        // });

        return res.status(200).json({
            status: "success",
            message: "Order deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// router.put('/clearOrders', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.headers;

//         await User.findByIdAndUpdate(id, { orders: [] });

//         return res.status(200).json({
//             status: "success",
//             message: "Orders cleared successfully"
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// });
// //place order
// router.post('/addOrder', authenticateToken, async (req, res) => {
//     try {
//         console.log('Order',req.body);
//         const {id} = req.headers;
//         const {order} = req.body;
//         await Order.deleteMany({ user: id });
//         await User.findByIdAndUpdate(id, { orders: [] });
//         for(const orderData of order){
//             const newOrder = new Order({
//                 user: id,
//                 book: orderData.book,
//             });
//             const orderDataFromDB = await newOrder.save();
//             await User.findByIdAndUpdate(id,{
//                 $push: { orders: orderDataFromDB._id }
//             });         
//         }
//         return res.status(200)
//         .json({ 
//             status: "success",
//             message: "Order placed successfully" 
//         });
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server Error" });
//     }
// });

 // await User.findByIdAndUpdate(id,{
            //     $pull: { cart: orderData._id }
            // });

//get order history of a user
router.get('/getOrderHistory', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path:'orders',
            populate: { path: 'book' }
        });
        console.log('Userdata',userData);

        const ordersData = userData.orders;
        console.log('Ordersdata',ordersData);

        return res.status(200).json({ 
            status: "success",
            orders: ordersData 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get all orders by admin
router.get('/getAllOrders', authenticateToken, async (req, res) => {
    try {
        const userData = await Order.find()
        .populate({path:'book'})
        .populate({path:'user'})
        .sort({createdAt: -1});
        console.log('UserdataAllOrders',userData);
    
        return res.status(200).json({ 
            status: "success",
            data: userData 
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//update order status by admin
router.put('/updateOrderStatus/:id', authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id,{
            status: req.body.status
        });
        return res.status(200).json({ 
            status: "success",
            message: "Order status updated successfully" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});


module.exports = router;