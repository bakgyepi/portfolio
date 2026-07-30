import { configureStore, createSlice } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";

const storage = {
    getItem: (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(localStorage.removeItem(key)),
};

const persistConfig = {
    key: "profile",
    storage
};


const profileSlice = createSlice({
    name: "profile",
    initialState: {
        pagetitle: "박계피",
        profileImg: null,
        desc: "내가 무슨 사람이게요... 더보기"
    },
    reducers: {
        setPagetitle: (state, action) => { state.pagetitle = action.payload; },
        setProfileImg: (state, action) => { state.profileImg = action.payload; },
        setDesc: (state, action) => { state.desc = action.payload; }
    }
});

export const { setPagetitle, setProfileImg, setDesc } = profileSlice.actions;


const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [
            { id: 1, title: "제목1이에요", date: "2026/06/10", like: 0, img: 'https://picsum.photos/id/222/300/300', desc: 'redux로 만들었어요' },
            { id: 2, title: "제목2이에요", date: "2026/05/03", like: 0, img: 'https://picsum.photos/id/223/300/300', desc: ' 리액트 공부해요'  },
            { id: 3, title: "제목3", date: "2026/04/04", like: 0, img: 'https://picsum.photos/id/24/300/300', desc: '너무 재재재재재미지다 리액트'  },
            { id: 4, title: "제목4", date: "2026/03/03", like: 0, img: 'https://picsum.photos/id/25/300/300', desc: 'state를 관리하려면 redux써라'  },
            { id: 5, title: "제목5", date: "2026/02/01", like: 0, img: 'https://picsum.photos/id/26/300/300', desc: '관리할 state 많이 없으면 props써라'  },
        ]
    },
    reducers: {
        setPosts: (state, action) => { state.posts.push(action.payload); }
    }
});

export const { setPosts } = postSlice.actions;




const persistedReducer = persistReducer(persistConfig, profileSlice.reducer);

export const store = configureStore({
    reducer: {
        post: postSlice.reducer,
        profile: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false })
})


export const persistor = persistStore(store);