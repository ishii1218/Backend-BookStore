const mongoose = require('mongoose');
const order = new mongoose.Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'user'
        },
        book: 
        {
            type: mongoose.Types.ObjectId,
            ref: 'books'
        },
        
        status: {
            type: String,
            default: 'In Collection',
            enum: [ 'In Collection','Reading', 'Finished']
        },
        rating: {
            type: Number,
            default: '',     
        },

    },
    {timestamps: true}
);
module.exports = mongoose.model('order', order);