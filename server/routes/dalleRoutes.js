import express from "express";
import * as dotenv from 'dotenv';
import {OpenAIApi,Configuration } from 'openai';
// const axios = require("axios").default;
import axios from 'axios';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router=express.Router();
const configuration=new Configuration({
    apiKey:process.env.OPENAI_KEY
})
const openai=new OpenAIApi(configuration);

router.route('/').get((req,res)=>{
    res.send('Hello from Api');
})
router.route('/').post(async(req,res)=>{
    try {
        const{ prompt }=req.body;
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/image/generation",
            headers: {
              authorization: `Bearer ${process.env.API_KEY}`,
            },
            data: {
              show_original_response: false,
              fallback_providers: "",
              providers: "stabilityai",
              text: `${prompt}`,
              resolution: "512x512",
            },
          };
          
          axios
          .request(options)
          .then((response) => {
            res.status(200).json({
                photo:response.data.stabilityai.items[0].image});
          })
          .catch((error) => {
            console.error(error);
            res.status(400).send(error);
          });
    } catch (error) {
        console.log(error);
        res.status(500).send("ERROR");
    }
})
export default router;
