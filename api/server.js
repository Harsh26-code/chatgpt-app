import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
// Now creating instance of an express
const app=express();
app.use(cors());
app.use(express.json());

app.get("/" ,async(req,res)=>{
    res.status(200).send({
        message:"This is ChatGPT Ai App",
    });
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
app.post("/",async(req,res)=>{
    try{
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            //Text of compose bar should be added in prompt
            prompt:req.body.input,
            // Query ka kitna accurate answer dega wo depend karta ha temperature pr,jitna temperature kam hoga wo utna accurate answer dega
            temperature: 0,
            // max_tokens is length of bot reply
            max_tokens: 4000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
          });

          console.log("PASSED: ",req.body.input)
           res.status(200).send({
            bot: response.data.choices[0].text
         })

    }
    catch(err)
    {
        console.log("FAILED: ",req.body.input)
        console.error(err)
        res.status(500).send(err)
    }
})
app.listen(4000,()=>console.log("Server is running on port 4000"));

