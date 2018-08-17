import React from 'react'
import {
    AsyncStorage,
    Text,
    View,
    Button,
    TextInput,
    ScrollView,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    KeyboardAvoidingView
} from 'react-native'
import { connect } from 'react-redux'
import uuidv4 from '../../utils/uuid'
import getData from '../../services/events'

const Message_nc = (props) => {
    const position = props.message.isMe ? 'flex-end' : 'flex-start'
    const color = props.message.isMe ? 'deepskyblue' : 'powderblue'
    return (
        <TouchableHighlight
            style={{
                flex: 1,
                alignSelf: `${position}`,
                backgroundColor: `${color}`,
                borderRadius: 10,
                maxWidth: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 8
            }}
            onPress={() => {
                if (!props.message.noLink) {
                    props.navigate('Chat', { msg: props.message.question,url: props.message.url, searchResults: props.message.searchResults })
                }
            }}
        >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Text style={{ margin: 3 }}>{props.message.msg}</Text>
                {props.speech==1 &&
                <View style={{ margin: 5 }}>
                    <Button title="Lue" onPress={() => Expo.Speech.speak(props.message.msg, { language: 'fi' })} />
                </View>
                }
            </View>
        </TouchableHighlight>
    )
}
const mapStateToProps = (store) => {
    return {
        speech: store.speech
    }
}
const Message = connect(mapStateToProps, null)(Message_nc)
class ChatList extends React.Component {
    _keyExtrator = (item) => {
        return (item.id)
    }
    render() {
        return (
            <FlatList
                data={this.props.data}
                keyExtractor={this._keyExtrator}
                renderItem={({ item }) => <Message message={item} navigate={this.props.navigate} />}
            />
        )
    }
}

class ChatView extends React.Component {
    static navigationOptions = {
        title: 'Menochat',
    };
    constructor(props) {
        super(props)
        this.state = {
            name: null,
            msg: '',
            chatlog: [{
                id: '1',
                msg: 'Hei, olen menohaku-chatbot.',
                isMe: false,
                noLink: true
            },
            {
                id: '2',
                noLink: true,
                isMe: false,
                msg: 'Minulta voit kysyä pääkaupunkiseudun menoista.'
            },
            {
                id: '3',
                noLink: true,
                msg: 'Esimerkiksi näin: Mitä menoa löytyy Espoosta tänään.',
                isMe: false
            }],
            searchResults: [],
            loading: false
        }
    }
    componentDidMount() {
        this.props.saveInfo()
        AsyncStorage.getItem('name', (errs,result) => {
            if (!errs) {
                if (result !== null) {
                    this.setState({
                        name: result,
                        chatlog: [{
                            noLink: true,
                            id: '1',
                            msg: `Hei ${result}, olen menohaku-chatbot.`
                        },
                        ...this.state.chatlog.slice(1, this.state.chatlog.length)]
                    })
                }
            }
        })
    }
    handleChange = (msg) => {
        this.setState({
            msg
        })
    }
    
    sendQuestion = async () => {
        this.setState({ loading: true })
        if (this.state.msg === '') {
            this.setState( { loading: false })
            return
        }
        const message_id = uuidv4()
        const msg = this.state.msg
        this.setState({msg:''})
        let message={id:message_id,msg:msg, isMe: true, noLink: true}
        this.setState({chatlog: [...this.state.chatlog,message]})
        const result = await getData(msg)
        if (result.error) {
            this.setState({ error: true})
            this.setState({ loading: false})
            setTimeout(() => {
                this.setState({error: undefined})
            }, 4000)
        }

        const n = this.state.chatlog.length
        // TODO: Should change message with matching uuid, not the last one.
        this.setState({chatlog: [...this.state.chatlog.slice(0,n-1),{id:message_id,suggestionData: result.suggestionData,msg:msg, isMe: true, noLink: false,searchResults:result.searchResults}]})
        
        this.setState({chatlog: [...this.state.chatlog,{id:uuidv4(),searchResults:result.searchResults,suggestionData: result.suggestionData, question: result.msg, msg:`Löytyi ${result.eventCount} menoa`, isMe: false, url: result.url}]})
        console.log(result.eventCount)
        this.setState({loading: false })
        
    }
    render() {
        return(
            <KeyboardAvoidingView
                behavior="padding"
                style={{
                    flex: 1
                }}
            >
                <View>
                    <TextInput 
                        onChangeText={this.handleChange}
                        onSubmitEditing={this.sendQuestion}
                        value={this.state.msg}
                        placeholder="Kysy botilta"
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            height: 60,
                            margin: 15,
                            padding: 15,
                            flexShrink: 0
                        }}
                    />
                    <Button title="kysy"  onPress={this.sendQuestion} />
                    {this.state.error && <Text style={{backgroundColor: "#FF0000",alignSelf: 'stretch',textAlign: 'center'}}>Verkkovirhe</Text>}
                    {this.state.loading && <ActivityIndicator size='large'/>}
                </View>
                <ScrollView
                    ref={ref => this.scrollView = ref}
                    onContentSizeChange={(contentWidth, contentHeight) => {        
                        this.scrollView.scrollToEnd({animated: true});
                    }}
                >
                    <ChatList data={this.state.chatlog} navigate={this.props.navigation.navigate} />
                    
                </ScrollView>
                <View style={{ height: 100 }} />
            </KeyboardAvoidingView>
        )
    }
}
const mapDispatchToPropsChatView = (dispatch) => {
    return {
        setSpeech: (value) => dispatch({ type: 'SET_SPEECH', speech: value }),
        saveInfo: async () => {
            const name = AsyncStorage.getItem('name')
            const age = AsyncStorage.getItem('age')
            const gender = AsyncStorage.getItem('gender')
            const result = await Promise.all([name, age, gender])
            dispatch({
                type: 'SET_INFO',
                name: result[0],
                age: result[1],
                gender: result[2]
            })
        }
    }
}
export default connect(null, mapDispatchToPropsChatView)(ChatView)
