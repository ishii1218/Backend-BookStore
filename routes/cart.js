const router = require('express').Router();
const User = require('../models/user');
const {authenticateToken} = require('./userAuth');
const Book = require('../models/book');


//add book to cart
router.put('/addToCart', authenticateToken, async (req, res) => {
    try {
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookExist = await Book.findById (bookid);
        const isBookinCart = userData.cart.includes(bookid);
        if(isBookinCart){
            return res.status(200).json({ 
                status: "success",
                message: "Book already in cllection" 
            });
        } 
        if(!isBookExist){
            return res.status(400).json({ message: "Book does not exist" });
        }
        else{ 
            await User.findByIdAndUpdate(id,{
                $push: { cart: bookid }
            });
            return res.status(200).json({ 
                status: "success",
                message: "Book added to collection" 
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//delete book from cart
router.put('/deleteCart/:bookid', authenticateToken, async (req, res) => {
    try {
        const {bookid} = req.params;
        const {id} = req.headers;
        await User.findByIdAndUpdate(id,{
            $pull: { cart: bookid }
        });
        
        return res.status(200).json({ 
            status: "success",
            message: "Book removed from collection" 
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get cart books from user
router.get('/getCollection', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate('cart');
        const cart = userData.cart;
        return res.status(200)
        .json({
            status: "success",
            data:cart
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});


module.exports = router;