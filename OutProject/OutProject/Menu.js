import React from 'react';
import PropTypes from 'prop-types';
import {Text, Icon, Overlay} from 'react-native-elements'
import { StyleSheet, View, Button, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import moment from 'moment';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import {colors, fonts} from './variables'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import firebase from 'react-native-firebase'

var {width} = Dimensions.get('window');


class MenuComponent extends React.Component {
    static propTypes = {
     
      contentViewStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]),
      visible: PropTypes.bool.isRequired,
      onPressOut: PropTypes.func.isRequired,
      onPressSignIn: PropTypes.func.isRequired
      
    }

    constructor() {
        super()

        this.state = {
            adminMode:false
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
    }

    render = () => {
      const { contentViewStyle, visible, onPressOut, onPressSignIn} = this.props;
      
      return (
        <Overlay
            isVisible={visible}
            onBackdropPress={() => onPressOut()}

            overlayBackgroundColor={colors.Accent}
            overlayStyle={{position:'absolute', top:(Platform.OS == 'android') ? 32 : 50, left:0}}
            width='auto'
            height="auto"
            >
                <TouchableHighlight underlayColor='transparent' onPress={() => {
                    onPressSignIn(this.state.adminMode)
                }}>
                <View style={{paddingLeft:4, paddingTop:4, paddingBottom:4, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text h2 h2Style={fonts.MenuTitle}>{this.state.adminMode ? "Compte Professionnel" : "Connexion Professionnel"}</Text>
                    <Icon
                        type='entypo'
                        color={colors.TextColor}
                        name='chevron-right'
                        size={20}
                    />
                </View>
                </TouchableHighlight>

        </Overlay>
      );
    }
  }

const styles = StyleSheet.create({
    
  });

export default MenuComponent;