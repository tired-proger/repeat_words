import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    visible: false,
    callback: null,
    callbackData: null
}

const credentialsSlice = createSlice({
    name: "credentials",
    initialState,
    reducers: {
        setDialogData(state, data) {
            state.visible = data.payload.visible;
            state.callback = data.payload.callback;
            state.callbackData = data.payload.callbackData;
        }
    }
});

const { reducer, actions } = credentialsSlice;
const { setDialogData } = actions;

export default reducer;
export { setDialogData };