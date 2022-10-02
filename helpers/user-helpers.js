var db=require('../config/connection')
var collection=require('../config/collection')
//const bcrypt=require('bcrypt')



module.exports={

     //user signup
 

     doSignup:(userData)=>{
        console.log(userData);
        let msg="Email Already exixts"
        return new Promise(async(resolve,reject)=>{
            let email=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(!email)
            //userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.insertedId)
            })
            else{
                console.log('Email already exists');
                reject(msg)
            }
        })
        
     },
    



     //user login

     doLogin:(userData)=>{
        console.log(userData);
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let loginError=false
            let response={}
            
           let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.logEmail})


           if(user){
               if(user.password === userData.logPass){
                  console.log("login Success");
                  response.user=user
                  response.status=true
                  resolve(response)
               }
               else{
                   console.log("Login Failed");
                   resolve({status:false})
               }
           }
           else{
            console.log('Email not found');
            resolve({status:false})
           }
        })
     },




     //admin login

    adminLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}

            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.logEmail})

            if(admin){
                if(admin.password === adminData.logPass){
                    response.admin=admin
                    response.status=true
                    console.log('admin login success');
                    resolve(response)

                }
                else{
                    
                    console.log('admin login failed');       
                     resolve({status:false})
                }
            }
            else{
                resolve({status:false})
            }
        })
    }

}
