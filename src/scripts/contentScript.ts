import { formQuestions } from "../types/formQuestions";

import axios from "axios"

axios.defaults.withCredentials = true

const fetchQuestions = () => axios.post('https://leetcode.com/graphql/', 
{"query":"\n    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {\n  problemsetQuestionList: questionList(\n    categorySlug: $categorySlug\n    limit: $limit\n    skip: $skip\n    filters: $filters\n  ) {\n    total: totalNum\n    questions: data {\n      acRate\n      difficulty\n      freqBar\n      frontendQuestionId: questionFrontendId\n      isFavor\n      paidOnly: isPaidOnly\n      status\n      title\n      titleSlug\n      topicTags {\n        name\n        id\n        slug\n      }\n      hasSolution\n      hasVideoSolution\n    }\n  }\n}\n    ",
"variables":{"categorySlug":"all-code-essentials","skip":0,"limit":6000,"filters":{}},
"operationName":"problemsetQuestionList"}).then(res => res.data.data.problemsetQuestionList.questions) 

function filterQuestions(questions : Array<any>, formQuestion : formQuestions){ 
    let filteredQ = questions.filter((q)=>{
        return (formQuestion.Difficulty.some(d => d === q.difficulty) && 
        formQuestion.Status.some(d => d === q.status) && 
        formQuestion.Topics.some(d => q.topicTags.some((t: { name: String; }) => t.name===d))) && 
        (formQuestion.Premium ? true : q.paidOnly===false) ;
    })
    console.log(filteredQ) 
    return pickRandom(filteredQ, formQuestion.numberOfLeetcode)
}

function pickRandom (filteredQ : Array<any>, nQuestions : bigint){
    for(let i = 0; i < nQuestions; i++){
        let q = filteredQ[(Math.floor(Math.random()*filteredQ.length))]
        let url = "https://leetcode.com/problems/"+ q.titleSlug
        window.open(url, "_blank");
    }
}


let formQuestion : formQuestions

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        formQuestion = request.message.Body as formQuestions
        if (questions!=undefined){
            filterQuestions(questions, formQuestion)
        }
    }
);

let questions : Array<any>

fetchQuestions().then(output => {
    questions = output
    console.log(questions) //all the Leetcode Problems
    if (formQuestion!=undefined){
        filterQuestions(questions, formQuestion)
    }
})