import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform, KeyboardAvoidingView, Dimensions, TouchableWithoutFeedback, TouchableHighlight, Keyboard, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import {Icon, Overlay, Input, Button, Text, Image} from 'react-native-elements'
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
import ImagePicker from 'react-native-image-picker';
import CacheableImage from './ImageCache'
import ProgressCircle from 'react-native-progress-circle'

var {width, height} = Dimensions.get('window');

width = width / 2.1
height = width * 1.5
maxHeight = 250 * 2
maxWidth = maxHeight / 1.5

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  maxWidth: maxWidth,
  maxHeight: maxHeight,
};


class CreateEventScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: 'Administrateur',
            // header: null
        }
      }

      static popupFailed = (navigation) => (Alert.alert(
        'Envoie d\'evenement a echoué !',
        'Vérifier votre connexion internet.',
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
            dateSelected: new Date(),
            addEvent: false,
            dateDescription:'',
            description:'',
            enable:false,
            behavior:'position',
            //addImageEnable:true,
            imgSource:{uri:''},
            imageUri:'',
            title:'toto',
            isPictureAdded:false,
            isFilled:false,
            progress:0,
            searching:true,
            logo: {uri: ''},
            position: {latitude: 0, longitude: 0}
          }

          //this.eventsManager = new EventManager()
      }

      async componentDidMount() {
        AsyncStorage.getItem('profile', (err, result) => {
          const data = JSON.parse(result)
          // console.log(data)
          // console.log('result:', data.email);
          this.setState({dateSelected:this.props.navigation.state.params.dateSelected,
                  title:data.name, logo:{uri: data.logo},
                  position:{latitude: data.latitude, longitude: data.longitude} })
          this.fillValues()
        }).catch(() => {

        });
      }

      fillValues() {
        const eventsManager = this.props.screenProps.eventsManager
        const id = firebase.auth().currentUser.uid
        
        this.setState({searching:true})
        
        eventsManager.fetchOneEvent(this.state.dateSelected, id, (values) => {
          if (values != null) {
            //console.log(values)

            pictureAdded = false

            if (values.imageURL.length > 0) {
              pictureAdded = true
            }
            this.setState({description: values.description, dateDescription:values.date,
                        imgSource: {uri: values.imageURL}, isPictureAdded: pictureAdded, isFilled:true, searching:false})
          } else {
            this.setState({description: '', dateDescription:'',
              imgSource: {uri: ''}, isPictureAdded: false, isFilled:false, searching:false, enable:false})
          }
        }, () => {
          this.setState({description: '', dateDescription:'',
            imgSource: {uri: ''}, isPictureAdded: false, isFilled:false, searching:false, enable:false})
          console.log('failed')
        })
      }

      handleDateDescriptionChange = dateDescription => {
        this.setState({ dateDescription })
        if (dateDescription != '' && this.state.imgSource.uri != '') {
          this.setState({enable: true})
        } else {
          this.setState({enable: false})
        }
      }

      handleDescriptionChange = description => {
        this.setState({ description })
        
      }

      onAddPicture() {
        ImagePicker.showImagePicker(options, response => {
          if (response.didCancel) {
          } else if (response.error) {
          } else {              
            const source = { uri: response.uri };
            this.setState({
              imgSource: source,
              imageUri: Platform.OS === 'android' ? response.path : response.uri,
              isPictureAdded: true,
             // addImageEnable: false,
              enable: ((this.state.dateDescription != '' && source != '') ? true : false )
            });
          }
        });
      }

      sendEvent(onSuccess, onFailure) {
        //console.log('SEND EVENT')
        const eventsManager = this.props.screenProps.eventsManager
        const id = firebase.auth().currentUser.uid
        const date = this.state.dateSelected

        data = {
          title:this.state.title, logo:this.state.logo.uri, imageURL:'',
          date:this.state.dateDescription, description: this.state.description,
          latitude: this.state.position.latitude,
          longitude: this.state.position.longitude
        }

        this.setState({isSending:true, isFilled:true})

        eventsManager.deleteLike(date, id, () => {
          eventsManager.uploadImage(this.state.imageUri, id, date, (value) => {
            //console.log('FILENAME:', value)
            data.imageURL = value.downloadURL
            eventsManager.sendEvent(date, id, data, () => {
              console.log('sucess')
              this.setState({isFilled:true, isSending:false})
              onSuccess()
            }, () => {
              this.setState({isFilled:false, isSending:false})
              // console.log('failed')
              onFailure()
            })
    
          }, (progress) => {
            this.setState({progress: progress})
            // console.log('progress: ', progress)
          }, () => {
            this.setState({isFilled:false, isSending:false})
              // console.log('failed upload !')    
              onFailure()      
          })
        })

      }

      removeEvent() {
        const eventsManager = this.props.navigation.state.params.eventsManager
        const id = firebase.auth().currentUser.uid
        const date = this.state.dateSelected

        
        eventsManager.deleteLike(date, id, () => {
          console.log('success')
          eventsManager.deleteEvent(date, id, () => {
            console.log('success')
            this.fillValues()
          }, () => {
            console.log('failed')
          })
         // this.fillValues()
        }, () => {
          console.log('failed')
        })

        
        
      }


    render() {

      const {navigate} = this.props.navigation;
      const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0

      return (
        <SafeAreaView style={styles.container}>

          { !this.state.searching ?
            <KeyboardAvoidingView style={{flex:1}} behavior= {(Platform.OS === 'ios')? 'padding' : null} keyboardVerticalOffset={keyboardVerticalOffset}>
             <ScrollView contentContainerStyle={{flex:1}}>
          <View style={{backgroundColor:'white', flexGrow:1, padding:8, paddingBottom:16, borderBottomWidth:1, borderColor:colors.CardBorderColor}}>
              
              <TouchableHighlight disabled={this.state.isFilled} style={{width:width, height:height, borderRadius:8}} onPress={() => {
                this.onAddPicture()
              }}>
              <View style={{borderRadius:8}}>
                  <Image
                      style={{width:width, height:height}}
                      containerStyle={{backgroundColor:'#F0F0F0', borderRadius:8}}
                      placeholderStyle={{backgroundColor:'transparent'}}
                      borderRadius={8}
                      source={this.state.imgSource}
                      >
                        <View style={{flex:1, borderRadius:8, backgroundColor: 'rgba(0,0,0,0.2)'}}>
                        <View style={{position:'absolute', flex:1, top:4, left:4}}>
                          <Text h2 h2Style={fonts.EventTitle}>{this.state.title}</Text>
                        </View>
                        {this.state.imgSource.uri == '' &&
                          <View style={{position:'absolute', top:height/2 - 25, left:width/2 - 25}}>
                          <Icon
                            color={colors.Primary}
                            name='add-a-photo'
                            type='material-icons'
                            size={50}
                          />
                          </View>
                        }

                        <View style={{position:'absolute', bottom:4, left:4, width:width - 8}}>
                            <Input
                              disabled={this.state.isFilled}
                              inputStyle={{...fonts.EventComment, textAlign:'center'}}
                              placeholderTextColor={colors.TextColor2}
                              inputContainerStyle={{borderBottomWidth:0, margin:0, padding:0}}
                              containerStyle={{padding:0}}
                              labelStyle={{margin:0}}
                              multiline={true}
                              placeholder='title ...'
                              value={this.state.dateDescription}
                              onChangeText={this.handleDateDescriptionChange}
                          />
                        </View>
                        </View>

                      </Image>
                    
                  </View>
                  </TouchableHighlight>
                      <Input
                          title='Description'
                          disabled={this.state.isFilled}
                          inputStyle={fonts.EventDescription}
                          placeholderTextColor={{...colors.TextColor2}}
                          inputContainerStyle={{flex:1, borderBottomWidth:0}}
                          containerStyle={{flex:1}}
                          labelStyle={{}}
                          placeholder='(Optionnel)'
                          multiline={true}
                          value={this.state.description}
                          onChangeText={this.handleDescriptionChange}                          
                      />
                      
          </View>
          <View style={{alignItems:'center'}}>
            {!this.state.isSending ? <Icon
                type='feather'
                name='send'
                disabled={this.state.searching || !this.state.enable}
                reverse
                size={25}
                color={colors.Accent}
                onPress={() => {
                  this.sendEvent(() => {
                    navigate('Home', () => {
                      this.props.screenProps.onUpdate()
                      // this.forceUpdate()
                    })
                  }, () => {
                    popupFailed(navigate)
                  })
                }}
              />
              :
              <ProgressCircle
                    percent={this.state.progress}
                    radius={30}
                    borderWidth={8}
                    color={colors.Accent}
                    shadowColor="#999"
                    bgColor="#fff"
                >
                <Text style={fonts.TitleAdmin}>{this.state.progress.toFixed(0) + '%'}</Text>
            </ProgressCircle>
            }
          </View>
          </ScrollView>
          </KeyboardAvoidingView>
          
          :
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
              <ActivityIndicator size="large" color={colors.Accent} />
          </View>
          }

          {/* {!this.state.isSending ? (!this.state.isFilled ?
          <View style={{flexDirection:'row', justifyContent:'center', margin:4}}>
            <View style={{flex:1, alignContent:'flex-start'}}>
          <Icon
                type='feather'
                name='chevron-left'
                reverse
                size={25}
                color={colors.Primary}
                onPress={() => {
                  navigate('AdminHomeScreen')
                 // this.removeEvent()
                }}
              />
              </View>
              <View style={{alignContent:'flex-end'}}>
              <Icon
                type='feather'
                name='send'
                disabled={this.state.searching || !this.state.enable}
                reverse
                size={25}
                color={colors.Primary}
                onPress={() => {
                  this.sendEvent()
                }}
              />
              </View>
              
          </View> : 
          <View  style={{flexDirection:'row', margin:4}}>
            <View style={{flex:1, alignContent:'flex-start'}}>

            <Icon
                type='feather'
                name='chevron-left'
                reverse
                size={25}
                color={colors.Primary}
                onPress={() => {
                 // this.removeEvent()
                  navigate('AdminHomeScreen')
                }}
              />
            </View>
            <View style={{alignContent:'flex-end'}}>
              <Icon
                type='entypo'
                name='trash'
                disabled={this.state.searching}
                reverse
                size={25}
                color={colors.Delete}
                onPress={() => {
                  this.removeEvent()
                }}
              />
              </View>
            </View>
          ) : <View style={{alignItems:'center', justifyContent:'center', margin:4}}>
              <ProgressCircle
                    percent={this.state.progress}
                    radius={40}
                    borderWidth={8}
                    color={colors.Accent}
                    shadowColor="#999"
                    bgColor="#fff"
                >
                <Text style={fonts.TitleAdmin}>{this.state.progress.toFixed(0) + '%'}</Text>
            </ProgressCircle>
            </View>
          } */}
          </SafeAreaView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: colors.Primary,
      }
  });

  export default CreateEventScreen;