const firebase = require('../serviceAccount/firebase').firebase
const users = firebase.collection('Users')


exports.send = function(req, res) {
    let username = req.payload.username
    let usern = req.body.username
    if(usern === undefined) {
        res.status(401).json({
            error : "username undefined"
        })
    }
    else{
        users.doc(username).get().then(snapshot =>{
            if(snapshot.exists){
                users.doc(username).collection('sent').doc(usern).set({
                    name : usern
                })
                users.doc(usern).collection('request').doc(username).set({
                    name : username
                })
                res.status(200).json(usern)
            } 
            else{
                res.status(402).json({
                    error : "hereglegch oldsongui"
                })
            }
        })    
    }
}   
exports.cancel = function(req , res){
    let username = req.payload.username
    let usern = req.body.username
    users.doc(usern).get().then(snapshot =>{
        if(snapshot.exists){
            users.doc(usern).collection('request').doc(username).get().then(snapshot => {
                if(snapshot.exists){
                    users.doc(usern).collection('request').doc(username).delete()
                    users.doc(username).collection('sent').doc(usern).delete()
                }
                else{
                    res.status(403).json({
                        error : "hereglegch oldsongui"
                    })
                }   
            })
        }
        else{
            res.status(403).json({
                error : "hereglegch oldsongui"
            })
        }
    })  
}
exports.accept = function(req , res){
    let username = req.payload.username
    let usern = req.body.username
    users.doc(usern).get().then(snapshot =>{
        if(snapshot.exists){
            acceptRequest(usern ,username).then(result =>{
                if(result){
                    res.status(200).json("accept hiilee")
                }
            })
        } 
        else{
            res.status(404).json({
                error : "hereglegch oldsongui"
            })
        }
    }) 
}

async function acceptRequest(usern,username) {
    await users.doc(username).collection('friend').doc(usern).set({
        name : usern
    })
    await users.doc(username).collection('sent').doc(usern).delete()

    await users.doc(usern).collection('friend').doc(username).set({
        name : username
    })
    await users.doc(usern).collection('request').doc(username).delete()
    return true
}