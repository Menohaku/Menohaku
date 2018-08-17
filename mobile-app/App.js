import React from 'react'
import { Provider } from 'react-redux'
import { TabNavigator } from 'react-navigation'
import { Platform, StatusBar } from 'react-native'
import store from './store'
import Chat from './components/Chat'
import Profile from './components/Profile'
import ChatView from './components/Chat/ChatView'

const Tap = TabNavigator({
    ChatView: { screen: ChatView },
    Chat: { screen: Chat },
    Profile: { screen: Profile }
}, {
    tabBarOptions: {
        style: {
            paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
        }
    }
})
const App = () => (
    <Provider store={store}>
        <Tap />
    </Provider>
)
export default App
