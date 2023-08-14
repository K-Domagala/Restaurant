import { configureStore } from '@reduxjs/toolkit';

const userReducer = (state = '', action) => {
  switch(action.type){
    case 'LOG_IN':
      return 'Welcome ' + action.payload;
    case 'LOG_OUT':
      return '';
    default:
      return state;
  }
}

const nameReducer = (state = '', action) => {
  switch(action.type){
    case 'SET_NAME':
      return action.payload;
    default:
      return state;
  }
}

const phoneNumberReducer = (state = '', action) => {
  switch(action.type){
    case 'SET_PHONE_NUMBER':
      return action.payload;
    default:
      return state;
  }
}

export const store = configureStore({
  reducer: {
    user: userReducer,
    name: nameReducer,
    phoneNumber: phoneNumberReducer
  }
});
