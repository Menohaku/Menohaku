import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import speechReducer from './reducers/speechReducer'

const store = createStore(speechReducer,applyMiddleware(thunk))
export default store