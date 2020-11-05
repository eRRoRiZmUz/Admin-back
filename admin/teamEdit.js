const firebase = require('../serviceAccount/firebase').firebase
const users = firebase.collection('Users')
const public_chat = firebase.collection('Public Chat')
const teams = firebase.collection('Teams')

exports.getTeam = function (req , res){
    let game = req.body.game
    GetTeam(game ,function(result){
        res.status(200).json(result)
    })
}
async function GetTeam(game, callback){
    let arr =[]
    let i=0
    teams.where("game", "==" , `${game === 'dota' ? 'dota':'go'}`).limit(20).get().then(snapshot =>{
        snapshot.forEach(doc=>{
            let name = doc.id
            arr.push(name)
            i++
            if(i === snapshot.size){
                callback(arr)
            }
        })
    })
}
exports.getTeamField = function (req , res){
    let id = req.body.id
    let arr = []
    let i=0
    teams.doc(id).get().then(snapshot =>{
            teams.startAt(snapshot).limit(20).get().then(snapshot =>{
                snapshot.forEach(doc =>{
                    let name = doc.id
                    let m = doc.data()
                    arr.push(name)
                    arr.push(m)
                    i++
                    if(i === snapshot.size){
                        res.status(200).json(arr)
                    }
                })
            })
            
        });
}

exports.editField = function(req , res){
    let edit = req.body.edit
    let editName = req.body.editName
    let id = req.body.id
    teams.doc(id).update({
        [editName] : edit 
    })
    res.status(200).json("team field update")
}

exports.addTeamMember = function(req ,res){
    let username = req.body.username
    let teamName = req.body.teamName
    if(username === undefined ){
        res.status(400).json("username undefined")
    }
    else if(teamName === undefined){
        res.status(401).json("team name undefined")
    }
    else{
        users.doc(username).get().then(snapshot =>{
            if(snapshot.exists){
                teams.doc(teamName).collection('members').doc(username).set({
                    captain : false,
                    profile_pic : snapshot.data().profile_pic,
                    steam64 : snapshot.data().steam64
                })
                teams.doc(teamName).get().then(snapshot =>{
                    users.doc(username).collection('Teams').doc(teamName).set(snapshot.data())
                })
                res.status(200).json("hereglegchjiig bagt nemsen")
            }
            else{
                res.status(402).json("hereglegch oldsongui")
            }
        })
    }
}

exports.deleteTeamMember = function(req ,res){
    let username = req.body.username
    let teamName = req.body.teamName
    if(username === undefined){
        res.status(400).json("username undefined")
    }
    else if(teamName === undefined){
        res.status(401).json("team name undefined")
    }
    else{
        teams.doc(teamName).get().then(snapshot =>{
            if(snapshot.exists){
                teams.doc(teamName).collection('members').doc(username).delete()
                users.doc(username).collection('Teams').doc(teamName).delete()
                res.status(200).json("hereglegchiig bagaas haslaa")
            }
            else{
                res.status(402).json("bag oldsongui")
            }
        })
    }
}
