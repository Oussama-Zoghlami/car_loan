const mongoose = require('mongoose');

const User = mongoose.model('User' , {
    name: {
        type:String
    },
    lastname:{
        type:String
    },
    age:{
        type:Number
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    loanedCars: [{ // Array of cars loaned by the user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }]

});
module.exports =User ;