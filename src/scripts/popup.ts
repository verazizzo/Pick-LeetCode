import { formQuestions } from "../types/formQuestions";
import { eventTarget } from "../types/eventTarget";
import { tagList } from "../tagList";

function createTopicsFilters (){
    tagList.forEach(tagName => {
        let label = document.createElement("label")
        label.setAttribute("for", "Topics")
        label.innerHTML = tagName
        document.getElementById("Topics")?.appendChild(label)
        let checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("name", "Topics")
        checkbox.setAttribute("value", tagName)
        document.getElementById("Topics")?.appendChild(checkbox)
    })
}
function valuesSelected (select : HTMLOptionsCollection | NodeListOf<HTMLFormElement> | undefined) {
    let selectedAr : Array<String | undefined | null> = []
    let len = select?.length as number
    for (let i = 0; i < len; i++){
        if (select instanceof HTMLOptionsCollection ){
            if (select?.item(i)?.selected){
                if (select?.item(i)?.value == "null"){
                    selectedAr.push(null)
                } else {
                    selectedAr.push(select?.item(i)?.value)
                }
             } 
        }
        else if (select instanceof NodeList){
            if (select?.item(i)?.checked){
                selectedAr.push(select?.item(i)?.value) 
             }
        }
    }
    return selectedAr
} 

function setEmptyFiltersToDefault(formData : formQuestions){
    if (formData.Difficulty.length == 0){
        formData.Difficulty = ["Easy", "Medium", "Hard"]
    }
    if (formData.Status.length == 0){
        formData.Status = ["notac", null]
    }
    if (formData.Topics.length == 0){
        formData.Topics = tagList
    }
    return formData
}


async function submitHandler( e: SubmitEvent) {
    e.preventDefault()
    let eventTarget = e.target as unknown as eventTarget
    let formData = {
        "Difficulty" : valuesSelected(eventTarget.Difficulty.options) as Array<String>,
        "Status" : valuesSelected(eventTarget.Status.options) as Array<String | null>,
        "Premium" : eventTarget.Premium.checked as boolean,
        "numberOfLeetcode": eventTarget.numberOfLeetcode.value as bigint,
        "Topics" : valuesSelected(eventTarget.Topics) as Array<String>
    } 
    formData = setEmptyFiltersToDefault(formData)
    sendMessage(formData).catch(err=>console.error(err)).then((res)=>console.log(res));
}

async function sendMessage(formData : formQuestions){
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    const response_contentS = await chrome.tabs.sendMessage(tab.id ? tab.id : chrome.tabs.TAB_ID_NONE, {formData});
    const response_serviceW = await chrome.runtime.sendMessage({formData});
}


document.getElementById("myForm")?.addEventListener("submit", (e)=>submitHandler(e))
createTopicsFilters()
//TODO: show form preferences on popup.html
