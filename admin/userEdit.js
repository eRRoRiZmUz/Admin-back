const firebase = require('../serviceAccount/firebase').firebase
const storage = require('../serviceAccount/firebase').storage
const bucket = storage.bucket();
const users = firebase.collection('Users')
const crypto = require('crypto');
const fs =require("fs"); 
const base64ToImage = require('base64-to-image');
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const nodemailer = require("nodemailer");
const maxSize =  5 * 1024 * 1024 // file size ihdee 1MB
const CONFIG = {                                                                      
    action: 'read',                                                               
    expires: '03-01-2500',                                                        
}
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

exports.sortUser = function(req , res){
    let type = req.body.type
    let time = req.body.type
    let arr =[]
    let i = 0
    let obj = new Object()
    if(req.body ===undefined){
        res.status(400).json({
            error:"body undefined"
        })
    }
    else{
        if(type === undefined){
            letterSort(arr , i , function(result){
                res.status(200).json(result)
            })
        }
        else if(type === 'date'){
            dateSort( time ,arr , i , function(result){
                res.status(200).json(result)  
            })
        }
        else if( type === 'gommr'){
            GoMmrSort(obj ,i , function(result){
                res.status(200).json(result)
            })
        }
        else if(type === 'dotammr'){
            DotaMmrSort(obj,i,function(result){
                res.status(200).json(result)
            })
        }
        else if(type ==='wallet'){
            walletSort(obj,i,function(result){
                res.status(200).json(result)
            })
        }
        else if(type ==='premium'){
            premiumSort(arr , i,function(result){
                res.status(200).json(result)
            })
        }
        else{
            res.status(400).json({
               error: "iim type alga"
            })
        }
    }
}

exports.ProfileEdit = function(req , res){
    let usern = req.body.usern
    let key = req.body.key
    let value = req.body.value 
    if(body === undefined){
        res.status(401).json("body undefined")
    }
    else{
        users.doc(usern).get().then(snapshot =>{
            if(snapshot.exists){
                if(key === "email"){
                    users.doc(usern).update({
                        email : value
                    })
                    res.status(200).json({
                        success:"email update hiigdsen"
                    })
                }
                else if(key === "bankaccount"){
                    users.doc(usern).update({
                        bankAccount : value
                    })
                    res.status(200).json({
                        success:"bank account update hiigdsen"
                    })
                }
                else if(key === "Gommr"){
                    users.doc(usern).update({
                        champs_csgo_mmr : value
                    })
                    res.status(200).json({
                        success:"Go mmr update hiigdsen"
                    })
                }
                else if(key ==="dotammr"){
                    users.doc(usern).update({
                        dota_mmr : value
                    })
                    res.status(200).json({
                        success:"Dota mmr update hiigdsen"
                    })
                }
                else if(key ==="steam64"){
                    users.doc(usern).update({
                        steam64 : value
                    })
                    res.status(200).json({
                        success :"steam update hiigdsen"
                    })
                }
                else if(key ==="wallet"){
                    users.doc(usern).update({
                        wallet : value
                    })
                    res.status(200).json({
                        success: "wallet update hiigdsen"
                    })
                }
                else{
                    res.status(400).json({
                        error: "iim key alga"
                     })
                }
            }
            else{
                res.status(400).json({
                    error:"hereglegch oldsongui"
                })
            }
        })
    }
}

exports.temporaryPass = function(req , res ){
 let password = req.body.password
 let usern = req.body.usern
 users.doc(usern).get().then(snapshot =>{
     if(snapshot.exists){
        encryptPassword(password).then(result =>{
            users.doc(usern).update({
                temporary_password : result
            })
        })
        res.status(200).json({
            success:"tur zuriin pass update hiilee"
        })
     }
     else{
         res.status(401).json({
             error:"hereglegch oldsongui"
            })
     }
 })   
}

exports.profilePicEdit = function(req , res){
    let username = req.payload.username
    let image = fs.readFileSync('image.txt', 'utf8');
    let path ='./';
    let optionalObj = {'fileName': username, 'type':'png'};;
    let imageInfo = base64ToImage(image,path, optionalObj);     
    
    let base64String = image;
    let stringLength = base64String.length - 'data:image/png;base64,'.length;
    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
    let sizeInKb=sizeInBytes/1000;
    imag(optionalObj ,username,imageInfo  ,sizeInKb,function(result) {
        signUrl(result, CONFIG, username, res).then(result =>{
            if(result){
                fs.unlink(username+'.png', function(err){
                    console.log(err)
                })
                res.status(200).json("zuragiig soliloo ")
            }
        }) 
    })
    imagDelete(username,function(result){
        if(result){
            res.status(200).json("zurag shinechlegdlee")
        }
    })
}

