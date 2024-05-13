import { formQuestions } from "../types/formQuestions";

function getValues(){
    chrome.storage.local.get(["formValue"]).then((result) => {
        let formQuestion = result.formValue as formQuestions
        sendMessage(formQuestion).catch(err=>console.log(err)).then((res)=>console.log(res));
    });
}

async function sendMessage(formQuestion : formQuestions){
    const response_popup = await chrome.runtime.sendMessage({formQuestion});
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request == "open"){
            getValues()
        } else{
            let formData = request.formData as formQuestions
            chrome.storage.local.set({"formValue": formData}, () => {
            });
        }
    }
);