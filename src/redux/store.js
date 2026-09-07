import { configureStore } from "@reduxjs/toolkit";

import authReducer    from "./reducers/authReducers";
import cartReducer    from "./reducers/cartReducer";
import wishlistReducer from "./reducers/wishlistReducer";
import compareReducer  from "./reducers/compareReducer";

export const store = configureStore({
    reducer: {
        auth:     authReducer,
        cart:     cartReducer,
        wishlist: wishlistReducer,
        compare:  compareReducer,
    },
});

export default store;