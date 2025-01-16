const express =require('express');
const router =express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


//singup

router.post('/register', async (req ,res)=>{
    data = req.body;
    usr = new User(data);
    salt = bcrypt.genSaltSync(10);
    cryptedPass = await bcrypt.hashSync( data.password , salt);

    usr.password = cryptedPass;

    usr.save()
        .then(
            (saved)=>{
                res.status(200).send(saved)
            }
        )
        .catch(
            (err)=>{
                res.send(err)
            }
        )
})


//signin
router.post('/login' , async (req ,res )=>{
    data =req.body;

    user = await User.findOne({ email : data.email })

    if(!user){
        res.status(404).send('email or password invalid !')

    }else{
        validPass = bcrypt.compareSync(data.password , user.password)

        if(!validPass){
            res.status(401).send('email or password invalid !!')
        }else{
            payload = {
                _id: user._id,
                email: user.email,
                name: user.name
            }
            token = jwt.sign( payload , '1234567')

            res.status(200).send({ mytoken :token})
        }
    }
})



//async
router.post('/create',async (req ,res)=>{

    try{

        data=req.body;
        usr = new User(data);
        savedUser= await usr.save();
        res.send(savedUser);

    }catch(error){
        res.send(error);
    }
})


router.get('/getall',(req ,res)=>{
    User.find()
    .then(
        (users)=>{
            res.send(users);
        }
    ).catch(
        (err)=>{
            res.send(err);
        }
    )
});

//async condition age
router.get('/all',async (req ,res)=>{
    try{
        users = await User.find({age:20});
        res.send(users);
    }catch(error){
        res.send(error);
    }

})

router.get('/getById/:id',(req,res)=>{
    myid = req.params.id;
    User.findOne({_id:myid})
        .then(
            (user)=>{
                res.send(user);
            }
        )
        .catch(
            (err)=>{
                res.send(err);
            }
        )

})

//async getById
router.get('/byId/:id',async(req, res)=>{
    try{
        id=req.params.id;
        user=await User.findById({_id:id});
        res.send(user);
    }
    catch(error){
        res.send(error);
    }
})

router.put('/update/:id',(req ,res)=>{
    id=req.params.id;
    newData=req.body;

    User.findByIdAndUpdate({_id:id},newData)
    .then (
        (updated)=>{
            res.send(updated);
        }
    ).catch(
        (error)=>{
            res.send(error);
        }
    )
    
    
});
//update async
router.put('/upt/:id',async(req,res)=>{
    try{
    id=req.params.id;
    newData=req.body;
    updated= await User.findByIdAndUpdate({_id:id},newData);

    res.send(updated);
    } catch(error){
        res.send(error);
    }
})




router.delete('/delete/:id',(req ,res)=>{
    id=req.params.id;
    User.findOneAndDelete({_id:id})
        .then(
            (deleteUser)=>{
                res.send(deleteUser);
            }
        )
        .catch(
            (err)=>{
                res.send(deleteUser);
            }
        )
});
//delete async
router.delete('/deleteById/:id',async(req,res)=>{
    try{
        id=req.params.id;
        deleteUser= await User.findByIdAndDelete({_id:id});
        res.send(deleteUser);
    }
    catch(error){
        res.send(error);
    }
})




module.exports = router;