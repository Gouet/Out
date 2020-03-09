import {Icon, Header} from 'react-native-elements'
import { TouchableHighlight } from 'react-native-gesture-handler';
import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-elements';
import {colors, fonts} from './variables';
import { SafeAreaView } from 'react-navigation';
import firebase from 'react-native-firebase';

class SideMenu extends React.Component {

    constructor() {
        super()
        this.state = {
            adminMode: false,
            locale:''
        }
        
    }
  
    componentDidMount() {
        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({adminMode: true})
            } else {
              this.setState({adminMode: false})
            }
          })


        //   this.props.screenProps.databaseAsync.getLocale((value) => {
        //       this.setState({locale: value})
        //   }, () => {})

    }

    cellItem = (onPress, title) => {
        return (
            <TouchableHighlight style={{borderRadius:8, margin:8}} onPress={() => {
                onPress()
            }}>
              <View style={{padding:8, borderColor:colors.AccentBorder, borderWidth:1, borderRadius:8}}>
                <Text h2 h2Style={{...fonts.MenuSideTitle, textAlign:'center'}}>{title}</Text>
              </View>
            </TouchableHighlight>
        )
    }

    onPressConnexion(navigate) {
        if (this.state.adminMode) {
            navigate('AdminHomeScreen')
        } else {
          navigate('SignInScreen')
        }
    }

    onPressDeconnexion(navigate) {
        firebase.auth().signOut().then(() => {
            // navigate('Home')
        })
    }

    onSendNotification(navigate) {
      navigate('PushNotificationScreen')
    }

    render() {
      const {navigate} = this.props.navigation;
      const locale = this.props.screenProps.cityName
    
    return <SafeAreaView style={{flex:1, backgroundColor:colors.Primary, padding: 16, paddingTop:24}}>
        {!this.state.adminMode && this.cellItem(() => {
            this.onPressConnexion(navigate)
        }, "Connexion Compte Professionnel")}
        {this.state.adminMode && this.cellItem(() => {
            this.onSendNotification(navigate)
        }, "Envoyer Notification")}
        {this.state.adminMode && this.cellItem(() => {
            this.onPressDeconnexion(navigate)
        }, "Deconnexion")}
        {/* <TouchableHighlight style={{borderRadius:8}} onPress={() => {
            if (this.state.adminMode) {
                navigate('AdminHomeScreen')
            } else {
              navigate('SignInScreen')
            }
        }}>
          <View style={{padding:8, borderColor:colors.AccentBorder, borderWidth:1, borderRadius:8}}>
            <Text h2 h2Style={{...fonts.MenuSideTitle, textAlign:'center'}}>{!this.state.adminMode ? "Connexion Compte Professionnel" : "Compte Professionnel"}</Text>
          </View>
        </TouchableHighlight> */}

        <View style={{borderTopWidth:2, marginTop:8, padding:8, borderColor:colors.Accent}}>
        <TouchableHighlight underlayColor='transparent' style={{borderRadius:8}} onPress={() => {
            navigate('ChangeLocaleScreen')
        }}>
          <View style={{padding:8, backgroundColor:colors.Accent, borderRadius:8}}>
                 <Text h2 h2Style={{...fonts.MenuSideTitle, textAlign:'center'}}>{locale}</Text>
          </View>
        </TouchableHighlight>
        </View>

      </SafeAreaView>
    }
  }

  export default SideMenu;