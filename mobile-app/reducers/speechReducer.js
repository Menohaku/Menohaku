const initialState = {
    speech: 0,
    name: '',
    age: '',
    gender: '',
    message: undefined
}

function speechReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_SPEECH':
            return Object.assign({}, state, {
                speech: action.speech
            })
        case 'SET_INFO':
            return Object.assign({}, state, {
                name: action.name,
                age: action.age,
                gender: action.gender
            })
        case 'NOTIFICATION':
            console.log('SUCCESS MESSAGE', action.message)
            return Object.assign({}, state, { message: action.message })
        case 'HIDE_NOTIFICATION':
            return Object.assign({}, state, { message: undefined })
        default:
            return state
    }
}

export default speechReducer
