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

// const origin = {latitude: 46.3318456, longitude: -1.0296002};
// const destination = {latitude: 47.771707, longitude: -1.4053769};
// const GOOGLE_MAPS_APIKEY = 'AIzaSyB5wERS0nbeX0Q4J4oHkN85btHznSxRVIw';

var {width, height} = Dimensions.get('window');

class ItemDetailsScreen extends React.Component {
    static navigationOptions = {
        title: 'Information',
        // header: null
      };

      constructor() {
          super()

          this.state = {
            dateSelected: new Date(),
            code:'17000',
            showMenu: false
          }

        //   this.geolocation = new GeoLocationService()
        //   this.eventsManager = new EventManager()
      }

      async componentDidMount() {

        this.geolocation = this.props.screenProps.geolocation
        this.eventsManager = this.props.screenProps.eventsManager
        this.geolocation.requestAuthorization()


        // this.geolocation.getCurrentLocation((position) => {
        //   this.eventsManager.fetchCities((cities) => {
        //     distance = null
        //     actualCityCode = null
  
        //     for (city of cities) {
        //         new_distance = this.geolocation.getDistanceFromLatLonInKm(position.latitude, position.longitude, city.latitude, city.longitude)
        //         if (distance == null || distance > new_distance) {
        //           distance = new_distance
        //           actualCityCode = city.code
        //         }
        //     }

        //     console.log('actualCityCode:', actualCityCode)
        //     this.setState({code: actualCityCode})
        //     this.eventsManager.setCode(actualCityCode)
        //   })

        // })
      }

      onPressLike(item) {
          const dateSelected = this.props.navigation.state.params.dateSelected
          const departementCode = this.props.navigation.state.params.departementCode

        if (item.like) {
            //TODO SLECTEDDATE DEPARTEMENTCODE
            this.eventsManager.fetchUnlikeEvent(item.key, dateSelected, departementCode, getUniqueId(), () => {
                console.log('sucess UNLIKE')
            }, () => {
                console.log('failure UNLIKE')
            })
            item.likes -= 1
            item.like = false
        } else {
            this.eventsManager.fetchLikeEvent(item.key, dateSelected, departementCode, getUniqueId(), () => {
                console.log('sucess LIKE')
            }, () => {
                console.log('failure LIKE')
            })
            item.likes += 1
            item.like = true
        }
        this.forceUpdate()
    }


    render() {

      const {navigate} = this.props.navigation;
      const item = this.props.navigation.state.params.item

    //   console.log(this.props.navigation.state.params.item)

      return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.BackgroundBreak}}>
            <View style={{backgroundColor:colors.Background, borderColor:colors.Primary, borderBottomWidth:2, padding:8}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    {/* <View style={{justifyContent:'flex-start'}}> */}
                    <CacheableImage
                        permanent={false}
                        onLoad={() => {
                            console.log('hello')
                        }}
                        underlayColor='transparent'
                        style={{backgroundColor:'transparent', width:48 * 2, height:48 * 2}}
                        containerStyle={{backgroundColor:'transparent'}}
                        placeholderStyle={{backgroundColor:'transparent'}}
                        source={{uri: item.logo}}
                    />
                    {/* </View> */}
                <View style={{flex:1, flexDirection:'row'}}>
                    <View style={{flex:1, marginLeft:8}}>
                    <Text h2 h2Style={{...fonts.EventTitleReverse, flexShrink:1}}>{item.title}</Text>
                    <Text h2 h2Style={{...fonts.EventLikes, flexShrink:1}}>{item.likes} j'aime</Text>
                    <TouchableHighlight style={{marginTop:8}} underlayColor='transparent' onPress={() => {
                        console.log('TOTO')
                        navigate('MapScreen', {item: item})
                    }}>
                    <View style={{flexDirection:'row', backgroundColor:colors.Accent, padding:8,
                    alignSelf:'flex-start',
                    borderRadius:8, borderColor:colors.AccentBorder}}>
                    <Text h2 h2Style={{...fonts.FollowTitle, textAlign:'center'}}>Carte</Text>
                    </View>
                    </TouchableHighlight>
                    </View>
                    <View style={{}}>
                    <TouchableHighlight style={{}} underlayColor='transparent' onPress={() => {
                                    this.onPressLike(item)
                                }}>
                            <View style={{}}>
                            {item.like ?
                                <Icon
                                type='entypo'
                                name='heart'
                                size={45}
                                color={colors.Like}
                                />
                                :
                                <Icon
                                    type='entypo'
                                    name='heart-outlined'
                                    size={45}
                                    color={colors.Like}
                                    
                                />
                            }
                            </View>
                        </TouchableHighlight>
                </View>
                </View>
                </View>
               
                </View>
                <View style={{flexDirection:'row', padding:8, borderBottomWidth:2, backgroundColor:colors.Follow, borderColor:colors.Follow}}>
                    <View style={{flex:1, marginRight:8}}>
                        <Text h2 h2Style={{...fonts.FollowTitle, textAlign:'center'}}>Appuyez sur "Suivre" pour recevoir les notifications de cet établissement.</Text>
                    </View>
                    <TouchableHighlight style={{alignSelf:'center', borderRadius:8}} underlayColor='transparent' onPress={() => {
                            console.log('TOTO')
                            console.log(item.key)
                            this.props.screenProps.onRequestNotification(() => {
                                firebase.messaging().subscribeToTopic(item.key);
                            })
                    }}>
                    <View style={{flexDirection:'row', alignItems:'center', alignSelf:'center', padding:8, borderRadius:8, backgroundColor:colors.Delete}}>
                        <Text h2 h2Style={{...fonts.FollowTitle, textAlign:'center'}}>Suivre</Text>
                    </View>
                    </TouchableHighlight>
                </View>
                <ScrollView style={{flex: 1, paddingLeft:8, paddingRight:8, paddingTop:8}}>
                <View style={{flex:1, paddingLeft: 8}}>
                    <Text h2 h2Style={fonts.EventCommentReverse}>{item.date}</Text>
                    <View style={{paddingLeft:8, paddingTop:8}}>
                        {/* <View style={{flex:1}}> */}
                        <Text h2 style={{flex: 1}} h2Style={{...fonts.EventDescription}}>{item.description}</Text>
                        </View>
                        {/* </View> */}
                </View>
                </ScrollView>
                {/* <MapView
                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={{width:width, flex:1}}
                showsUserLocation={true}
                region={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                }}
                >

                {item.logo != '' && <Marker
                    coordinate={{latitude: item.latitude, longitude: item.longitude}}
                    // title={item.title}
                    // description={''}
                    onPress={() => {

                    }}
                >
                     <CacheableImage
                        permanent={false}
                        onLoad={() => {
                            console.log('hello')
                        }}
                        underlayColor='transparent'
                        style={{backgroundColor:'transparent', width:48, height:48}}
                        containerStyle={{backgroundColor:'transparent'}}
                        placeholderStyle={{backgroundColor:'transparent'}}
                        source={{uri: item.logo}}
                    />
                    </Marker>}
                </MapView> */}
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

  export default ItemDetailsScreen;