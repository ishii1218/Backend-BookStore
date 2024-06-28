const router = require('express').Router();
const User = require('../models/user');
const {authenticateToken} = require('./userAuth');
const Book = require('../models/book');


//add book to favourite
router.put('/addFavourite', authenticateToken, async (req, res) => {
    try {
        // console.log(req.headers);
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isBookExist = await Book.findById (bookid);
        const isFavouriteBook = userData.favourites.includes(bookid);
        if(isFavouriteBook){
            return res.status(200).json({ message: "Book already in favourites" });
        }  
        if(!isBookExist){
            return res.status(400).json({ message: "Book does not exist" });
        }
        else{
        await User.findByIdAndUpdate(id,{
            $push: { favourites: bookid }
        });
        return res.status(200).json({ message: "Book added to favourites" });
    }
    
        
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//delete book from favourite
router.put('/deleteFavourite', authenticateToken, async (req, res) => {
    try {
        // console.log('delete response',req);
        const {bookid,id} = req.headers;
        const userData = await User.findById(id);
        const isFavaouriteBook = userData.favourites.includes(bookid);
        if(isFavaouriteBook){
            await User.findByIdAndUpdate(id,{
                $pull: { favourites: bookid }
            });
        }  
       
        return res.status(200).json({ message: "Book removed from favourites" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get favourite books from user
router.get('/getFavourites', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate('favourites');
        const favouriteBooks = userData.favourites;
        return res.status(200)
        .json({
            status: "successsss",
            data:favouriteBooks
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

module.exports = router;