import { api } from "./apiInstance";
import { toggleLoaderVisibility } from "../store/Slices/loaderSlice";
import { setWords, setIsLoadingWords, editDescription, editSentences } from "../store/Slices/wordsSlice";
import { setScroll } from "../utils/setScroll";

//helper function for set headers   .match(/[\wа-я]+/ig); 
const addHeaders = (login, pass) => {

    if (login.match(/[а-яА-Я]+/ig) || pass.match(/[а-яА-Я]+/ig)) {
        login = "";
        pass = "";
    }

    const creds = JSON.stringify({ login, pass });

    return ({
        headers: {
            "Authorization": `Basic ${creds}`
        }
    });
}

function getRandomWords(data) {

    const { mode, setIsPressed } = data;

    return async (dispatch) => {
        try {

            setScroll("hide");
            dispatch(setIsLoadingWords(true));
            let response = await api.get(`?mode=${mode}`);
            dispatch(setWords(response.data));
            dispatch(setIsLoadingWords(false));
            setScroll("show");
            if (setIsPressed) setIsPressed(false);
    
        } catch(e) {
            setScroll("show");
            dispatch(setIsLoadingWords(false));
            alert("При запросе на сервер, произошла ошибка, попробуйте ещё раз");
        }
    }

}

//edit word points
function editDescriptionWord(data) {

    const { id, text, setSnack, setDescriptionValue, login, pass, closeDialog } = data;

    return async (dispatch) => {
        try {

            closeDialog();
            dispatch(toggleLoaderVisibility(true));
            const response = await api.post("description", { id, text }, addHeaders(login, pass));
            console.log(response);
            if (response.statusText !== "OK") throw new Error("Ошибка");
            
            dispatch(editDescription({ id, content: text }));
            if (setDescriptionValue) setDescriptionValue("");
            setSnack({ visible: true, mode: "success", content: "Данные обновлены" });
    
        } catch(e) {
            setSnack({ visible: true, mode: "error", content: "Ошибка обновления данных" });
        } finally {
            dispatch(toggleLoaderVisibility(false));
        }
    }

}

function editSentenceWord(data) {

    const { id, text, wordID, setSnack, login, pass, closeDialog } = data;

    return async (dispatch) => {
        try {

            closeDialog();
            dispatch(toggleLoaderVisibility(true));
            const response = await api.post("sentences/edit", { id, text }, addHeaders(login, pass));
            if (response.statusText !== "OK") throw new Error("Ошибка");

            dispatch(editSentences({ wordID, mode: "editing", content: text, sentenceId: id }));
            setSnack({ visible: true, mode: "success", content: "Данные обновлены" });
    
        } catch(e) {
            setSnack({ visible: true, mode: "error", content: "Ошибка обновления данных" });
        } finally {
            dispatch(toggleLoaderVisibility(false));
        }
    }

}

function addSentenceWord(data) {

    const { text, wordID, setSnack, login, pass, closeDialog } = data;

    return async (dispatch) => {
        try {

            closeDialog();
            dispatch(toggleLoaderVisibility(true));
            const response = await api.post("sentences/add", { id: wordID, text }, addHeaders(login, pass));
            if (response.statusText !== "OK") throw new Error("Ошибка");

            dispatch(editSentences({ wordID, mode: "add", content: text, id: response.data.id }));
            setSnack({ visible: true, mode: "success", content: "Данные обновлены" });
    
        } catch(e) {
            setSnack({ visible: true, mode: "error", content: "Ошибка обновления данных" });
        } finally {
            dispatch(toggleLoaderVisibility(false));
        }
    }

}

function deleteSentenceWord(data) {

    const { id, wordID, setSnack, login, pass, closeDialog } = data;

    return async (dispatch) => {
        try {

            closeDialog();
            dispatch(toggleLoaderVisibility(true));
            const response = await api.post("sentences/delete", { id }, addHeaders(login, pass));
            if (response.statusText !== "OK") throw new Error("Ошибка");

            dispatch(editSentences({ wordID, mode: "delete", sentenceId: id }));
            setSnack({ visible: true, mode: "success", content: "Данные обновлены" });
    
        } catch(e) {
            setSnack({ visible: true, mode: "error", content: "Ошибка обновления данных" });
        } finally {
            dispatch(toggleLoaderVisibility(false));
        }
    }

}

//add word points
function sendWord(props) {

    let { data, setListSentences, setTitleInput, setDescriptionInput, setSnack, login, pass, closeDialog } = props;

    return async (dispatch) => {
        try {

            closeDialog();
            dispatch(toggleLoaderVisibility(true));
            const response = await api.post("add", data, addHeaders(login, pass));
            if (response.statusText !== "OK") throw new Error("Ошибка");
    
            setListSentences([]);
            setDescriptionInput("");
            setTitleInput("");
            setSnack({ visible: true, mode: "success", content: "Слово успешно добавлено" });
    
        } catch(e) {
            let errorContent = e.response.data.error === "already have" ? "Добавляемое слово уже существует" : "Произошла ошибка";
            setSnack({ visible: true, mode: "error", content: errorContent });
        } finally {
            dispatch(toggleLoaderVisibility(false));
        }
    }

}

export { 
    sendWord, 
    editDescriptionWord, 
    editSentenceWord, 
    deleteSentenceWord, 
    addSentenceWord,
    getRandomWords
};
