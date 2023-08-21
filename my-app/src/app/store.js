import { configureStore } from '@reduxjs/toolkit';

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
    name: nameReducer,
    phoneNumber: phoneNumberReducer
  }
});
