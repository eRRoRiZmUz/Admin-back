// const firebase = require('../serviceAccount/firebase').firebase
// const public_chat = firebase.collection('Public Chat')
// let FieldValue = require('firebase-admin').firestore.FieldValue;

// public_chat.doc('KUoGs5H1ItGhqHZXX0A7').update({
//         dawdwadawa : 'fjeoiegifsao',
//         dawdwadawab : 'fjeoiegifsao',
//         dawdwadawac : 'fjeoiegifsao'
// })


// public_chat.doc('KUoGs5H1ItGhqHZXX0A7').get().then(snap =>{
//     let object = snap.data()
//     delete object.msg
//     delete object.name
//     delete object.time
//     delete object.profile_picture
//     let keys = Object.keys(object);
//     keys.map((res) =>{
//         public_chat.doc('KUoGs5H1ItGhqHZXX0A7').update({
//             [res] : FieldValue.delete()
//         })
//     })
// })
var a = Math.floor(1000 + Math.random() * 9000);
// a = a.substring(-2);
console.log(a)