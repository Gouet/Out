import React from 'react';
import PropTypes from 'prop-types';
import {Text, Icon} from 'react-native-elements'
import { StyleSheet, View, Button, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import {colors, fonts} from './variables'

class CalendarHeader extends React.Component {
    static propTypes = {

      contentViewStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
      onChangeDate: PropTypes.func.isRequired,
      // onPressAdminButton: PropTypes.func.isRequired,
      // displayAdminButton: PropTypes.bool
    }

    constructor() {
        super()


        // const {calendar, date_selected} = this.generateCalender()
        this.state = {
            // currentSelectedDate: date_selected,
            // calendar: calendar,
            loading: false
        }

    }

    generateCalender(currentDate=new Date()) {
        calendar = []
        idx = -3
        max_idx = 3
        date_selected = null

        while (idx <= max_idx) {
            tomorrow = moment(currentDate).add(idx, 'day').toDate()
            calendar.push({dayString: this.getDayOfWeek(tomorrow), dayCount:tomorrow.getDate(), date:tomorrow, isMiddle:idx == 0 ? true : false, key:uuid.v1()})
            if (idx == 0) {
                date_selected = tomorrow
            }
            idx += 1
        }
        return {
            calendar: calendar,
            date_selected: date_selected,
        };
    }

    getDayOfWeek(date) {
        const dayOfWeek = new Date(date).getDay();    
        return isNaN(dayOfWeek) ? null : 
          ['D', 'L', 'M', 'M', 'J', 'V', 'S'][dayOfWeek];
      }

    componentDidMount() {
      const {calendar, date_selected} = this.generateCalender(this.props.date ? this.props.date : new Date())
        this.setState({
            currentSelectedDate: date_selected,
            calendar: calendar,
            loading:true
        })
    }

    render = () => {
      const { contentViewStyle, onChangeDate } = this.props;
      
      if (!this.state.loading) {
        return (
          <View style={{...contentViewStyle, alignItems:'flex-end', flexDirection:'row', paddingBottom:16, paddingLeft:0, paddingRight:0}}>

          </View>
        )
      }

      return (
          <View style={{...contentViewStyle, alignItems:'flex-end', flexDirection:'row', paddingBottom:16, paddingLeft:0, paddingRight:0}}>
              {/* <View> */}
              <Icon
                  name='chevron-left'
                  type='MaterialCommunityIcons'
                  color={colors.ArrowColor}
                  size={35}
                  underlayColor='transparent'
                  onPress={() => {
                    tomorrow = moment(this.state.currentSelectedDate).add(-1, 'day').toDate()
                    const {calendar, date_selected} = this.generateCalender(tomorrow)
                    this.setState({calendar: calendar, currentSelectedDate: date_selected})
                    onChangeDate(date_selected)
                  }}
                />
                {/* </View> */}

              <FlatList style={{backgroundColor:''}}
                data={this.state.calendar}
                horizontal={true}
                contentContainerStyle = {{flexGrow:1, justifyContent:'space-around'}}
                scrollEnabled={false}
                renderItem={({ item }) =>

                <TouchableHighlight underlayColor='transparent' onPress={() => {
                    const {calendar, date_selected} = this.generateCalender(item.date)

                    this.setState({calendar: calendar, currentSelectedDate: date_selected})
                    onChangeDate(date_selected)
                }}>

                <View style={{width:35, justifyContent:'center', alignItems:'center'}}>

                    <Text h3 h3Style={styles.textDayStringStyles}>{item.dayString}</Text>
                    <View style={item.isMiddle ? styles.underlineSelectedItem : styles.underlineNoSelectedItem}>
                        <Text h3 h3Style={item.isMiddle ? styles.textDayCountStylesSelected : styles.textDayCountStyles}>{item.dayCount}</Text>
                    </View>
                
                </View>

                </TouchableHighlight>

                }

                keyExtractor={item => item.key}  
            />
            {/* <View> */}
            <Icon
                name='chevron-right'
                type='MaterialCommunityIcons'
                color={colors.ArrowColor}
                size={35}
                underlayColor='transparent'
                onPress={() => {
                    tomorrow = moment(this.state.currentSelectedDate).add(1, 'day').toDate()
                    const {calendar, date_selected} = this.generateCalender(tomorrow)
                    this.setState({calendar: calendar, currentSelectedDate: date_selected})
                    onChangeDate(date_selected)
                  }}
              />
              {/* </View> */}
          </View>
      );
    }
  }

const styles = StyleSheet.create({
    textDayStringStyles: {
      color:fonts.CalendarDay.color,
      fontSize:fonts.CalendarDay.size
    },
    textDayCountStylesSelected: {
        color:colors.Accent,
        fontSize:fonts.CalendarDate.size,
        textAlign:'center',
        fontFamily:fonts.CalendarDate.name
    },
    textDayCountStyles: {
        color:fonts.CalendarDate.color,
        fontSize:fonts.CalendarDate.size,
        textAlign:'center',
        fontFamily:fonts.CalendarDate.name
    },
    underlineSelectedItem: {
        borderBottomColor:colors.Accent,
        paddingLeft:2,
        paddingRight: 2,
        borderBottomWidth:1,
        flexDirection:'row'
    },
    underlineNoSelectedItem: {
        borderBottomColor:'transparent',
        paddingLeft:2,
        paddingRight: 2,
        borderBottomWidth:1,
        flexDirection:'row'
    }
  });

export default CalendarHeader;