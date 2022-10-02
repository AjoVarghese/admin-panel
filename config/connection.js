// const mongoClient=require('mongodb').MongoClient
// const state={
//     db:null
// }

// module.exports.connect=function(done){
//     const url='mongodb://localhost:27017'
//     const dbname='userDb'
   
    
//     //creating connection
//     mongoClient.connect(url,(err,data)=>{
//         if(err) return done(err)
//         state.db=data.db(dbname)
//         done()
//     })
     

// }

// //to get the connection
// module.exports.get=function(){
//     return state.db
// }

const MongoClient = require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect = function (done){
    const url = "mongodb://0.0.0.0:27017/"
    const dbname = 'userDb'

    MongoClient.connect(url,(err,data)=>{
        if(err) return done (err)
        state.db = data.db(dbname)

    })

    done()
}

module.exports.get=function (){
    return state.db
}