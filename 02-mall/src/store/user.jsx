import { createSlice } from "@reduxjs/toolkit";

let user = createSlice({
    // { name : 'state이름', initialState : 'state값' } 
    name: 'user',
    initialState: {name : 'kim', age : 34},
    //state 수정하는 함수
    reducers: {
        이름바꾸는함수(state) {
            state.name = state.name + ' john';
        }
    }
})

export let { 이름바꾸는함수 } = user.actions;

export default user