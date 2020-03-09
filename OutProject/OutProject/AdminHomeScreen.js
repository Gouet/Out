import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableHighlight, Keyboard, Alert } from 'react-native';
import {Icon, Overlay, Input, Button, Text} from 'react-native-elements'
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
import { ScrollView } from 'react-native-gesture-handler';

class AdminHomeScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Administrateur',
            headerLeft: () => (
              <Icon
                underlayColor='transparent'
                iconStyle={{marginLeft:10}}
                onPress={() => 
                  navigation.navigate('Home')
                }
                name="home"
                type='entypo'
                color={colors.TextColor}
              />
            ),
            headerRight: () => (
                <Icon
                  underlayColor='transparent'
                  iconStyle={{marginRight:10}}
                  onPress={() => {
                    firebase.auth().signOut().then(() => {
                        navigation.navigate('Home')
                    })
                  }}
                  name="sign-out"
                  type='font-awesome'
                  color={colors.TextColor}
                />
              ),
        }
      }

      static popupFailed = (navigation) => (Alert.alert(
        'L\'authentification a échoué',
        'Mauvais mot de passe ou email.',
        [
          {
            text: 'Ok',
            onPress: () => { },
            style: 'cancel',
        }
        ],
        {cancelable: false},
      ));

      constructor() {
          super()

          this.state = {
          }
      }

      async componentDidMount() {
      }


    render() {

      const {navigate} = this.props.navigation;

      return (
        <View style={styles.container}>
              <View style={styles.containerCards}>
                <TouchableHighlight style={styles.touchableHighlightContainer} onPress={() => {
                    navigate('CreateEventScreen', {eventsManager: this.props.screenProps.eventsManager })
                }}>
                <View  style={styles.item}>
                    <View style={styles.subitem}>
                    <Icon
                        size={50}
                        name='notification'
                        type='entypo'
                        color={colors.Accent}
                    />
                    </View>
                <Text h1 h1Style={{...fonts.TitleAdmin, textAlign:'center'}}>Gestion{"\n"}événements</Text>
                </View>
                </TouchableHighlight>
                
                {/* <TouchableHighlight style={styles.touchableHighlightContainer} onPress={() => {
                   // navigate('Maps')
                }}>
                <View style={styles.item}>
                    <View style={styles.subitem}>
                    <Icon
                        size={50}
                        name='map'
                        type='foundation'
                        color={colors.Accent}
                    />
                    </View>
                <Text h1 h1Style={styles.textStyleCards}>Utiliser{"\n"}la carte</Text>
                </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.touchableHighlightContainer} onPress={() => {
                   // navigate('VirtualCoinManager')
                }}>
                <View style={styles.item}>
                    <View style={styles.subitem}>
                    <Icon
                        size={50}
                        name='euro-symbol'
                        type='material-icons'
                        color='#6d071a' //#6d071a
                    />
                    </View>
                <Text h1 h1Style={{...styles.textStyleCards}}>Gestion{"\n"}jeton virtuel</Text>
                </View>
                </TouchableHighlight> */}
                </View>
          </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FAFAFA',
      },touchableHighlightContainer: {
          margin: 10,
          width:125,
          borderRadius:5
        },
        containerCards: {
          justifyContent:'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        },
        subitem: {
          marginBottom:8
        },
        textStyleCards: {
          fontSize:14,
          textAlign:'center',
          color:'#424242',
          fontWeight:'bold'
        },
        item: {
          alignItems:'center',
          justifyContent:'center',
          height: 125,
          backgroundColor:'#FAFAFA',
          padding:0, borderRadius:5, borderWidth: 3, borderColor:'#EDEDED'
        },
  });

  export default AdminHomeScreen;