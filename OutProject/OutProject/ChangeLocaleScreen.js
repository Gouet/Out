import React from 'react';
import { StyleSheet, View, SafeAreaView, FlatList, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, TouchableHighlight, Keyboard, Alert } from 'react-native';
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

class ChangeLocaleScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Localisation',
            // headerLeft: () => (
            //   <Icon
            //     underlayColor='transparent'
            //     iconStyle={{marginLeft:10}}
            //     onPress={() => 
            //       navigation.navigate('Home')
            //     }
            //     name="home"
            //     type='entypo'
            //     color={colors.TextColor}
            //   />
            // ),
            // headerRight: () => (
            //     <Icon
            //       underlayColor='transparent'
            //       iconStyle={{marginRight:10}}
            //       onPress={() => {
            //         firebase.auth().signOut().then(() => {
            //             navigation.navigate('Home')
            //         })
            //       }}
            //       name="sign-out"
            //       type='font-awesome'
            //       color={colors.TextColor}
            //     />
            //   ),
        }
      }

      constructor() {
          super()

          this.state = {

          }
      }

      componentDidMount() {
        const cities = this.props.screenProps.cities
        // console.log(cities)
      }

      onSelectLocale(item) {
        this.props.screenProps.onChangeLocale(item.item.code, item.item.data)
        // this.forceUpdate()
      }

    render() {

      const {navigate} = this.props.navigation;
      const cities = this.props.screenProps.cities
      const code = this.props.screenProps.code

      console.log(cities)
      return (
        <View style={styles.container}>
            <FlatList
            contentContainerStyle={{flexGrow:1}}
            data={cities}
            renderItem={(item) => {
                // console.log('popo')
                return (
                <TouchableHighlight underlayColor='transparent' onPress={() => {
                    this.onSelectLocale(item)
                }}>
                <View style={{backgroundColor:code == item.item.code ? colors.AccentBorder : colors.BackgroundBreak}}>
                    <Text h2 h2Style={{...fonts.LocaleText, textAlign:'center' }}>{item.item.data}</Text>
                </View>
                </TouchableHighlight>
                )
            }}
            ItemSeparatorComponent={() => {
                return (
                    <View style={{borderBottomWidth:1, }}>

                    </View>
                )
            }}
            keyExtractor={item => item.key}
            />
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

  export default ChangeLocaleScreen;