const firebase = require('../serviceAccount/firebase').firebase
const storage = require('../serviceAccount/firebase').storage
const bucket = storage.bucket();
const users = firebase.collection('Users')
const team_dota = firebase.collection('Team Dota')
const team_go = firebase.collection('Team GO')
const sent = "team_sent_request"
const request = "team_request"
const fs =require("fs"); 
const base64ToImage = require('base64-to-image');
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const images = require("../image");
const maxSize =  1 * 1024 * 1024 // file size ihdee 1MB

const CONFIG = {                                                                      
    action: 'read',                                                               
    expires: '03-01-2500',                                                        
}

exports.register = function(req , res){
    let username = req.payload.username
    let teamName = req.body.teamName;
    let game = req.body.game;
    let tag = req.body.tag

    let symbols=  /[-!$%^&*()+~=`{}\[\]:";<>?,.\/]/;

    if(teamName === undefined) {
        res.status(401).json({
            error : "teamName undefined"
        })
    } else if(symbols.test(teamName)) { 
        res.status(403).json({
            error : "teamName er"
        })
    }  else{
        fires(game, teamName,username, tag).then(result =>{
            if(result){
                res.status(200).json({
                    game : game,
                    team_name : teamName
                })
            }
        })
    }
}

exports.send = function(req , res){
    let username = req.payload.username
    let usern = req.body.usern
    let teamName = req.body.teamName
    let game =req.body.game

    if(usern === undefined){
        res.status(401).json({
            error : "username undefined"
        })
    }else{
        users.doc(username).get().then(snapshot =>{
            if(snapshot.exists){
                selectGame(teamName, game).then(coll =>{
                    coll.get().then(snapshot=>{
                        if(snapshot.exists){
                            users.doc(username).collection(sent).doc(usern).set({
                                Team_name : teamName
                            })
                            users.doc(usern).collection(request).doc(username).set({
                                Team_name : teamName
                            })
                            res.status(200).json(usern)
                        }else{
                            res.status(402).json({
                                error : "bag oldsongui"
                            })
                        }
                    })  
                })
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
    let usern = req.body.usern
    users.doc(usern).get().then(snapshot =>{
        if(snapshot.exists){
            users.doc(usern).collection(request).doc(username).get().then(snapshot => {
                if(snapshot.exists){
                    users.doc(usern).collection(request).doc(username).delete()
                    users.doc(username).collection(sent).doc(usern).delete()
                    res.status(200).json("cancel hiilee")
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
    let usern = req.body.usern
    let game = req.body.game
    let teamName = req.body.teamName
    users.doc(usern).get().then(snapshot =>{
        if(snapshot.exists){
            acceptRequest(usern , username , game , teamName).then(result =>{
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

exports.removeMember = function(req , res){
    let username = req.payload.username
    let usern = req.body.usern
    let teamName = req.body.teamName
    let game = req.body.game
    users.doc(usern).get().then(snapshot => {
        if(snapshot.exists){
            deleteMember(username , usern,teamName,res,game).then(result =>{
                if(result){
                    res.status(200).json("delete member")
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

exports.selectCaptain = function(req, res){
    let username = req.payload.username
    let usern = req.body.usern
    let teamName = req.body.teamName
    let game = req.body.game
    users.doc(usern).get().then(snapshot =>{
        if(snapshot.exists){
            replaceCaptain(username , usern, teamName, game).then(result => {
                if(result){
                    res.status(200).json("captan soligdloo")
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

exports.uploadProfilePic = function(req , res){
    let username = req.payload.username
    let teamName = req.body.teamName
    let game = req.body.game
    let image = fs.readFileSync('image.txt', 'utf8');
    let path ='./';
    let optionalObj = {'fileName': teamName, 'type':'png'};;
    let imageInfo = base64ToImage(image,path, optionalObj);     
    
    let base64String = image;
    let stringLength = base64String.length - 'data:image/png;base64,'.length;
    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    let sizeInKb=sizeInBytes/1000;

    imag(optionalObj ,teamName,sizeInKb,function(result) {
        signUrl(result, CONFIG, teamName,game, res).then(result =>{
            if(result){
                fs.unlink(teamName+'.png', function(err){
                    console.log(err)
                })
                res.status(200).json("zurag hadaglagdlaa")
            }
        }) 
    })
    imagDelete(username,function(result){
        if(result){
            res.status(200).json("zurag shinechlegdlee")
        }
    })
}

async function imag(optionalObj , teamName,sizeInKb, callback){
    if(sizeInKb<maxSize){
        (async () => {
            const files = await imagemin([teamName+'.png'], {
              destination: "./",
              plugins: [
                imageminPngquant({
                  quality: [0.5, 0.6]
                })
              ]
            });
            bucket.upload(teamName+'.png', {
                destination: `Teams/${teamName}/profile/${optionalObj.fileName}.${optionalObj.type}` }, function(err, file){
                    callback(file);
            })
          })();
    }
    else{
        console.log("zurgiin hemjee ih bn ")
    }
}

async function signUrl(file, CONFIG, teamName,game, res){          
    await file.getSignedUrl(CONFIG, function(err, url) {       
        if(err){
            console.log(err)
            res.status(406).json(err)
        }
        else{
            selectGame(teamName, game).then(coll =>{
                coll.update({
                    profile : url
                })
            })
        }                                                                   
    });
    return true
}

async function imagDelete(teamName,callback){
    await imag(teamName,function(result){
        if(result.exists){
                bucket.delete(teamName+'png',function(err,file){
                callback(file);
            })
        }
    })
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

async function replaceCaptain(username , usern, teamName,game){
    selectGame(teamName, game).then(coll =>{
            coll.get().then(snapshot => {
            if(snapshot.exists){
                let captain = snapshot.data().captain;
                coll.update({
                    captain : usern
                })
                coll.collection('members').get().then(snapshot =>{
                    snapshot.forEach(doc =>{
                        if(doc.id !== username){
                            users.doc(doc.id).collection('Teams').doc(teamName).collection('members').doc(usern).update({
                                captain : true
                            })
                            users.doc(doc.id).collection('Teams').doc(teamName).collection('members').doc(captain).update({
                                captain : false
                            })
                            users.doc(doc.id).collection('Teams').doc(teamName).update({
                                captain : usern
                            })
                        }
                    })
                    users.doc(username).collection('Teams').doc(teamName).collection('members').doc(usern).update({
                        captain : true
                    })
                    users.doc(username).collection('Teams').doc(teamName).update({
                        captain : usern
                    })
                })
            }
            else{
                res.status(403).json({
                    error : "bag odlsongui"
                })  
            } 
        })
    })
    return true
}

async function deleteMember(username , usern ,teamName, res,game){
    selectGame(teamName , game).then(coll =>{
        coll.get().then(snapshot =>{
            if(snapshot.exists){
                coll.collection('members').get().then(snapshot =>{
                    snapshot.forEach(doc =>{
                        if(doc.id !==usern){
                            users.doc(doc.id).collection('Teams').doc(teamName).collection('members').doc(usern).delete()
                        }
                    })
                    users.doc(username).collection('Teams').doc(teamName).collection('member').doc(usern).delete()
                    coll.collection('members').doc(usern).delete()
            })
        }
            else{
                res.status(403).json({
                    error : "bag odlsongui"
                })
            }
        })
    })
    return true
}

async function acceptRequest(usern , username , game , teamName) {
        selectGame(teamName, game).then(coll => {
            users.doc(username).get().then(snapshot =>{
                coll.collection('members').doc(username).set({
                    information : snapshot.data()
                })
            })
            users.doc(usern).get().then(snapshot =>{
                coll.collection('members').doc(usern).set({
                    information : snapshot.data()
                })
                users.doc(username).collection(sent).doc(usern).delete()
                coll.collection('members').get().then(snapshot => {
                    snapshot.forEach(doc =>{
                        users.doc(doc.id).collection('Teams').doc(teamName).collection('members').doc(usern).set({
                            captain : false
                        })
                    })
                })  
                users.doc(usern).collection('Teams').doc(teamName).collection('members').doc(usern).set({
                    captain : false
                })
                users.doc(usern).collection('Teams').doc(teamName).collection('members').doc(username).set({
                    captain : true
                })
                users.doc(username).collection('Teams').doc(teamName).collection('members').doc(username).set({
                    captain : true
                })           
                users.doc(usern).collection(request).doc(username).delete()
            })
            users.doc(usern).collection('Teams').doc(teamName).set({
                    tag : tag,
                    captain : username
                })
        })
    return true
}
async function fires( game, teamName,username,tag){
    await users.doc(username).get().then(snapshot => {
        if(snapshot.exists){
            users.doc(username).collection('Teams').doc(teamName).set({
                tag : tag,
                captain : username
            })
            users.doc(username).collection('Teams').doc(teamName).collection('members').doc(username).set({
                captain : true
            })
            if(game === 'dota'){
                team_dota.doc(teamName).set({
                    tag : tag,
                    captain : username
                })
                team_dota.doc(teamName).collection('members').doc(username).set({
                    captain : true

                })
            }
            else{
                team_go.doc(teamName).set({
                    tag : tag,
                    captain : username
                })
                team_go.doc(teamName).collection('members').doc(username).set({
                    captain : true
                })
            }
        }
    })
    return true
}
