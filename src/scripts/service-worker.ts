import { formQuestions } from "../types/formQuestions";
import { message, messageType } from "../types/message";

function getPrefFromStorage(){
    chrome.storage.local.get(["formValue"]).then((result) => {
        let formQuestion = result.formValue as formQuestions
        let message = {Type: messageType.formPref, Body: formQuestion} as message
        sendMessage(message).catch(err=>console.log(err)).then((res)=>console.log(res));
    });
}

async function sendMessage(message : message){
    const response_popup = await chrome.runtime.sendMessage({message});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let message = request as message
        if (message.Type == messageType.popupOpen){
            getPrefFromStorage()
        } else {
            let formData = request.message.Body as formQuestions
            chrome.storage.local.set({"formValue": formData}, () => {
            });
        }
    }
);