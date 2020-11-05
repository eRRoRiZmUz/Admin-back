const firebase = require('../serviceAccount/firebase').firebase
const storage = require('../serviceAccount/firebase').storage
const bucket = storage.bucket();
const users = firebase.collection('Users')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');
const validator = require("email-validator");
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

exports.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;
        
    users.doc(username.toLowerCase()).get().then(snapshot => {
        let hash = snapshot.data().pass.hash
        let salt = snapshot.data().pass.salt
        validatePassword(password , hash, salt).then(result =>{
            if(result){
                toAuthJSON(username).then(result=> {
                    res.status(200).json(result)
                })
            }
            else{
                res.status(405).json({
                    error: "pass buruu bn "
                })
            }
        })
    })
}


exports.register = function(req, res) {



    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;


    let symbols=  /[-!$%^&*()+| ~=`{}\[\]:";'<>?,.\/]/;
    

    let schema = new passwordValidator();
    schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    //.has().uppercase()                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits()                                 // Must have digits
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
    
    validator.validate("test@email.com"); // true

    console.log(validator.validate(email),'email')

    console.log(schema.validate(password),'pass');
    

    console.log(username.length , 'urt');

    console.log(symbols.test(username),'user')
    
    if(username === undefined) {
        res.status(401).json({
            error : "username undefined"
        })
    } else if(schema.validate(password)===false){
        res.status(402).json(schema.validate(password, { list: true }))
    } else if(symbols.test(username)) { 
        res.status(403).json({
            error : "username er"
        })
    } 
    else if(validator.validate(email)===false){
        res.status(404).json({
            error : "email ee shalgana uu "
        })
    }
    // else if(username.length >=8 && username.length<= 15){
    //     res.status(404).json({
    //         error : "username 8s hetersen bn "
    //     })
    // }
    else{

        encryptPassword(password).then(result =>{
            toAuthJSON(username).then(rest => {
                fire(result, rest, email).then(f =>{
                    if(f){
                        res.status(200).json(rest)
                    }
                })    
            })
            
        })
    }
}


exports.image = function (req , res){
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
exports.uploadImg = function(req , res) {
    let username = req.payload .username
    let imageName = req.body.username
    let data = [];
    let m=0;
    bucket.getFiles({ prefix: `users/${username}/gallery/`}).then(function(snapshot) {
        console.log(snapshot)
            if(snapshot){
                bucket.deleteFiles({ prefix:`users/${username}/gallery/${imageName}/.png/`})
                res.status(200).json("zurag ustgagdlaa")
                images.Images.forEach(function (image, i) {
                    let optionalObj = {fileName: i+1, type:'png'};
                    let path ='./';
                    let imageInfo = base64ToImage(image,path, optionalObj); 
                    let base64String = image;
                    let stringLength = base64String.length - 'data:image/png;base64,'.length;
                    let sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
                    let sizeInKb=sizeInBytes/1000;
                    addImage(optionalObj ,username,imageInfo, sizeInKb, i,function(result) {
                        signUrlGallery(result, CONFIG, res, function(result){
                                m++;
                                fs.unlink((i+1)+'.png', function(err){
                                    console.log(err)
                                })
                                data.push(result)
                                if(m===images.Images.length){
                                    users.doc(username).update({
                                        gallery : data
                                    })
                                    res.status(200).json("zurag hadaglagdlaa")
                                }
                            
                        }) 
                    }) 
                });
            }
        })
}

async function addImage( optionalObj,username , imageInfo,sizeInKb ,i, callback){
    if(sizeInKb < maxSize){
        (async () => {
            const files = await imagemin([(i+1)+'.png'], {
              destination: "./",
              plugins: [
                imageminPngquant({
                  quality: [0.5, 0.6]
                })
              ]
            });
            bucket.upload((i+1)+'.png', {
                destination: `users/${username}/gallery/${optionalObj.fileName}.${optionalObj.type}` }, function(err, file){
                    callback(file);
            })
          })();
    }
    else{
        console.log("zurgiin hemjee ih bn ")
    }
}

async function signUrlGallery(file, CONFIG, res,callback){          
    await file.getSignedUrl(CONFIG, function(err, url) {      
            if(err){
                console.log(err)
                res.status(406).json(err)
            } else{
                callback(url)
            }                                                    
    });
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


async function validatePassword(password, user_hash, user_salt) {
    const hash = await crypto.pbkdf2Sync(password, user_salt, 10000, 512, 'sha512').toString('hex');
    if(hash === user_hash) {
      return true
    } else {
      return false
    }
};

//password encrypt
async function encryptPassword(password) {
    let salt = await crypto.randomBytes(16).toString('hex');
    let hash = await crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
    return {salt : salt, hash : hash}
}

//username encrypt
async function toAuthJSON(username) {
    return {
      username: username.toLowerCase(),
      token: jwt.sign({ username: username.toLowerCase() }, 'error'),
    };
};

async function fire(result, rest , email){
    await users.doc(rest.username).set({
        pass: result , 
        email : email
    })
    return true
}