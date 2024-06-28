const mongoose = require('mongoose');
const user = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            
        },
        avatar: {
            type: String,
            default:"https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin']
        },
        favourites:[
            {
                type: mongoose.Types.ObjectId,
                ref: 'books'
            }
        ],
        cart:[
            {
                type: mongoose.Types.ObjectId,
                ref: 'books'
            }
        ],
        orders:[
            {
                type: mongoose.Types.ObjectId,
                ref: 'order'
            }
        ],
    
    },
    {timestamps: true}
);
module.exports = mongoose.model('user', user);