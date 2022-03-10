import { AUTH } from '../constants/actionTypes';

import * as api from '../api/index.js';

export const signin = (fromData, history) => async dispatch => {
    try{
        // login
        const {data} = await api.signin(fromData);
        history('/');
    }catch(error){
        console.error(error);
    }
}

export const signup = (fromData, history) => async dispatch => {
    try{
        // login
        const {data} = await api.signup(fromData);
        history('/');
    }catch(error){
        console.error(error);
    }
}