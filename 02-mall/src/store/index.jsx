import { configureStore, createSlice } from '@reduxjs/toolkit'
import user from './user.jsx'
import data from '../data/products.js'

let modal = createSlice({
    name: 'modal',
    initialState: false,
    reducers: {
        showModal(state) { return true },
        hideModal(state) { return false }
    }
})
export let { showModal, hideModal } = modal.actions;

let products = createSlice({
    name: 'products',
    initialState: data
})
export let {} = products.actions;

let currency = createSlice({
    name: 'currency',
    initialState: '₩'
})
export let {} = currency.actions;

const LIMIT = 12000;

export const calcWeight = (cart) =>
    cart.reduce((sum, i) => sum + i.weight * i.count, 0);
export const selectTotalWeight = (state) => 
    calcWeight(state.cart);
export let selectTotalPay = (state) =>
    state.cart.reduce((sum, i) => sum + i.price * i.count, 0);

let cart = createSlice({
    name: 'cart',
    initialState: [],
    reducers: {
        수량감소(state, action) {
            let item = state.find((i) => i.id === action.payload);
            if (item.count > 1) {
                item.count -= 1;
                console.log(item.name + " Decrease")
            } else {
                alert('Can\'t reduce more!');
            }
        },
        수량증가(state, action) {
            let item = state.find((i) => i.id === action.payload);
            if (calcWeight(state) + item.weight > LIMIT) {
                alert(`무게 합계가 ${LIMIT/1000}kg 초과입니다. 더이상 추가할 수 없습니다.`);
                return; // 여기서 멈추고 증가 로직 실행 안함
            }
            if (item.count < item.stock) {
                item.count += 1;
                console.log(item.name + " Increase")
            } else {
                alert(`재고가 ${item.stock}개입니다. 더이상 구매할 수 없습니다.`);
            }
        },
        수량삭제(state, action) {
            let index = state.findIndex((i) => i.id === action.payload);
            // console.log(state[index].name + " DELETE")
            state.splice(index, 1);
        },
        장바구니추가(state, action) {
            console.log('payload:', action.payload); 
            console.log('현재 무게:', calcWeight(state), '추가 무게:', action.payload.weight);
            if (calcWeight(state) + action.payload.weight > LIMIT) {
                alert('배낭 무게는 12kg를 초과할 수 없습니다.');
                return; // 여기서 멈추고 증가 로직 실행 안함
            }
            let item = state.find((i)=> i.id === action.payload.id);
            if(item){
                item.count +=1;
                action.payload.setShowModal = true;
            }else{
                state.push(action.payload);
            }
        }
    }
})
export let { 수량감소, 수량증가, 수량삭제, 장바구니추가 } = cart.actions;



let orders = createSlice({
    name: 'orders',
    initialState: [],  // 주문 없음
    reducers: {
        addOrder(state, action) { state.push(action.payload) }
    }
})
export let { addOrder } = orders.actions;


export default configureStore({
    reducer: {
        orders : orders.reducer,
        products: products.reducer,
        currency : currency.reducer,
        user: user.reducer,
        cart: cart.reducer,
        modal: modal.reducer
    }
})