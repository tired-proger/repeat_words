import React, { useEffect, useState, useRef } from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Stack, Dialog, DialogActions, DialogContent, Zoom, Snackbar, Alert, useMediaQuery } from '@mui/material';
import Input from '../Input/Input';
import AddSentence from '../AddSentence/AddSentence';
import { useSelector, useDispatch } from 'react-redux';
import { editDescriptionWord, editSentenceWord, addSentenceWord, deleteSentenceWord } from '../../api/points';
import { setDialogData } from '../../store/Slices/credentialsSlice';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />;
});

const Edit = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id, word, description, sentences } = useSelector(state => state.word.editingWord);
    const visibility = useSelector(state => state.loader.visibility);
    const [ descriptionValue, setDescriptionValue ] = useState(() => description || "");
    const [ dialogVisibility, setDialogVisibility ] = useState(false);
    const editContent = useRef(null);
    const [snack, setSnack] = useState({ visible: false, mode: null, content: null });

    useEffect(() => { word || navigate("/") }, []);

    const configList = {
        addCallback(value) { 
            let data = { wordID: id, text: value, cb: addSentenceWord };
            editContent.current = data;
            setDialogVisibility(true);
        },
        editCallback(sentenceId, value) { 
            let data = { wordID: id, text: value, id: sentenceId, cb: editSentenceWord };
            editContent.current = data;
            setDialogVisibility(true);
        },
        removeCallback(sentenceId) { 
            let data = { wordID: id, id: sentenceId, cb: deleteSentenceWord };
            editContent.current = data;
            setDialogVisibility(true);
        }
    };

    const matchesOne = useMediaQuery("(max-width:380px)");

    const descriptionHandler = (mode) => {
        let data = null;

        if (mode === "edit") {
            data = { id, text: descriptionValue, cb: editDescriptionWord };
        } else { data = { id, text: "", setDescriptionValue, cb: editDescriptionWord } }

        editContent.current = data;
        setDialogVisibility(true);
    }

    const dialogCloseHandler = (mode) => {
        setDialogVisibility(false);
        if (mode === "send") { 
            const { cb, ...data } = editContent.current;
            dispatch(setDialogData({
                visible: true,
                callback: cb,
                callbackData: { ...data, setSnack }
            }));
        }
    }

    const onCloseSnackbar = () => setSnack({ visible: false, mode: snack.mode, content: snack.content });

    return (
        <Box sx={{ p: "20px" }}>
            
            <Link to="/">
                <Button variant="contained" startIcon={<KeyboardArrowLeftIcon />}>Назад</Button>
            </Link>     

            <Box sx={{ maxWidth: "520px", m: "20px auto 14px" }}>
                <Box>
                    <Typography sx={{ textTransform: "uppercase", textAlign: "center", mb: "24px" }} variant="h6">
                        Редактирование информации
                    </Typography>
                    <Box>
                        <Typography sx={{ textAlign: "center", textTransform: "uppercase" }} variant="h5">
                            { word }
                        </Typography>
                    </Box>
                    <Box>
                        <Input 
                            title="Определение слова"
                            label="Определение"
                            multi={true}
                            value={descriptionValue}
                            onChange={setDescriptionValue}
                            disabled={visibility}
                        />
                        <Stack alignItems="center" direction="row" spacing={1} sx={{ mt: "10px" }}>
                            <Button 
                                color="warning" 
                                size="small" 
                                variant="contained"
                                disabled={visibility}
                                onClick={() => descriptionHandler("edit")}
                            >
                                Редактировать
                            </Button>
                            <Button 
                                color="error" 
                                size="small" 
                                variant="contained"
                                disabled={visibility}
                                onClick={() => descriptionHandler("delete")}
                            >
                                Удалить
                            </Button>
                        </Stack>
                    </Box>
                    <AddSentence list={sentences} configList={configList} isLoading={visibility} needLoading={true} />
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
                open={dialogVisibility}
                TransitionComponent={Transition}
                onClose={() => dialogCloseHandler()}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Typography 
                        variant={ matchesOne ? "h6" : "h5" } 
                        sx={{ textAlign: "center" }}
                    >
                        Вы точно хотите внести изменения?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => dialogCloseHandler("send")}>Внести</Button>
                    <Button onClick={() => dialogCloseHandler()}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Edit;
