import React from 'react'
import { connect } from 'react-redux'
import {
    CheckBox,
    AsyncStorage,
    Text,
    View,
    ScrollView,
    Button,
    TextInput,
    Picker,
    Linking,
    Slider,
    Image
} from 'react-native'

class Profile extends React.Component {
    static navigationOptions = {
        title: 'Profiili'
    }
    constructor(props) {
        super(props)
        this.state = {
            _name: '',
            _age: '',
            _gender: undefined,
            checked: false
        }
    }
    componentWillMount() {
        this.setState({
            _name: this.props.name,
            _age: this.props.age,
            _gender: this.props.gender
        })
    }
    save =() => {
        this.props.saveInfo(this.state._name, this.state._age, this.state._gender)
    }
    render() {
        const { checked } = this.state
        return (
            <ScrollView onLayout={this.layout}>
                <Text
                    style={{ color: 'green', textAlign: 'center', fontSize: 18}}
                >
                    {this.props.message}
                </Text>
                <TextInput value={this.state._name} onChangeText={(text)=>this.setState({'_name':text})}
                    placeholder="Nimimerkki"
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: 60,
                        margin: 15,
                        padding: 15,
                        flexShrink: 0
                    }}
                />
                <TextInput
                    value={this.state._age}
                    onChangeText={(text) => this.setState({ _age: text })}
                    placeholder="Ika"
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        borderColor: 'gray',
                        height: 60,
                        margin: 15,
                        padding: 15,
                        flexShrink: 0
                    }}
                />
                <Picker
                    style={{
                        height: 60,
                        margin: 15,
                        padding: 15,
                        flexShrink: 0
                    }}
                    selectedValue={this.state._gender || '-'}
                    placeholder = "test"
                    onValueChange={(itemValue, itemIndex) => this.setState({_gender: itemValue})}
                >

                    <Picker.Item label="mies" value="mies" />
                    <Picker.Item label="nainen" value="nainen" />
                    <Picker.Item label="-" value="-" />
                </Picker>
                <View
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: 'black',
                        width: this.state.width
                    }}
                />
                <View
                    style={{
                        width: 100,
                        margin: 20,
                        padding: 15,
                        flexDirection: 'row'
                    }}
                >
                    <Text>Puhe</Text>
                    <Slider
                        style={{ width: 100 }}
                        title="puhe"
                        maximumValue={1}
                        minimumValue={0}
                        step={1}
                        value={this.props.speech} 
                        onSlidingComplete={(value) => this.props.setSpeech(value)}
                    />
                    <Text>{this.props.speech ? 'Päällä' : 'Pois'}</Text>
                </View>
                <View style={{ margin: 20, padding: 15, flexDirection: 'row' }}>
                    <Text >Annan suostumukseni tietojen käsittelyyn: </Text>
                    <CheckBox value={this.state.checked} onChange={() => this.setState({checked: !this.state.checked})} title='Annan suostumukseni tietojen käsittelyyn'/>
                </View>
                <View style={{ marginBottom: 20 }}>
                    <Button title="Tietosuojaseloste" onPress={() => Linking.openURL('https://yourserver/tietosuojaseloste')} />
                </View>
                <Button title="Tallenna" onPress={this.save} />
                <View style={{ margin: 20, padding: 15 }}>
                    <Image
                        style={{ width: 66, height: 58 }}
                        source={require('../Chat/noun_1004875.png')}
                    />
                    <Text>By Oksana Latysheva, UA In the
                        <Text
                            onPress={() =>
                                Linking.openURL('https://thenounproject.com/latyshevaoksana/collection/party_set4/')}
                            style={{ color: 'blue', textDecorationLine: 'underline' }}
                        > Party_Set4
                        </Text> Collection
                    </Text>
                    <Text>
                        <Text
                            onPress={() =>
                                Linking.openURL('https://creativecommons.org/licenses/by/3.0/us/legalcode') }
                            style={{ color: 'blue', textDecorationLine: 'underline' }}
                        > Creative Commons
                        </Text>
                    </Text>
                </View>
            </ScrollView>
        )
    }
}
const mapStateToProps = (store) => {
    return {
        speech: store.speech,
        name: store.name,
        gender: store.gender,
        age: store.age,
        message: store.message
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSpeech: (value) => dispatch({ type: 'SET_SPEECH', speech: value }),
        saveInfo: async (name, age, gender) => {
            try {
                await Promise.all([AsyncStorage.setItem('name',name),
                    AsyncStorage.setItem('age', age),
                    AsyncStorage.setItem('gender', gender)])
                dispatch({
                    type: 'SET_INFO',
                    name,
                    age,
                    gender
                })
            } catch (e) {
                dispatch({
                    type: 'NOTIFICATION',
                    message: 'Tallennus ei onnistunut'
                })
                setTimeout(() => {
                    dispatch({ type: 'HIDE_NOTIFICATION' })
                }, 2000)
                return
            }
            dispatch({
                type: 'NOTIFICATION',
                message: 'Tallennettu'
            })
            setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION' })
            }, 2000)
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
