import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform,KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
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
import {AsyncStorage} from 'react-native';

class SignInScreen extends React.Component {
    static navigationOptions = {
        title: 'Connexion'
      };

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
            password: '',
            email: '',
            loading: false,
            enable:false
          }
      }

      async componentDidMount() {


      }

      handleEmailChange = email => {
        this.setState({ email })
        if (this.state.password != '' && this.state.email != '') {
          this.setState({enable: true})
        }
      }
    
      handlePasswordChange = password => {
        this.setState({ password })
        if (this.state.password != '' && this.state.email != '') {
          this.setState({enable: true})
        }
      }

      onPressLoginAdmin(navigate) {
        //console.log(this.state.email)
        //console.log(this.state.password)
        this.setState({loading: true})
        this.props.navigation.setParams({
          isSwipeEnable: false
        });

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
          .then(() => {
           //   console.log('sucess')
              this.setState({ error: '', loading: false });
              const uid = firebase.auth().currentUser.uid

              firebase.database().ref('profiles/' + uid).once('value', (snapshot) => {
                if (snapshot.exists()) {
                  const data = snapshot.val()
                  console.log('data:', data)
                  AsyncStorage.setItem('profile', JSON.stringify(data)).then(() => {
                    navigate('Home')
                    // navigate('AdminHomeScreen', {eventsManager: this.props.navigation.state.params.eventsManager })
                  }).catch(() => {
                    console.log('Failed')
                    this.setState({ error: '', loading: false, email: '', password:'' });
                    SignInScreen.popupFailed()      
                  })
                }
              })

              // navigate('AdminHomeScreen', {eventsManager: this.props.navigation.state.params.eventsManager })
          })
          .catch(() => {
              console.log('Failed')
              this.setState({ error: '', loading: false, email: '', password:'' });
              SignInScreen.popupFailed()
          });
      }


    render() {

      const {navigate} = this.props.navigation;

      return (
        <KeyboardAvoidingView style={{flex:1}} behavior= {(Platform.OS === 'ios')? "padding" : null}>
          <TouchableWithoutFeedback style={{flex:1}} onPress={Keyboard.dismiss} >
                <View style={{flex:1, paddingLeft: 24, paddingRight:24, justifyContent:'center'}}>
                <Input
                    labelStyle={{marginTop:24}}
                    keyboardType='email-address'
                    autoCorrect={false}
                    autoCapitalize='none'
                    disabled={this.state.loading}
                    label='Adresse e-mail'
                    placeholder='email@adresse.com'
                    value={this.state.email}
                    onChangeText={this.handleEmailChange}
                    leftIcon={
                        <View style={{marginRight:5}}>
                            <Icon
                            name='email'
                            size={16}
                            type='material-community-icons'
                            color='black'
                            />
                        </View>
                        }
                />

                <Input
                    labelStyle={{marginTop:24}}
                    autoCorrect={false}
                    secureTextEntry={true}
                    disabled={this.state.loading}
                    label='Mot de passe'
                    placeholder='Mot de passe'
                    value={this.state.password}
                    onChangeText={this.handlePasswordChange}
                    leftIcon={
                        <View style={{marginRight:5}}>
                            <Icon
                            name='lock'
                            size={16}
                            type='Foundation'
                            color='black'
                            />
                        </View>
                        }
                />
                <Button
                    loading={this.state.loading}
                    disabled={this.state.loading || !this.state.enable}
                    title="Connexion"
                    titleStyle={{
                        color: colors.TextColor,
                        fontSize: 20,
                    }}
                    loadingProps={{color:colors.Background, borderColor:colors.Background}}
                    //type='outline'
                    buttonStyle={{marginTop:24, backgroundColor: this.state.enable ? colors.Accent : colors.Background, paddingLeft:20, paddingRight:20}}
                                    type='outline'
                    onPress={() => this.onPressLoginAdmin(navigate) }
                />
                </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#FFF',
    }, containerItems:{
        flex:1,
        backgroundColor:'red',
        alignItems:'center',
        justifyContent:'center'
    }
  });

  export default SignInScreen;