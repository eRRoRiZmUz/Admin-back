const firebase = require('../serviceAccount/firebase').firebase
const users = firebase.collection('Users')
const public_chat = firebase.collection('Public Chat')
const team_dota = firebase.collection('Team Dota')
const team_go = firebase.collection('Team GO')


exports.publicChat = function(req, res){
    let username = req.payload.username
    let msg = req.body.msg
    if(msg === undefined){
        res.status(401).json("msg alga")
    }
    else{
        publicChats(username , msg).then(result =>{
            if(result){
                res.status(200).json("chat ilgeegdlee")
            }
        })
    }
}
exports.teamChat = function(req , res){
    let username = req.payload.username
    let teamName = req.body.teamName
    let msg = req.body.msg
    let game = req.body.req
    teamChats(teamName , username , game, msg).then(result => {
        if(result){
            res.status(200).json("chat ilgeegdlee")
        }
    })
}
exports.privateChat = function(req , res){
    let username = req.payload.username
    let msg = req.body.msg
    let usern = req.body.usern
    privateChats(username , msg , usern, res).then(result => {
        if(result){
            res.status(200).json("chat ilgeegdlee")
        }
    })
}

exports.getChat = function(req , res){
    let test = []
    let m=0
    public_chat.orderBy('time' , 'desc').limit(20).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            let a = doc.data().msg
            test.push(a)
            console.log(test)
            m++;
            console.log(snapshot.size)
            if(m===snapshot.size){
                res.status(200).json(test)
            }
        })
    })
}
exports.getChatPac = function (req , res){
    let arr =[]
    let i=0
    let id = req.body.idk
    console.log(id)
    public_chat.doc(id).get().then(snapshot =>{
        public_chat.orderBy('time' , 'desc').startAt(snapshot).limit(5).get().then(snapshot =>{
            snapshot.forEach(doc => {
                let m = doc.data().msg
                arr.push(m)
                i++
                if(i === snapshot.size){
                    res.status(200).json(arr)
                }
            })
        })
    })
}

async function privateChats(username, msg, msg1, usern, res){
    users.doc(usern).get().then(snapshot => {
        if(snapshot.exists){
            users.doc(username).get().then(info => {
                users.doc(usern).collection('chat').doc(username).set({
                    profile_picture : info.data().profile,
                    email : info.data().email
                })
              });
            users.doc(usern).collection('chat').doc(username).collection('messages').add({
                name : username,
                msg : msg,
                time : new Date()
            })
            users.doc(username).collection('chat').doc(usern).collection('messages').add({
                name : username,
                msg : msg,
                time : new Date()
            })
        }
        else{
            res.status(402).json("hereglegch alga")
        }
    })
    return true
}

async function teamChats(teamName ,username , game, msg){
    selectGame(teamName  , game).then(coll =>{
        users.doc(username).get().then(snapshot =>{
            coll.collection('chat').add({
                name : username,
                msg : msg,
                time : new Date(),
                profile_picture : snapshot.data().profile,
                email : email
            })
        })
    })
    return true
}
async function selectGame(teamName,game){
    let coll
    if(game==='dota'){
        coll = team_dota.doc(teamName)
    }
    else{
        coll = team_go.doc(teamName)
    }
    return coll
}

async function publicChats(username , msg){
    await users.doc(username).get().then(snapshot =>{
        public_chat.add({
            name : username,
            msg : msg,
            time : new Date(),
            profile_picture : snapshot.data().profile,
            email : email
        }) 
    })                
        return true
}