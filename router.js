const e = require('express')
const express=require('express')
const { Db, ObjectId } = require('mongodb')
const { response, route } = require('./app')
var db=require('./config/connection')
const router=express.Router()
const {objectId} =require('bson')
const objId=require('mongodb').ObjectId

const userHelpers=require('./helpers/user-helpers')
// const connection = require("./config/connection")
const collection = require('./config/collection')
const adminHelpers=require('./helpers/admin-helper')
const session = require('express-session')


//user signup

router.get('/',(req,res)=>{
    if(req.session.user){
        res.redirect('/home')
    }
    else if(req.session.admin){
        res.redirect('admin-panel')
    }
    else{
        res.render('user-signup',{title:'User Management'})
    
    }
})

router.post('/',(req,res)=>{
    // let errors=[]
    // let user=db.get().collection(collection.USER_COLLECTION).findOne({email:req.body.email})
    // if(user){
    //     errors.push({msg: 'Email already exists'});
    //         res.send('Email is already in use')
    // }
    // else{
        userHelpers.doSignup(req.body).then((response)=>{
            console.log(response);
            
           //  db.get().collection(collection.USER_COLLECTION).findOne()
           res.render('user-login',{title:'User Management'})
         })
        
        
    //   res.render('user-login')
})


//user home
router.get('/home',(req,res)=>{
    if(req.session.user){
        res.render('home',{title:'User Management'})
    }
    else if(req.session.admin){
        res.redirect('/admin-panel')
    }

    else{
        res.redirect('/')
    }
    // res.render('home')

})

//


//user-login

router.get('/user-login',(req,res)=>{
    if(req.session.user){
        res.redirect('home')
    }
    else if(req.session.admin){
        res.redirect('/admin-panel')
    }
    else{
        res.render('user-login',{title:'User Management'})
    }
     
})

router.post('/home',(req,res)=>{
    userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
            req.session.loggedIn=true
            req.session.user=response.user
            console.log(req.session.admin);
            res.render('home',{title:'User Management'})
            
        }
        else{
            res.redirect('/user-login')
           
        }
    })
    //  res.render('home')
})




//admin login route
router.get('/admin-login',(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin-panel')
    }
    else if(req.session.user){
        res.redirect('/home')
    }
    else{
        res.render('admin-login',{title:'User Management'})
    }
    
})


router.post('/admin-panel',(req,res)=>{
    userHelpers.adminLogin(req.body).then((response)=>{
        if(response.status){
            req.session.adminLoggedIn=true
            req.session.admin=response.admin
            res.redirect('admin-panel')
        }
        else{
            res.redirect('/admin-login')
        }
            

    })
    
})


//admin panel
router.get('/admin-panel',(req,res,next)=>{
 adminHelpers.getAllUser().then((userInfo)=>{
       console.log(userInfo);
       if(req.session.admin){
        res.render('admin-panel',{userInfo,title:'User Management'})
       }
      else  if(req.session.user){
        res.redirect('/home')
       }
       else{
        res.redirect('/admin-login')
       }
   })

})



//add-user
router.get('/add-user',(req,res)=>{
    if(req.session.admin){
        res.render('add-user',{title:'User Management'})
    }
    else if(req.session.user){
        res.redirect('/home')
    }
    
    else{
        res.redirect('/')
    }
})


router.post('/add-user',(req,res)=>{
  adminHelpers.addUser(req.body).then((newUser)=>{
    res.redirect('/admin-panel')
  })
})




//update-user
router.get('/update-user',async(req,res)=>{
    if(req.session.admin){
        var id = new objId(req.query.id)
        let update= await db.get().collection(collection.USER_COLLECTION).findOne({_id:id})
             //console.log(result);
             res.render('update-user',{data:update,title:'User Management'})  
    }
    else if(req.session.user){
        res.redirect('/home')
    }
    else{
        res.redirect('/')
    }
})
    
    
router.post('/update-user',(req,res)=>{
    let id=new objId(req.query.id)
    console.log(req.body)
    db.get().collection(collection.USER_COLLECTION)
    .updateOne({_id:id},
        {$set:{
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            }
        }).then(()=>{
        res.redirect("/admin-panel")
    }).catch((err)=>{
        console.log("err")
    })
})





//delete user

router.get('/delete-user/:id',(req,res)=>{
    if(req.session.admin){
        var uId=req.params.id
        adminHelpers.deleteUser(uId).then((response)=>{
        res.redirect('/admin-panel')
    })
    }
    else if(req.session.user){
        res.redirect('/home')
    }
    else{
        res.redirect('/')
    }
    
})


//user logout
router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.redirect('/user-login')
})

module.exports=router