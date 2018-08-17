import React from 'react'
import axios from 'axios'
import moment from 'moment'
import { connect } from 'react-redux'
import {
    AsyncStorage,
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Button,
    TextInput,
    Image,
    ScrollView,
    Modal,
    ActivityIndicator
} from 'react-native'
import { dateRangeSearch, createDateRange } from '../../utils/dateFinder'
import { locationSearch } from '../../utils/locationFinder'
import getData from '../../services/events'
import uuidv4 from '../../utils/uuid'
import Event from '../Event'

const TEST_IMAGE = require('./noun_1004875.png')

class Chat extends React.Component {
    static navigationOptions = {
        title: 'Menohaku'
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const question = nextProps.navigation.getParam('msg', undefined)
        const url = nextProps.navigation.getParam('url', undefined)
        const searchResults = nextProps.navigation.getParam('searchResults', [])
        prevState.msg = question
        prevState.url = url
        prevState.searchResults = searchResults
        return (prevState)
    }
    constructor(props) {
        super(props)
        this.state = {
            msg: '',
            chatlog: [],
            searchResults: [],
            suggestionData: [],
            loading: false,
            latitude: null,
            longitude: null,
            error: null,
            message: null,
            uuid:null,
            url: null,
            event: null
        }
        // this.send = this.send.bind(this)
        this.handleChange = this.handleChange.bind(this)
        // this.getData = this.getData.bind(this)
        this.back = this.back.bind(this)
        // this.calculateSuggestionPoints = this.calculateSuggestionPoints.bind(this)
       // this.sortResultsWithSuggestionData = this.sortResultsWithSuggestionData.bind(this)
    }

 
    async componentDidMount() {
        let uuid
        uuid = await AsyncStorage.getItem('uuid')
        if (!uuid) {
            uuid = uuidv4()
            await AsyncStorage.setItem('uuid', uuid)
        }
        this.setState( { uuid })
    } 
    getLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.setState({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        error: null
                    })
                    resolve()
                },
                (error) => {
                    this.setState({error: error.message})
                    reject()
                }
            )
        })
    }
    sendQuestion= async () => {
        this.setState({ loading: true })
        if (this.state.msg === '') {
            this.setState({ loading: false })
            return
        }
        this.setState({ searchResults: [] })
        const msg = this.state.msg.toLocaleLowerCase()
        let result
        try {
            result = await getData(msg)
        } catch (e) {
            console.log('send q', e)
        }
        if (result.error) {
            this.setState({ error: true })
            this.setState({ loading: false })
            setTimeout(() => {
                this.setState({ error: undefined })
            }, 4000)
        }
        this.setState({ loading: false })
        this.setState({
            searchResults: result.searchResults
        })
    }
    handleChange(msg) {
        this.setState({
            msg
        })
    }
    back() {
        this.setState({
            event: null
        })
    }
    async clicked(id, keywords) {
        const age = await AsyncStorage.getItem('age')
        const gender = await AsyncStorage.getItem('gender')
        const info = {
            id,
            time: new Date(),
            uuid: this.state.uuid,
            age,
            gender,
            keywords: keywords.map((x) => x['@id'])
        }
       
        axios.post('http://server.invalid/click', info).catch((e) => console.log('Can not access to data-collection server',e ))
    }
    async openEvent(id) {
        const reply = await axios.get(`https://api.hel.fi/linkedevents/v1/event/${id}/?include=location,keywords`)
        this.setState({
            event: reply.data
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View className="chat" style={styles.container}>
                { (this.state.event === null) &&
                <View
                    style={{
                        width:'100%'
                    }}
                >
                    <View
                        style={{
                            width:'100%'
                        }}
                    >
                        <TextInput
                            onChangeText={this.handleChange}
                            value={this.state.msg}
                            placeholder="Kirjoita tähän haku"
                            style={{
                                borderWidth: 1,
                                borderColor: 'gray',
                                height: 60,
                                margin: 15,
                                padding: 15,
                                flexShrink: 0
                            }}
                            onSubmitEditing={this.sendQuestion}
                        />
                        {this.state.message &&
                            <Text
                                style={{
                                    backgroundColor: '#ff0000',
                                    height: 20,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textAlign: 'center'
                                }}
                            >
                                {this.state.message}
                            </Text>}
                        <Button
                            title="HAE"
                            onPress={this.sendQuestion}
                            style={{
                                flexShrink: 0
                            }}
                        />
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }
                            }
                            >

                                <ActivityIndicator
                                    size="large"
                                    animating={this.state.loading}
                                />
                                {this.state.loading &&
                                <Text> Haetaan...</Text>}
                            </View>
                            {this.state.error &&
                            <Text style={{
                                backgroundColor: '#FF0000',
                                alignSelf: 'stretch',
                                textAlign: 'center'
                            }}
                            > Virhe tapahtumien haussa
                            </Text>}
                        </View>

                    </View>
                    <ScrollView
                        style={{
                            width: '100%'
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: '#efefef',
                                height: 50,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Text style={{ fontWeight: 'bold' }}> Hakutulokset: </Text>
                        </View>
                        
                        {
                            this.state.searchResults.map((result) => {
                                const street_address = result.location?result.location.street_address?result.location.street_address.fi : '-' : '-'
                                const postal_code = result.location?  result.location.postal_code? result.location.postal_code : '-' : '-'
                                const address_locality = result.location?  result.location.address_locality? result.location.address_locality.fi : '-' : '-'
                                const img = result.images[0]
                                const start_time = moment((new Date(result.start_time))).format('D.M.YYYY') + ' ' + (new Date(result.start_time)).toLocaleTimeString().substring(0, 5)
                                let endDate = ''
                                if ((new Date(result.start_time)).getDate() !== (new Date(result.end_time)).getDate()) {
                                    endDate = moment(new Date(result.end_time)).format('D.M.YYYY') + ' '
                                }
                                const end_time = endDate + (new Date(result.end_time)).toLocaleTimeString().substring(0, 5)
                                return (
                                    <TouchableHighlight
                                        key={result.id}
                                        underlayColor="#efefef"
                                        onPress={() => {
                                            this.clicked(result.id, result.keywords)
                                            this.openEvent(result.id)
                                        }}
                                    >
                                        <View
                                            key={result.id}
                                            style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                alignSelf: 'flex-start',
                                                height: 125,
                                                overflow: 'hidden',
                                                flex: 1,
                                                borderWidth: 1
                                            }}
                                        >
                                            <Image
                                                source={result.images[0] ? {
                                                    uri: result.images[0].url
                                                } : TEST_IMAGE}
                                                style={{
                                                    width: 125,
                                                    height: 125
                                                }}
                                            />
                                            <View style={{ flex: 1, height: 125 }}>
                                                <Text
                                                    style={{ padding: 10 }}
                                                    numberOfLines={5}
                                                >
                                                    <Text
                                                        style={{
                                                            fontWeight: 'bold',
                                                            fontSize: 18,
                                                            flex: 1
                                                        }}
                                                    >
                                                        {result.name.fi} {'\n'}
                                                    </Text>
                                                    {
                                                        start_time
                                                    }
                                                    {' - '}
                                                    {
                                                        end_time
                                                    }{', '}
                                                    {street_address}{', '}
                                                    {postal_code}{' '}{address_locality}
                                                    {'\n'}
                                                    {(result.short_description && result.description) ?
                                                        result.short_description.fi :
                                                        result.description && result.description.fi }
                                                </Text>
                                            </View>
                                            {this.props.speech === 1 &&
                                            <Button 
                                                title="lue" 
                                                onPress={() => Expo.Speech.speak(result.name.fi, { language: 'fi' })} 
                                            />}
                                        </View>
                                    </TouchableHighlight>)
                            })
                        }
                    </ScrollView>
                </View>}
                {
                    this.state.event &&
                        <Event data={this.state.event} back={this.back} />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#FFFFFF',
        height: 100,
        width: 100,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around'
    }
})

const mapStateToProps = (store) => {
    return {
        speech: store.speech
    }
}

export default connect(mapStateToProps, null)(Chat)
