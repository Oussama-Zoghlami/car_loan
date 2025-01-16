const express =require('express');
const router =express.Router();

const Car =require('../models/car');


router.post('/addCar',(req , res)=>{
    data =req.body;
    car = new Car(data);

    car.save()
        .then(
            (savedCar)=>{
                res.status(200).send(savedCar)
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err)
            }
        )
});


//async
router.post('/createCar',async (req ,res)=>{

    try{

        data=req.body;
        car = new Car(data);
        savedCar= await car.save();
        res.status(200).send(savedCar);

    }catch(error){
        res.status(400).send(error);
    }
})

router.get('/getAllCars',(req ,res)=>{
    Car.find()
    .then(
        (cars)=>{
            res.status(200).send(cars);
        }
    ).catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
});

//async condition age
router.get('/allCar',async (req ,res)=>{
    try{
        cars = await Car.find({modele:"BMW"});
        res.status(200).send(cars);
    }catch(error){
        res.status(400).send(error);
    }

})

router.get('/getCarById/:id',(req,res)=>{
    myid = req.params.id;
    Car.findOne({_id:myid})
        .then(
            (cars)=>{
                res.status(200).send(cars);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )

})

//async getById
router.get('/carById/:id',async(req, res)=>{
    try{
        id=req.params.id;
        car=await Car.findById({_id:id});
        res.status(200).send(car);
    }
    catch(error){
        res.status(400).send(error);
    }
})

router.put('/updateCar/:id',(req ,res)=>{
    id=req.params.id;
    newData=req.body;

    Car.findByIdAndUpdate({_id:id},newData)
    .then (
        (updated)=>{
            res.status(200).send(updated);
        }
    ).catch(
        (error)=>{
            res.status(400).send(error);
        }
    )
    
    
});
//update async
router.put('/uptCar/:id',async(req,res)=>{
    try{
    id=req.params.id;
    newData=req.body;
    updated= await Car.findByIdAndUpdate({_id:id},newData);

    res.status(200).send(updated);
    } catch(error){
        res.status(400).send(error);
    }
})




router.delete('/deleteCar/:id',(req ,res)=>{
    id=req.params.id;
    Car.findOneAndDelete({_id:id})
        .then(
            (deleteCar)=>{
                res.status(200).send(deleteCar);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(deleteUser);
            }
        )
});
//delete async
router.delete('/deleteCarById/:id',async(req,res)=>{
    try{
        id=req.params.id;
        deleteCar= await Car.findByIdAndDelete({_id:id});
        res.status(200).send(deleteCar);
    }
    catch(error){
        res.status(400).send(error);
    }
})



module.exports = router;

