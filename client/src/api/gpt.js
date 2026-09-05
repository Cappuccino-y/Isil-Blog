import axios from 'axios'

import OpenAI from 'openai';


const getTokenFromTxt = async () => {
    const response = await fetch(`token.txt`);
    const token = await response.text();
    return token.trim();  // 确保去掉文本中的任何前后空格
}

const token = await getTokenFromTxt();
const openai = new OpenAI({
    apiKey: token, // This is the default and can be omitted
    baseURL: "https://api.chatanywhere.tech/v1",
    dangerouslyAllowBrowser: true
});

const getReply = async data => {
    const chatCompletion = await openai.chat.completions.create(data);
    return chatCompletion.choices[0].message.content.trim();
}

export default {getReply}