const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {authenticateToken} = require('./userAuth');
const Book = require('../models/book');

//add book by admin
router.post('/addBook', authenticateToken, async (req, res) => {
    try {
        const {id} = req.headers;
        const user = await User.findById(id);
        if(user.role !== 'admin'){
            return res.status(400).json({ message: "You are not authorized to add book" });
        }
        const book = new Book({
            url:req.body.url,
            title:req.body.title,
            author:req.body.author,
            price:req.body.price,
            description:req.body.description,
            language:req.body.language
        });
        await book.save();
        res.status(200).json({ message: "Book added successfully" });
    } catch (error) {   
        res.status(500).json({ message: "Internal server Error" });
    }
});

//update book
router.put('/updateBook', authenticateToken, async (req, res) => {
    try {
        const {bookid} = req.headers;
        await Book.findByIdAndUpdate(bookid,{
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            description : req.body.description,
            language : req.body.language
        });
        return res.status(200).json({ message: "Book updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
}
);

//delete book
router.delete('/deleteBook', authenticateToken, async (req, res) => {
    try {
        const {bookid} = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get all books
router.get('/getAllBooks', async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1});
        return res.status(200).json({
            status:"success",
            data:books
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get recently added books limit to 4
router.get('/getRecentBooks', async (req, res) => {
    try {
        const books = await Book.find().sort({createdAt: -1}).limit(4);
        return res.status(200).json({
            status:"success",
            data:books
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});

//get book by id
router.get('/getBookById/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.status(200).json({
            status:"success",
            data:book
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server Error" });
    }
});
module.exports = router;
