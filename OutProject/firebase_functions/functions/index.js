const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.countlikeerase = functions.database.ref('/likes/{date}/{departement}/{uid}/{id}').onDelete(
    async (change, context) => {
        console.log('countlikechange onDelete start')

        const path = 'events/' + context.params.date + '/' + context.params.departement + '/' + context.params.id
        const path_create = 'likes_ref/' + context.params.date + '/' + context.params.departement + '/' + context.params.id
        
        let increment = -1;

        await admin.database().ref(path).once('value', (snapshot) => {
            if (snapshot.exists()) {
                console.log('snapshot: ', snapshot.child('likes').val())

                if ((snapshot.child('likes').val() + increment) >= 0) {
                    admin.database().ref(path).update({
                        likes:snapshot.child('likes').val() + increment            
                    })
                }
              //  admin.database().ref(path_create).child('uid').equalTo(context.params.uid).remove()
            }
        })

        console.log('Counter updated.');
        return null;
    });

exports.countlikechange = functions.database.ref('/likes/{date}/{departement}/{uid}/{id}').onCreate(
    async (change, context) => {
        console.log('countlikechange onCreate start')

        const path = 'events/' + context.params.date + '/' + context.params.departement + '/' + context.params.id
        const path_create = 'likes_ref/' + context.params.date + '/' + context.params.departement + '/' + context.params.id

        let increment = 1;

        await admin.database().ref(path).once('value', (snapshot) => {
            console.log('snapshot: ', snapshot.child('likes').val())
            
            if (snapshot.exists()) {
                admin.database().ref(path).update({
                    likes:snapshot.child('likes').val() + increment            
                })
            }
            admin.database().ref(path_create).push(context.params.uid)
        })

        console.log('Counter updated.');
        return null;
    }); 



exports.pushNotification = functions.database.ref('/News/{uid}').onWrite(( change, context) => {
        // const news= change.val();
    
        // console.log(news)
        // console.log(news.title)
        // console.log(news.comments)
        const payload = {notification: {
            title: "HELLO",
            body: "toto",
            sound: "default"
            }
        };
    
        // const payload = {notification: {
        //     title: `${news.title}`,
        //     body: `${news.comments}`,
        //     sound: "default"
        //     }
        // };
        return admin.messaging().sendToTopic("News", payload)
            .then(function(response) {
                console.log('Notification sent successfully:',response);
                return 0;
            }) 
            .catch(function(error){
                console.log('Notification sent failed:',error);
                return 1;
            });
    });