exports.RegistrationToday = function(req , res){
    let time = req.body.time
    let i=0
    users.orderBy('time' , 'desc').startAfter(time).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            let key = Object.values(doc.data().time)[0];
            console.log(key)
            if(time < key){
                i++;    
            }
            res.status(200).json(i)
        })
        
    })
}


exports.bankAccount = function(req ,res){
    let i=0
    let obj = new Object()
    users.get().then(snapshot =>{
        snapshot.forEach( doc=>{
            obj[doc.id] = doc.data().bankAccount  
            let arr = getBankaccount(obj)      
            i++;
            if(i === snapshot.size){
                res.status(200).json(arr)
            }
        })       
    })
}
function getBankaccount(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    return arr; 
}

exports.RegistrationUser = function(req , res){
    let username = req.body.username
    let email= req.body.email
    let phone = req.body.phone
    let password = req.body.password
    let now = new Date()
    encryptPassword(password).then(snapshot =>{
        let item ={
            email : email,
            username : username,
            phone : phone,
            password : snapshot,
            expiry : now.getTime()+5000
        }
        localStorage.setItem("inf",JSON.stringify(item))
        console.log(localStorage.getItem("inf"));
    })
} 

exports.sendVerificationCode = function(req , res){
    let username = req.body.username
    let a = Math.floor(1000 + Math.random() * 9000)
    let now = new Date()
        
   let temp = localStorage.getItem("inf")
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure : false,
        auth: {
          user: 'altanshagaid9@gmail.com',
          pass: '*********'
        }
      });
      
        let mailOptions = {
            from: 'altanshagaid9@gmail.com',
            to: temp.email,
            subject: 'Champs camp',
            text: a +'  '+'verifications code'
      };

      let item ={
          code : a,
          expiry : now.getTime()+ 60000
      } 
      localStorage.setItem("code :",JSON.stringify(item));
      console.log(localStorage.getItem("code :"));

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            res.status(200).json({
                success: "code ilgeegdsen"
            })
            console.log('Email sent: ' + info.response);
        }
    });
}

async function letterSort(arr , i , callback){
    users.orderBy('time','desc').limit(2).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            let name = doc.id
            arr.push(name)
            i++;
            if(i===snapshot.size)
            {
                callback(arr)
            }
        })
    })
}

async function DotaMmrSort(obj , i , callback){
    users.limit(2).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            obj[doc.id] = doc.data().dota_mmr
            let arr =sortObject(obj)
            i++;
            if(i ===snapshot.size){
                callback(arr)
            }
        })
    })
}

async function GoMmrSort( obj,i ,callback) {
    
    users.limit(2).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            obj[doc.id] = doc.data().champs_csgo_mmr
            let arr =sortObject(obj)
            i++;
            if(i ===snapshot.size){
                callback(arr)
            }
        })
    })
}

function sortObject(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return a.value - b.value; });
    return arr;
}

async function dateSort(time,arr , i,callback) {
    users.orderBy('time','desc').startAfter(time).limit(3).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            let name = doc.id
            arr.push(name)
            i++;
            if(i===snapshot.size)
            {
                callback(arr)
            }
        })
    })
}

async function walletSort(obj , i , callback){
    users.limit(2).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            obj[doc.id] = doc.data().wallet
            let arr =sortObject(obj)
            i++;
            if(i ===snapshot.size){
                callback(arr)
            }
        })
    })
}

async function premiumSort(arr , i,callback) {
    users.limit(3).get().then(snapshot =>{
        snapshot.forEach(doc =>{
            if(doc.data().premium === true){
                let name = doc.id
                arr.push(name)
            }
            i++;
            if(i ===snapshot.size){
                callback(arr)
            }
        })
    })
}

async function imag(optionalObj , username,imageInfo,sizeInKb, callback){
    if(sizeInKb<maxSize){
        (async () => {
            const files = await imagemin([username+'.png'], {
              destination: "./",
              plugins: [
                imageminPngquant({
                  quality: [0.5, 0.6]
                })
              ]
            });
            bucket.upload(username+'.png', {
                destination: `users/${username}/profile/${optionalObj.fileName}.${optionalObj.type}` }, function(err, file){
                    callback(file);
            })
          })();
    }
    else{
        console.log("zurgiin hemjee ih bn ")
    }
        
}
async function signUrl(file, CONFIG, username, res){          
    await file.getSignedUrl(CONFIG, function(err, url) {       
        if(err){
            console.log(err)
            res.status(406).json(err)
        }
        else{
            console.log(url);
            users.doc(username).update({
                profile : url
            })
        }                                                                   
    });
    return true
}
async function imagDelete(username,callback){
    await imag(username,function(result){
        if(result.exists){
                bucket.delete(username+'png',function(err,file){
                callback(file);
            })
        }
    })
}
async function encryptPassword(password) {
    let salt = await crypto.randomBytes(16).toString('hex');
    let hash = await crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {salt : salt, hash : hash}
}