import React from 'react';
import { StyleSheet, View, Text, Button, SafeAreaView, Platform } from 'react-native';
import {Icon, Overlay} from 'react-native-elements'
import { Header } from 'react-navigation-stack';
import firebase from 'react-native-firebase';
import CalendarHeader from './CalendarHeader'
import Cards from './Cards'
import {colors} from './variables'
import moment from 'moment';
import uuid from 'react-native-uuid';
import GeoLocationService from './geolocation';
import EventManager from './eventsManager';
import MenuComponent from './Menu';

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Accueil',
        header: null
        // on
      };

      constructor() {
          super()

          this.state = {
            dateSelected: new Date(),
            code:'17000',
            showMenu: false
          }

          // this.geolocation = new GeoLocationService()
          // this.eventsManager = new EventManager()
      }

      async componentDidMount() {

        this.geolocation = this.props.screenProps.geolocation
        this.eventsManager = this.props.screenProps.eventsManager

        
      }


    render() {

      const {navigate} = this.props.navigation;
      const code = this.props.screenProps.code

      return (
        <SafeAreaView style={{flex:1, backgroundColor: colors.Primary}}>
            <View style={styles.container}>
              <CalendarHeader  displayAdminButton={true} contentViewStyle={{backgroundColor:colors.Primary, paddingTop:8}}
              onChangeDate={(date) => {
                  this.setState({dateSelected:date})
              }}
              />

              <Cards
                selectedDate={this.state.dateSelected}
                departementCode={code}
                contentViewStyle={styles.cardsContainer}
                onPressDetails={(item) => {
                  navigate('ItemDetailsScreen', {item: item, dateSelected: this.state.dateSelected, departementCode: code})
                }}
                onPressAddNews={() => {
                  navigate('CreateEventScreen', {dateSelected: this.state.dateSelected})
                }}
                contentSeparatorComponent={{marginBottom:8}}
              />
            </View>
              
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
      backgroundColor:colors.Background, padding:8, flexGrow:1, alignItems:'center'
    }
  });

  export default HomeScreen;