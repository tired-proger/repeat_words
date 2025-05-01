import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Zoom, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setDialogData } from '../../store/Slices/credentialsSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const CredentialsModal = () => {

    const [input, setInput] = useState({ login: {value: "", hasError: false}, pass: {value: "", hasError: false} });
    const { callback, callbackData, visible } = useSelector(state => state.credentials);
    const dispatch = useDispatch();

    const closeDialog = () => {
        dispatch(setDialogData({ visible: false, callback: null, callbackData: null }));
    }

    const sendData = () => {
        if (!input.login.value.trim()) return setInput(state => ({ ...state, login: { ...state.login, hasError: true } }));
        if (!input.pass.value.trim()) return setInput(state => ({ ...state, pass: { ...state.pass, hasError: true } }));
        dispatch(callback({ ...callbackData, login: input.login.value, pass: input.pass.value }));
    }

    const focusHandler = (type) => {
        if (type === "login") {
            setInput(state => ({ ...state, login: { ...state.login, hasError: false } }))
        } else {
            setInput(state => ({ ...state, pass: { ...state.pass, hasError: false } }))
        }
    }

    const changeHandler = (value, type) => {
        if (type === "login") {
            setInput(state => ({ ...state, login: { ...state.login, value: value } }))
        } else {
            setInput(state => ({ ...state, pass: { ...state.pass, value: value } }))
        }
    }

    return (
        <Dialog
            open={visible}
            TransitionComponent={Transition}
            onClose={closeDialog}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle
                sx={{ fontSize: "18px" }}
            >
                Для совершения этого действия нужно ввести логин и пароль
            </DialogTitle>
            <DialogContent>
                <div style={{ paddingTop: "14px" }}>
                    <TextField 
                        id="login" 
                        label="Введите логин..." 
                        variant="outlined"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        error={input.login.hasError}
                        helperText={input.login.hasError && "Поле не может быть пустым"}
                        onChange={(e) => changeHandler(e.target.value, "login")}
                        onFocus={() => focusHandler("login")}
                    />
                </div>
                <div style={{ marginTop: "10px" }}>
                    <TextField 
                        id="pass" 
                        label="Введите пароль..." 
                        variant="outlined" 
                        type="password"
                        fullWidth
                        error={input.pass.hasError}
                        helperText={input.pass.hasError && "Поле не может быть пустым"}
                        onChange={(e) => changeHandler(e.target.value, "pass")}
                        onFocus={() => focusHandler("pass")}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => sendData()}>Отправить запрос</Button>
                <Button variant="contained" onClick={closeDialog}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CredentialsModal;
