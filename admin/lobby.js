const firebase = require('../serviceAccount/firebase').firebase
const users = firebase.collection('Users')
const match_server = firebase.collection('Match_Servers')
const teams = firebase.collection('Teams')

exports.SeeLobbyUsers = function(req , res){
    let username = req.body.username 
    let arr =[]
    let i=0
    getUserField(username,function(result){
        match_server.doc(result.data().match_server).collection(result.data().match_team).get().then(snapshot =>{
            snapshot.forEach( doc =>{
                let name = doc.id
                arr.push(name)
                i++;
                if(i=== snapshot.size){
                    res.status(200).json(arr)
                }
            })
        })
    })
}
exports.KickLobby = function(req , res){
    let username = req.body.username
    console.log(username)
    getUserField(username,function(result){
        match_server.doc(result.data().match_server).collection(result.data().match_team).doc(username).delete()
        users.doc(username).update({
            match_server: null,
            match_team : null
        })
    })
    res.status(200).json("lobby noos kickelsen")
}
async function getUserField(username , callback){
    users.doc(username).get().then(snapshot =>{
        if(snapshot.exists){
            callback(snapshot);
        }
    })
}