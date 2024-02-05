import React, { useEffect,useState } from "react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { Stack, Text, Image, } from "@chakra-ui/react";
import axios from "axios";
import { useCurrencyContext } from '../Context/CurrencyContext';
// import AutoCompleteTester from "./AutoCompleteTester";




const ChakraAutoComplete = () => {

    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const { selectedValue, setGlobalSelectedValue } = useCurrencyContext();

    useEffect(()=>{
        const fetchCurrencies = async ()=>{
            try{
                const response =await axios.get('https://rate-rocket-api.vercel.app/getAllCurrencies');

     
                // Extract currency data from the response
                    const currencyData = Object.entries(response.data).map(([code, name]) => ({
                        code,
                        name,
                      //  img: `https://flagsapi.com/${code.slice(0, -1).toUpperCase()}/flat/32.png`,
                        imgURL:`https://flagcdn.com/w40/${code.slice(0,-1).toLowerCase()}.webp`
                    }));

                    setCurrencies(currencyData);
                    //console.log(currencyData)

                  
                    
            }catch(error){
                    console.log(error);

            }finally{
                setLoading(false);
            }
        }
     

        fetchCurrencies();


    },[])

    const handleAutoCompleteChange = (value) => {
        setSearchTerm(value);
        setGlobalSelectedValue(value);
        console.log(searchTerm)
      };




  return (

      <Stack direction="column">
        {/* <Text>Basic </Text> */}
        <AutoComplete rollNavigation onChange={handleAutoCompleteChange} variant="filled" >
          <AutoCompleteInput variant="filled" placeholder="Search basic..." autoFocus  required/>
          <AutoCompleteList>
            {currencies.map((currency) => (
              <AutoCompleteItem
                key={currency.code}
                value={`${currency.name} (${currency.code})`}
                label={`${currency.name} (${currency.code})`}
              
                textTransform="capitalize"
              >
                {/* <Avatar size="sm"  name={currency.name} src={"https://flagsapi.com/IN/flat/64.png"} /> */}
                <Image
                src={currency.imgURL}
                fallbackSrc='https://via.placeholder.com/32'
                onError={(e) => {
                    e.preventDefault();
                    e.target.src = 'https://via.placeholder.com/32'; // Use a fallback image on error
                    e.target.onerror = null;
                }}
            />

                <Text  ml="4">{currency.name} ({currency.code})</Text>
              </AutoCompleteItem>
            ))}
          </AutoCompleteList>
        </AutoComplete>
      </Stack>

  );
};

export default ChakraAutoComplete;




// const options = [
//     "apple", "appoint", "zap", "cap", "japan", "Cake", "Choco", "Mango", "Banana", "Grapes",
//     "Navy", "Green", "Teal", "Ch", "addsd", "almond", "strawberry", "orange", "khaki", "lime",
//     "citrus", "deepskyblue"
//   ];
