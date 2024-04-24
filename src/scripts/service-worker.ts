import { formQuestions } from "../types/formQuestions";

let formQuestion : formQuestions

//Message listener, saves prefereces in the storage
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        formQuestion = request.formData as formQuestions
        //console.log(formQuestion)
        chrome.storage.local.set({"formValues": formQuestion}, () => {
        });
    }
);


//listener of the changes in the storage
chrome.storage.onChanged.addListener((changes, namespace) => {
    chrome.storage.local.get(["formValue"]).then((result) => {
        console.log("Value is " + result.key);
    });
});

//retrive at key "formValue"
chrome.storage.local.get(["formValue"]).then((result) => {
    console.log(result);
});