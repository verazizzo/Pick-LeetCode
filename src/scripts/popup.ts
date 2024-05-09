import { formQuestions } from "../types/formQuestions";
import { submitEventTarget } from "../types/submitEventTarget";
import { tagList } from "../tagList";


function createTopicsFilters (){
    tagList.forEach(tagName => {
        let option = document.createElement("option")
        option.setAttribute("value", tagName)
        option.innerHTML = tagName
        document.getElementById("Topics")?.appendChild(option)
    })
}

function valuesSelected (select : HTMLOptionsCollection | undefined) {
    let selectedAr : Array<String | undefined | null> = []
    let len = select?.length as number
    for (let i = 0; i < len; i++){
        if (select?.item(i)?.selected){
            if (select?.item(i)?.value == "null"){
                selectedAr.push(null)
            } else if(select?.item(i)?.value != "Select All"){
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
    let submitEventTarget = e.target as unknown as submitEventTarget
    let formData = {
        "Difficulty" : valuesSelected(submitEventTarget.Difficulty.options) as Array<String>,
        "Status" : valuesSelected(submitEventTarget.Status.options) as Array<String | null>,
        "Premium" : submitEventTarget.Premium.checked as boolean,
        "numberOfLeetcode": submitEventTarget.numberOfLeetcode.value as bigint,
        "Topics" : valuesSelected(submitEventTarget.Topics.options) as Array<String>
    } 
    formData = setEmptyFiltersToDefault(formData)
    sendMessage(formData).catch(err=>console.error(err)).then((res)=>console.log(res));
}

async function sendMessage(formData : formQuestions){
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true})
    const response_contentS = await chrome.tabs.sendMessage(tab.id ? tab.id : chrome.tabs.TAB_ID_NONE, {formData});
    const response_serviceW = await chrome.runtime.sendMessage({formData});
}

function selectAll (e: Event){
    let TargetElement = e.target as HTMLFormElement
    for (let i = 1; i < TargetElement.length; i++){
        TargetElement.options.item(i).selected = true 
    }
    M.FormSelect.init(TargetElement)
}

function unselectAll (e: Event){
    let TargetElement = e.target as HTMLFormElement
    for (let i = 1; i < TargetElement.length; i++){
        TargetElement.options.item(i).selected = false 
    }
    M.FormSelect.init(TargetElement)
}

function chekAllSlected(TargetElement: HTMLFormElement){
    let all = true
    for (let i = 1; i < TargetElement.length; i++){
        if(TargetElement.options.item(i).selected == false){
            all = false
            break
        }
    }
    if (all == true && TargetElement.options.item(0).selected != true){
        TargetElement.options.item(0).selected = true
    } else if (TargetElement.options.item(0).selected == true){
        TargetElement.options.item(0).selected = false
    }

}

function changeHandler(e: Event){
    let changeEventTarget = e.target as HTMLFormElement
    if(lastSelectAll != changeEventTarget.options.item(0).selected && changeEventTarget.options.item(0).selected == true){
        selectAll(e)
    } else if(lastSelectAll != changeEventTarget.options.item(0).selected && changeEventTarget.options.item(0).selected == false){
        unselectAll(e)
    } else if(lastSelectAll == changeEventTarget.options.item(0).selected){
        chekAllSlected(changeEventTarget)
    }
    lastSelectAll = changeEventTarget.options.item(0).selected
    console.log(changeEventTarget.selectedOptions)
}

let lastSelectAll = false

createTopicsFilters()
document.getElementById("myForm")?.addEventListener("submit", (e)=>submitHandler(e))
document.getElementById("Topics")?.addEventListener("change", (e)=>changeHandler(e))

//TODO: show form preferences on popup.html