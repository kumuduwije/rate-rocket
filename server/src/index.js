const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Get all currencies

app.get("/getAllCurrencies", async (req,res)=>{
      const namesUrl = "https://openexchangerates.org/api/currencies.json?app_id=e0438901e95a43baa1a95679b29451ee"  

      try{
        const namesResponse = await axios.get(namesUrl);
        const nameData = namesResponse.data;

        return res.json(nameData);

      }catch(err){
        console.error(err);
      }
})

//calculate target amount
app.get("/convertCurrencies",async (req,res)=>{
    const data = {date,
        sourceCurrency,
        targetCurrency,
        amountInSourceCurrency} = req.query


    try{
        const historyUrl = `https://openexchangerates.org/api/historical/${date}.json?app_id=e0438901e95a43baa1a95679b29451ee`;
        const urlResponse = await axios.get(historyUrl);
        const rates = urlResponse.data.rates



        //Calculate rates.
        const sourceRate = rates[sourceCurrency]
        const targetRate = rates[targetCurrency]



        //Formula 
        const targetAmount = (targetRate/sourceRate) * amountInSourceCurrency


        return res.json(targetAmount)

    }catch(err){
        console.error(err)
    }
})

//LIsten a port
app.listen(5000, ()=>{
    console.log("Server started on port 5000");
})

