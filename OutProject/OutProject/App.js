import React from 'react';
import {View, PushNotificationIOS} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import HomeScreen from './HomeScreen'
import ChangeLocaleScreen from './ChangeLocaleScreen'
import SignInScreen from './SignInScreen'
import {colors, fonts} from './variables'
import AdminHomeScreen from './AdminHomeScreen'
import CreateEventScreen from './CreateEventScreen'
import ItemDetailsScreen from './ItemDetailsScreen'
import GeoLocationService from './geolocation';
import EventManager from './eventsManager';
import SideMenu from './SideMenu';
import DataBaseAsync from './DataBaseAsync';
import MapScreen from './MapScreen'
import firebase from 'react-native-firebase';
import PushNotificationScreen from './PushNotificationScreen'

const MainNavigator = createStackNavigator(
  
  {
    Home: HomeScreen,
    SignInScreen: SignInScreen,
    AdminHomeScreen: AdminHomeScreen,
    CreateEventScreen: CreateEventScreen,
    ItemDetailsScreen: ItemDetailsScreen,
    ChangeLocaleScreen: ChangeLocaleScreen,
    MapScreen: MapScreen,
    PushNotificationScreen: PushNotificationScreen
  },
  {
    initialRouteName: 'Home',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: colors.Primary,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    navigationOptions: {
      tabBarLabel: 'Home',
    }
  }
);

const AppNavigator = createDrawerNavigator({
    MainNavigator
  },
  {
//here you gonna have all the customization for your custom drawer and other things like width of side drawer etc
//remove contentComponent: SideMenu and observe the changes
       contentComponent : SideMenu,
       drawerWidth:250,
       drawerType:'slide'
});


const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  constructor() {
    super()
    this.geolocation = new GeoLocationService()
    this.eventsManager = new EventManager()
    this.databaseAsync = new DataBaseAsync()

    this.state = {
      code: '17000',
      cities: []
    }
  }

  fetchLocale() {
    this.geolocation.getCurrentLocation((position) => {
      this.eventsManager.fetchCities((cities) => {
          distance = null
          actualCityCode = null
          citiesTmp = []
          actualCityName = ''

          for (city of cities) {
              new_distance = this.geolocation.getDistanceFromLatLonInKm(position.latitude, position.longitude, city.child.latitude, city.child.longitude)
              if (distance == null || distance > new_distance) {
                distance = new_distance
                actualCityCode = city.child.code
                actualCityName = city.key
              }
              citiesTmp.push({data: city.key, code:city.child.code, key:city.key})
          }

          this.setState({cityName: actualCityName, code: actualCityCode, cities: citiesTmp})
          this.eventsManager.setCode(actualCityCode)
          this.databaseAsync.postLocale(actualCityCode.toString(), () => {}, () => {})
        })
      })
  }

  findLocale() {
    this.geolocation.requestAuthorization()

    this.databaseAsync.getLocale((value) => {
        this.setState({code: actualCityCode})
        this.eventsManager.setCode(actualCityCode)
        this.fetchLocale()
      }, () => {
        this.fetchLocale()      
      })
    }

    onChangeLocale = (code, cityName) => {
      // console.log('code:', code)
      this.setState({code: code, cityName:cityName})
      this.eventsManager.setCode(code)
      this.databaseAsync.postLocale(code.toString(), () => {
        this.forceUpdate()
      }
       , () => {
        this.forceUpdate()
       })
      
    }

    requestNotification = (onSuccess) => {
      // PushNotification
      firebase.messaging().hasPermission()
          .then(enabled => {
            console.log('enabled:', enabled)
            if (enabled) {
              firebase.messaging().getToken().then(token => {
                // console.log("LOG: ", token);
              })
              // user has permissions
            } else {
              // firebase.messaging().deleteToken().then(() => {
              //   console.log('SUCCESS DELETE')
              // }).catch(() => {
              //   console.log('FAILED DELETE')

              // })

              firebase.messaging().requestPermission()
                .then(() => {
                  // firebase.messaging().subscribeToTopic('News');
                  onSuccess()
                  // firebase.messaging().unsubscribeFromTopic
                  // alert("User Now Has Permission")
                })
                .catch(error => {
                  console.log(error)
                  // alert("Error", error)
                  // User has rejected permissions  
                });
            }
          });
    }

  componentDidMount() {
    this.findLocale()
    this.requestNotification(() => {
      firebase.messaging().subscribeToTopic('News');
    })

  }

  render() {
    return (
      <View style={{flex:1}}>
        

        <AppContainer
          screenProps={{
            eventsManager: this.eventsManager,
            geolocation: this.geolocation,
            databaseAsync: this.databaseAsync,
            code: this.state.code,
            cities: this.state.cities,
            onChangeLocale: this.onChangeLocale,
            cityName: this.state.cityName,
            onUpdate: this.forceUpdate,
            onRequestNotification: this.requestNotification
          }}
        /> 
        
      </View>
    );
  }
}

