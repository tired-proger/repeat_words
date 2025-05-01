import React, { useState, useMemo } from 'react';
import { Box, Button, Snackbar, Alert, Typography, Zoom, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from "@mui/material";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Input from '../Input/Input';
import AddSentence from '../AddSentence/AddSentence';
import { Link } from 'react-router-dom';
import { validateInput } from '../../utils/validateInput';
import { sendWord } from '../../api/points';
import { useSelector, useDispatch } from 'react-redux';
import { setDialogData } from '../../store/Slices/credentialsSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const AddWord = () => {

    const [listSentences, setListSentences] = useState([]);
    const [titleInput, setTitleInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState("");
    const [isErrorWord, setIsErrorWord] = useState(false);
    const [snack, setSnack] = useState({ visible: false, mode: null, content: null });
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const isLoading = useSelector(state => state.loader.visibility);

    const dispatch = useDispatch();
    const matchesOne = useMediaQuery("(max-width:400px)");

    const addWordHandler = () => {
        let isValidTitle = validateInput(titleInput);

        if (!isValidTitle) {
            setIsErrorWord(true);
            return;
        }

        setIsOpenDialog(true);
    }

    const sendWordHandler = () => {
        let data = { word: titleInput };
        if (descriptionInput) data.description = descriptionInput;
        if (listSentences.length) data.sentences = listSentences.map(el => el.sentence); 

        dispatch(setDialogData({ 
            visible: true, 
            callback: sendWord, 
            callbackData: { data, setListSentences, setTitleInput, setDescriptionInput, setSnack } })
        );
        
    }

    const sentenceHandlers = useMemo(() => ({
        addCallback: (text) => {
            setListSentences([ ...listSentences, { id: Date.now(), sentence: text } ]);
        },
        editCallback: (id, text) => {
            setListSentences( listSentences.map(el => el.id === id ? { ...el, sentence: text } : el) );
        },
        removeCallback: (id) => {
            setListSentences( listSentences.filter(el => el.id !== id) );
        }
    }), [listSentences]);

    const onCloseSnackbar = () => setSnack({ visible: false, mode: snack.mode, content: snack.content });

    const handleCloseDialog = (mode) => {
        setIsOpenDialog(false);
        if (mode === "send") sendWordHandler();
    }
    
    return (
        <Box sx={{ p: "20px" }}>
            <Box>

                <Link to="/">
                    <Button variant="contained" startIcon={<KeyboardArrowLeftIcon />}>Назад</Button>
                </Link>     

                <Box sx={{ mt: "30px" }}>
                    <Typography sx={{ textTransform: "uppercase", textAlign: "center", mb: "24px" }} variant="h6">
                        Добавление слова
                    </Typography>

                    <Box sx={{ maxWidth: "520px", m: "20px auto 14px" }}>

                        <Input 
                            required={true}
                            title={"Название слова"} 
                            label={"Название"} 
                            multi={true} 
                            onChange={setTitleInput}
                            value={titleInput}
                            error={isErrorWord}
                            errorMessage={isErrorWord && "Поле должно содержать минимум 3 символа"}
                            onFocus={() => setIsErrorWord(false)}
                            isDisabled={isLoading}
                        />

                        <Input 
                            title={"Определение слова"} 
                            label={"Определение"} 
                            multi={true} 
                            onChange={setDescriptionInput}
                            value={descriptionInput}
                            isDisabled={isLoading}
                        />

                        <AddSentence list={listSentences} configList={sentenceHandlers} isLoading={isLoading} />

                        <Button 
                            fullWidth={true}
                            variant="contained"
                            sx={{ mt: "14px" }}
                            onClick={addWordHandler}
                            disabled={isLoading}
                        >
                            Добавить слово
                        </Button>

                    </Box>
                </Box>
            </Box>

            <Snackbar 
                open={snack.visible} 
                onClose={onCloseSnackbar}
                autoHideDuration={5000}
            >
                <Alert 
                    variant="filled" 
                    onClose={onCloseSnackbar} 
                    severity={snack.mode}
                >
                    { snack.content }
                </Alert>
            </Snackbar>

            <Dialog
                open={isOpenDialog}
                TransitionComponent={Transition}
                onClose={() => handleCloseDialog()}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle
                    sx={{ fontSize: matchesOne ? "16px" : "20px" }}
                >
                    {"Вы уверены что хотите добавить данное слово?"}
                </DialogTitle>
                <DialogContent>
                    <Typography variant={ matchesOne ? "h5" : "h4" }>{ titleInput }</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleCloseDialog("send")}>Добавить</Button>
                    <Button onClick={() => handleCloseDialog()}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AddWord;
