import React from 'react';
import { StyleSheet, View, Button, SafeAreaView, Platform, Dimensions, TouchableHighlight } from 'react-native';
import {Icon, Overlay, Text} from 'react-native-elements'
import { Header } from 'react-navigation-stack';
import firebase from 'react-native-firebase';
import CalendarHeader from './CalendarHeader'
import Cards from './Cards'
import {colors, fonts} from './variables'
import moment from 'moment';
import uuid from 'react-native-uuid';
import GeoLocationService from './geolocation';
import EventManager from './eventsManager';
import MenuComponent from './Menu';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Marker } from 'react-native-maps';
import CacheableImage from './ImageCache';
import { getUniqueId } from 'react-native-device-info';
import { ScrollView } from 'react-native-gesture-handler';

var {width, height} = Dimensions.get('window');

class PushNotificationScreen extends React.Component {
    static navigationOptions = {
        title: 'Notification',
        // header: null
      };

      constructor() {
          super()
      }

      async componentDidMount() {

        this.geolocation = this.props.screenProps.geolocation
        this.eventsManager = this.props.screenProps.eventsManager

        this.eventsManager.sendNotification(firebase.auth().currentUser.uid, 'HELLO', 'salut tout le monde !')
      }



    render() {

      const {navigate} = this.props.navigation;
    //   const item = this.props.navigation.state.params.item

    //   console.log(this.props.navigation.state.params.item)

      return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.BackgroundBreak}}>
                
        </SafeAreaView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: colors.Background,
    },
    cardsContainer: {
      flexGrow:1, backgroundColor:'white', paddingBottom:8, alignContent:'center'
    }
  });

  export default PushNotificationScreen;