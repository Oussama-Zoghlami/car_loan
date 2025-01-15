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
    }

})

module.exports=Car;

