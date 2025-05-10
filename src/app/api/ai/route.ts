import Togeter, { Together } from "together-ai";
import { NextRequest } from "next/server";
const together = new Together({
    apiKey : process.env.TOGETHER_API_KEY,
    baseURL : "https://api.together.xyz/v1",
    // model : "gpt-4",
})

export async function POST(req: NextRequest){
    const {prompt} = await req.json()
    const content = "Hello, How are you "
    const res = await together.chat.completions.create({
        messages : [{role : "user", content : prompt}],
        model : "meta-llama/Llama-3.3-70B-Instruct-Turbo"
    });
    // console.log("This is the response from together : ", res);
    return new Response(JSON.stringify(res), {status : 200})
}