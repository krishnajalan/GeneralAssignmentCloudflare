import { AUTH, LOGOUT} from '../constants/actionTypes';

const authReducer = (state={authData:null}, action) => {
    switch(action.type){
        case AUTH:
            return state
        case LOGOUT:
            return state
        default:
            return state
    }
}

export default authReducer;