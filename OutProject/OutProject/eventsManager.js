import firebase from 'react-native-firebase'
import moment from 'moment';
import { getUniqueId } from 'react-native-device-info';

class EventManager {

    static EVENTS_PATH = 'events/'
    static LIKES_PATH = 'likes/'
    static LIKES_REF_PATH = 'likes_ref/'
    
    static CITIES_PATH = 'cities/'
    static IMAGES_PATH = 'images/'

    static NEWS = 'News/'

    constructor() {
        this.code = '17000'
    }

    setCode(code) {
      this.code = code
    }

    async fetchLike(path, onSuccess) {
      await firebase.database().ref(path).once('value', (likeSnapshot) => {
        onSuccess(likeSnapshot)
      })
    }


    async sendNotification(id, title, comments) {
      await firebase.database().ref(EventManager.NEWS + id).push({title:title, comments:comments})
    }

    async fetch(date, departementCode, onSuccess, onFailure) {

        dateString = moment(date).format('YYYY-MM-DD')

        events = []

        firebase.database().ref(EventManager.EVENTS_PATH + dateString + '/' + departementCode).orderByChild('likes').once('value', async snapshot => {
            snapshot.forEach(element => {
                const data = element.val()

                data['key'] = element.ref.key
                data['like'] = false
                if (!(element.child('likes').exists())) {
                  data['likes'] = 0
                }

                events.push(data)
            });
          }).then(async () => {
            events.reverse()
            await this.fetchLike(EventManager.LIKES_PATH + dateString + '/' + departementCode + '/' + getUniqueId(), (snapshot) => {
              snapshot.forEach((child) => {
                  for (event of events) {
                    if (event.key == child.ref.key) {
                        event.like = true
                    }
                  }
              })
            })
            onSuccess(events)
          }).catch(e => {
            onFailure()
          })
    }

    uploadImage(imageUri, id, date, onSuccess, onUpdate, onError) {
      dateString = moment(date).format('YYYY-MM-DD')

      const ext = imageUri.split('.').pop(); // Extract image extension
      const filename = `${id}.${ext}`; // Generate unique name
      const metadata = {
        contentType: 'image/' + ext,
      };


     //this.setState({startedUploadImage:true})

      uploadTask = firebase.storage().ref(EventManager.IMAGES_PATH + dateString + '/' + this.code + '/').child(filename).putFile(imageUri, metadata);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          //this.setState({progress: progress})
          onUpdate(progress)
         // console.log('Upload is ' + progress + '% done');
        }, (error) => {
          //uploadTask()
          onError()
          //this.setState({startedUploadImage:false})
          //console.log(error);
      }, (value) => {
        //this.setState({startedUploadImage:false})
        //uploadTask()
        //console.log('value:', value)
        onSuccess(value)
        // Upload completed successfully, now we can get the download URL
        //var downloadURL = uploadTask.snapshot.downloadURL;
      });
    
    };

    fetchOneEvent(date, id, onSuccess, onFailure) {
      dateString = moment(date).format('YYYY-MM-DD')
      firebase.database().ref(EventManager.EVENTS_PATH + dateString + '/' + this.code + '/' + id).once('value', snapshot => {
        onSuccess(snapshot.val())
      }).catch(e => {
        onFailure()
      })
    }

    async fetchLikeEvent(key, date, departementCode, id, onSuccess, onError) {
        console.log('key: ', key)
        console.log('date: ', date)
        console.log('departementCode: ', departementCode)

        dateString = moment(date).format('YYYY-MM-DD')

        firebase.database().ref(EventManager.LIKES_PATH + dateString + '/' + departementCode + '/' + id + '/' + key).set({
          value:true
        }, (e) => {
            if (e) {
              onError()
            } else {
              onSuccess()
            }
        })
    }

    fetchUnlikeEvent(key, date, departementCode, id, onSuccess, onError) {

      dateString = moment(date).format('YYYY-MM-DD')

      firebase.database().ref(EventManager.LIKES_PATH + dateString + '/' + departementCode + '/' + id + '/' + key).remove((e) => {
          if (e) {
            onError()
          } else {
            onSuccess()
          }
      })
    }

    fetchCities(onSuccess) {
        firebase.database().ref(EventManager.CITIES_PATH).once('value', snapshot => {
            cities = []
            snapshot.forEach(child => {
              cities.push({child: child.val(), key: child.ref.key})
            })

            onSuccess(cities)
        })
    }

    sendEvent(date, id, data, onSuccess, onFailure) {

      dateString = moment(date).format('YYYY-MM-DD')

          firebase.database().ref(EventManager.EVENTS_PATH + dateString + '/' + this.code + '/' + id).set(data).then(() => {
              //console.log('OK')
              onSuccess()
            }).catch(e => {
              onFailure()
              //console.log('FAILED')
            })
    }

    deleteEvent(date, id, onSuccess, onFailure) {
      dateString = moment(date).format('YYYY-MM-DD')

          firebase.database().ref(EventManager.EVENTS_PATH + dateString + '/' + this.code + '/' + id).remove().then(() => {
              //console.log('OK')
              onSuccess()
            }).catch(e => {
              onFailure()
              //console.log('FAILED')
            })
    }

    deleteLike(date, id, onSuccess, onFailure) {
      dateString = moment(date).format('YYYY-MM-DD')
      const path = EventManager.LIKES_REF_PATH + dateString + '/' + this.code + '/' + id

          firebase.database().ref(path).once('value', (snapshot => {
            snapshot.forEach(child => {
                //console.log(child.val())
                this.fetchUnlikeEvent(id, dateString, this.code, child.val(), () => {
                    console.log('sucees unlike')
                }, () => {
                  console.log('failed unlike')
                })

            })
          })).then(() => {
              //console.log('OK')
              firebase.database().ref(path).remove()
              onSuccess()
            }).catch(e => {
              onFailure()
              //console.log('FAILED')
            })
    }
}

export default EventManager;