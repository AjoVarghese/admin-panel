var db=require('../config/connection')
var collection=require('../config/collection')
const objId=require('mongodb').ObjectId

module.exports={


    getAllUser:()=>{
        return new Promise(async(resolve,reject)=>{
            let userInfo=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            console.log(userInfo);
            resolve(userInfo)
        })
      
    },


    addUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
          let newUser=await db.get().collection(collection.USER_COLLECTION).insertOne(userData)
          resolve(newUser)
        })
    },

    deleteUser:(uId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objId(uId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },


    getUserDetails:(uId)=>{
        return new Promise((resolve,reject)=>{
           db.get().collection(collection.USER_COLLECTION).findOne({_id:objId(uId)}).then((details)=>{
              resolve(details)
           })

           
        })
    },

    // updateUser:(uId,userDetails)=>{
    //     console.log(uId+"gggggggggggg");
    //     return new Promise((resolve,reject)=>{
    //         db.get().collection(collection.USER_COLLECTION)
    //         .updateOne({id:objId(uId)},{
    //             $set:{
    //                 name:userDetails.name,
    //                 email:userDetails.email,
    //                 password:userDetails.password
    //             }
    //         }).then((response)=>{
    //             resolve()
    //         } )
    //     })
    // }
}