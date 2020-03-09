import React from 'react';
import PropTypes from 'prop-types';
import {Text, Icon, Image} from 'react-native-elements'
import { StyleSheet, View, Button, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import moment from 'moment';
import { TouchableHighlight } from 'react-native-gesture-handler';
import uuid from 'react-native-uuid';
import {colors, fonts} from './variables'
import EventManager from './eventsManager'
import { getUniqueId } from 'react-native-device-info';
import CacheableImage from './ImageCache'
import firebase from 'react-native-firebase';

var {width, height} = Dimensions.get('window');

width = width / 2.1
height = width * 1.5

const DefaultRow = ({itemContent, onPressLike, onPressOnCard, onPressDetails, onPressAddNews, onDeletePress}) => {
    const {item, index} = itemContent;
    const contentCell = {width:width - 5, height:height, marginLeft:(index % 2 == 1 ? 8 : 0)}

    if (item.isNewCard) {
        return (
            <TouchableHighlight style={{borderRadius:8}} onPress={() => {
                onPressAddNews()
            }}>
            <View style={{...contentCell, justifyContent:'center', borderRadius:8, backgroundColor:colors.BackgroundBorder}}>

                <Icon
                    iconStyle={{}}
                    type='material-icons'
                    name='add'
                    size={40}
                />

            </View>
            </TouchableHighlight>
        )
    }

    return (
    (item.isEmpty ?
    <View style={contentCell}></View> : 
        <TouchableHighlight style={{}} underlayColor='transparent' onPress={() => {
            onPressOnCard(item)
        }}>
    <View>
    
    {/* {!item.isReturn ? */}
    <View style={{...contentCell, backgroundColor:'white'}}>
            {item.imageURL != '' &&
            <CacheableImage
                permanent={false}
                style={{width:width - 5, height:height}}
                containerStyle={{opacity: 1.5}}
                borderRadius={8}
                placeholderStyle={{backgroundColor:'transparent', borderRadius:8}}
                source={{uri: item.imageURL}}
                >
                        <View style={{flex:1, borderRadius:8, backgroundColor: 'rgba(0,0,0,0.2)'}}>
                            <TouchableHighlight style={{alignSelf:'flex-end'}} underlayColor='transparent' onPress={() => {
                                console.log('PRESS')
                                onDeletePress()
                            }}>
                                <View>
                                {item.isAdmin &&
                                <Icon
                                    reverse
                                    type='entypo'
                                    name='trash'
                                    color={colors.Delete}
                                    size={15}
                                />
                                }
                                </View>
                            </TouchableHighlight>
                        </View>
            </CacheableImage>
            }
            {item.logo != '' &&
            <View style={{position:'absolute', flex:1, top:4, left:4}}>
                <Text h2 h2Style={fonts.EventTitle}>{item.title}</Text>
            </View>}
            <View style={{position:'absolute', bottom:4, left:4, width:width - 8}}>
                <Text h2 h2Style={{...fonts.EventComment, textAlign:'center'}}>{item.date}</Text>
            </View>
    </View>
    {/* // :
    // <View style={{flex:1, backgroundColor:colors.BackgroundBreak, borderRadius:8, padding:8, borderWidth:1, borderColor:colors.BackgroundBorder, ...contentCell}}>
    //     <TouchableHighlight style={{alignSelf:'flex-end'}} underlayColor='transparent' onPress={() => {
    //         onPressLike(item)
    //     }}>
    //     <View style={{}}>
    //         {item.like ?
    //             <Icon
    //                 type='entypo'
    //                 name='heart'
    //                 size={45}
    //                 color={colors.Like}
    //             />
    //             :
    //             <Icon
    //                 type='entypo'
    //                 name='heart-outlined'
    //                 size={45}
    //                 color={colors.Like}
                    
    //             />
    //         }
    //     </View>
    //     </TouchableHighlight>
    //     <View style={{alignItems:'center'}}>
    //         {item.logo != '' ?
    //             <CacheableImage
    //                 permanent={false}
    //                 onLoad={() => {
    //                     console.log('hello')
    //                 }}
    //                 underlayColor='transparent'
    //                 style={{backgroundColor:'transparent', width:48 * 2, height:48 * 2}}
    //                 containerStyle={{backgroundColor:'transparent'}}
    //                 placeholderStyle={{backgroundColor:'transparent'}}
    //                 source={{uri: item.logo}}
    //             /> : <Text h2 h2Style={fonts.EventTitleReverse}>{item.title}</Text>
    //         }

    //         <Text h2 h2Style={{...fonts.EventLikes, textAlign:'center', marginTop:8}}>{item.likes} j'aime{item.likes > 0 ? ' !' : ''}</Text>
    //     </View>
    //     <View style={{marginTop:8, flexDirection:'row', justifyContent:'space-evenly'}}>
    //         <TouchableHighlight style={{borderRadius:8}} underlayColor='transparent' onPress={() => {
    //             onPressDetails(item)
    //         }}>
    //         <View style={{borderWidth:1, backgroundColor:colors.Accent, borderColor:colors.AccentBorder, borderRadius:8, paddingLeft:8, paddingRight:8, paddingBottom:6, paddingTop:6}}>
    //             <Text h2 h2Style={{...fonts.Details}}>Details</Text>
    //         </View>
    //         </TouchableHighlight>
    //     </View> */}
                
    {/* </View>} */}
    </View>
    </TouchableHighlight>));
        }


class Cards extends React.Component {
    static propTypes = {
     // content: PropTypes.string.isRequired,

     /* textStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,*/

      selectedDate: PropTypes.object.isRequired,

      contentViewStyle: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
      onPressDetails: PropTypes.func.isRequired,
      contentSeparatorComponent: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,
      onPressAddNews: PropTypes.func.isRequired
      //onChangeDate: PropTypes.func.isRequired
      /*
      buttonStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.number,
        PropTypes.shape({}),
      ]).isRequired,*/
    }

    constructor() {
        super()

        this.eventsManager = new EventManager()

        this.state = {
            selectedDate: new Date(),
            loading: true,
            cards: [
            ]
        }

    }

    componentDidMount() {
        // this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            this.onRequestCards(this.state.selectedDate)
        // });
    }

    onOrganizeData(cards, callback) {
        // cardsTmp = []

        this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
            cardsTmp = []
            isAdminCardExist = false

            if (user) {
                for (card of cards) {
                    if (card.key == user.uid) {
                        isAdminCardExist = true
                    }
                }

                if (!isAdminCardExist) {
                    cardsTmp.push({key:uuid.v1(), isNewCard:true})
                }
            }

            for (card of cards) {
                const tmp = card
                tmp.isNewCard = false
                tmp.isAdmin = false
                if (user && tmp.key == user.uid) {
                    tmp.isAdmin = true
                }
                tmp.isReturn = false
                tmp.isEmpty = false
                cardsTmp.push(tmp)
            }
            
            if (cardsTmp.length % 2 == 1) {
                const tmp = {}
                tmp.key = uuid.v1()
                tmp.isAdmin = false
                tmp.isNewCard = false
                tmp.isReturn = false
                tmp.isEmpty = true

                cardsTmp.push(tmp)
            }
            callback(cardsTmp)
        })
        // return cardsTmp
    }

    onRequestCards(date) {
        this.eventsManager.fetch(date, this.props.departementCode, (cards) => {
            this.onOrganizeData(cards, (cardsTmp) => {
                this.setState({cards: cardsTmp, loading:false})
            })
        }, () => {
            this.setState({loading:false})
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.selectedDate !== this.props.selectedDate){
            this.setState({cards:[], loading:true})
            this.onRequestCards(this.props.selectedDate)
        }
      }

      onPressLike(item) {
        if (item.like) {
            this.eventsManager.fetchUnlikeEvent(item.key, this.props.selectedDate, this.props.departementCode, getUniqueId(), () => {
                console.log('sucess UNLIKE')
            }, () => {
                console.log('failure UNLIKE')
            })
            item.likes -= 1
            item.like = false
        } else {
            this.eventsManager.fetchLikeEvent(item.key, this.props.selectedDate, this.props.departementCode, getUniqueId(), () => {
                console.log('sucess LIKE')
            }, () => {
                console.log('failure LIKE')
            })
            item.likes += 1
            item.like = true
        }
        this.forceUpdate()
    }

    onDeletePress() {
        // const eventsManager = this.props.navigation.state.params.eventsManager
        const id = firebase.auth().currentUser.uid
        const date = this.props.selectedDate
        
        this.eventsManager.deleteLike(date, id, () => {
          console.log('success')
          this.eventsManager.deleteEvent(date, id, () => {
            console.log('success')
            // this.fillValues()
            this.onRequestCards(date)
            // this.forceUpdate()
          }, () => {
            console.log('failed')
          })
         // this.fillValues()
        }, () => {
          console.log('failed')
        })
    }

    render = () => {
      const { contentViewStyle, contentSeparatorComponent, selectedDate, departementCode, onPressDetails, onPressAddNews } = this.props;

        if (this.state.loading) {
            return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large" color={colors.Accent} />
                </View>
            );
        }

      return (
          <View style={{flex:1}}>
              {this.state.cards.length > 0 &&
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.cards}
                    contentContainerStyle={contentViewStyle}
                    numColumns={2}
                    renderItem={( item ) => {

                            return <DefaultRow
                            itemContent={item}
                                onPressLike={(item) => this.onPressLike(item)}
                                onPressOnCard={(item) => {
                                    // item.isReturn = !item.isReturn
                                    // console.log(item.title)
                                    onPressDetails(item)
                                    // this.forceUpdate()
                                }}
                                // onPressDetails={(item) => {
                                //     console.log(item.title)
                                //     onPressDetails(item)
                                // }}
                                onPressAddNews={() => {
                                    console.log('ADD')
                                    onPressAddNews()
                                    // navigate('')
                                }}
                                onDeletePress={() => {
                                    this.onDeletePress()
                                }}
                            />
                        }
                    }
                    keyExtractor={item => item.key}
                    ItemSeparatorComponent={() => {
                        return (
                          <View style={contentSeparatorComponent}></View>
                        )
                      }}
                />}
            {this.state.cards.length == 0 &&
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Icon
                    type='MaterialIcons'
                    name='event-busy'
                    color={colors.Accent}
                    size={150}
                />
                <Text h2 h2Style={fonts.EventTitle}>Aucun évenement trouvé ...</Text>
            </View>}
        </View>
      );
    }
  }

const styles = StyleSheet.create({
    
});

export default Cards;