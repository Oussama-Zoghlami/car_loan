const mongoose =require('mongoose');


const Car =mongoose.model('Car' ,{
    modele:{
        type:String
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    image:{
        type:String
    }, 
    loanedBy: { // Reference to the User who loaned this car
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Default to null if the car is not loaned
    }

})

module.exports=Car;

