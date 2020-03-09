import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';


class GeoLocationService {
    constructor() {
        this.position = {
            latitude: null,
            longitude: null
        }
    }

    async requestAndroidAuth() {
        if (Platform.OS == 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  'title': 'Out',
                  'message': 'Pour vous notifier des évenements si vous êtes proche du bar !'
                }
              )
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
               // alert("You can use the location");
              } else {
                console.log("location permission denied")
               // alert("Location permission denied");
              }
            } catch (err) {
              console.warn(err)
            }
          }
    }

    async requestAuthorization() {
        Geolocation.requestAuthorization()
        await this.requestAndroidAuth()
    }

    getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;
      }
      
      deg2rad(deg) {
        return deg * (Math.PI/180)
      }

    getCurrentLocation(onSuccess) {
        Geolocation.getCurrentPosition((location) => {
            this.position = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            //this.position.latitude = location.coords.latitude
            //this.position.longitude = location.coords.longitude
            onSuccess(this.position)

          }, (e) => {

          }).catch(e => {})
    }
}

export default GeoLocationService;