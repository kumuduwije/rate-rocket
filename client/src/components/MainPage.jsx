
import React, {useState,useRef,useEffect} from 'react'
import axios from "axios"
//import { styled } from '@mui/system';
import Results from "./Results";
//import GitHubIcon from '@mui/icons-material/GitHub';
//import { IoIosClose } from "react-icons/io";
import { CloseIcon } from '@chakra-ui/icons'
import { Button, Input,Box,Stack, Image, Text} from "@chakra-ui/react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";

//import { CurrencyContext } from '../Context/CurrencyContext';



let response =""; // response global variable update in line 88

// const RotateIcon = styled(SyncIcon)`
//   display: ${({ isloading }) => (!isloading ? 'inline-block' : 'none')};
//   animation: ${({ isloading }) => (!isloading ? 'spin 1s linear infinite' : 'none')};

//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   }
// `;

const getTodayDate =()=> {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Add leading zero if month or day is a single digit
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
}

function formatNumberWithComma(input, includeDecimals = false) {
    const number = parseFloat(input);
  
    if (isNaN(number)) {
      return 'Invalid input';
    }
  
    const decimalOptions = includeDecimals
      ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      : {};
  
    const formattedNumber = number.toLocaleString('en-US', {
      style: 'decimal',
      ...decimalOptions,
    });
  
    return formattedNumber;
  }


export default function MainPage() {

    

  
    //States
    const [date, setDate] = useState(null);
    const [sourceCurrency, setSourceCurrency] = useState("");
    const [targetCurrency, setTargetCurrency] = useState("");
    const [amountInSourceCurrency, setAmountInSourceCurrency] = useState('');
    const [amountInTargetCurrency, setAmountInTargetCurrency] = useState(0);
    //State of currency names
    const [completeSrcCurrencyName, setCompleteSrcCurrencyName] = useState('');
    const [completeTargetCurrencyName, setCompleteTargetCurrencyName] = useState('');

    // const [currencyNames, setCurrencyNames] = useState([])
    const [isloading, setIsloading] = useState(false)
    const [buttonText, setButtonText] = useState("Convert Currency")
    const [iconLoading, setIconLoading] = useState(true)
    const [showResult, setShowResult] = useState(false)
    // Update UI States
    const [displaySrcAmount, setDisplaySrcAmount] = useState('');
    const [displayFromCurrency, setDisplayFromCurrency] = useState('');
    const [displayTargetAmount, setDisplayTargetAmount] = useState('');
    const [displayToCurrency, setDisplayToCurrency] = useState('');

    const [sourceInput, setSourceInput] = useState("");
    const [sourceSearchResult, setSourceSearchResult] = useState([])

    const [targetInput, setTargetInput] = useState("");
    const [targetSearchResult, setTargetSearchResult] = useState([])

    const [isLoadingResults, setIsLoadingResults] = useState(false); //For search suggestions
    const [errorMessage, setErrorMessage] = useState(null);

    

    // Create refs for source and target inputs
  const sourceInputRef = useRef(null);
  const targetInputRef = useRef(null);
  const sourceAmountRef = useRef(null);

  useEffect(() => {
    // Log the value of amountInTargetCurrency when it changes
    console.log("amountInTargetCurrency in useEffect: " + amountInTargetCurrency);
  }, [amountInTargetCurrency]);



    // handleSubmit
    const handleSubmit =async (e) =>{
          e.preventDefault() 
          //console.log(date)
    
          setIconLoading(true)
          setIsloading(true)
          setShowResult(false)
          setButtonText("Converting...")
          
            
        try{

            // response = await axios.get("http://localhost:4000/convertCurrencies",
            // {params:
            //     {
            //     date,
            //     sourceCurrency,
            //     targetCurrency,
            //     amountInSourceCurrency
            //     }
            // })



            //  response = await axios.get("https://rate-rocket.onrender.com/convertCurrencies"
            axios.get("https://rate-rocket-api.vercel.app/convertCurrencies",
                {params:
                        {
                            date,
                            sourceCurrency,
                            targetCurrency,
                            amountInSourceCurrency
                        }
                })
                
                .then((response)=>{
                    
                    //** IMPORTANT LOGS */
                    // console.log("Gathered data:"+date,sourceCurrency,targetCurrency,amountInSourceCurrency)
                console.log("convertCurrencies response : "+response.data)
                if(response.data !== null || response){

                    //setDisplayFromCurrency(sourceCurrency)
                    setIsloading(false)
                    setIconLoading(false)
    
                    
                    setShowResult(true)
                    setButtonText("Convert Currency")
                    setAmountInTargetCurrency(response.data.toFixed(2));
                    
                    console.log("amountInTargetCurrency"+amountInTargetCurrency)
                    console.log("Data recived")
                    //setDisplayTargetAmount(response.data);

                    console.table({
                        date:date,
                        amountInSourceCurrency:amountInSourceCurrency,
                        amountInTargetCurrency:amountInTargetCurrency,
                        displaySrcAmount:displaySrcAmount,
                        displayTargetAmount:displayTargetAmount,
                        displayFromCurrency:displayFromCurrency,
                        displayToCurrency:displayToCurrency,
                        targetCurrency:targetCurrency,
                        sourceCurrency:sourceCurrency
                    })

                    // Update the result display values directly without using 'showResult' state
                    setDisplaySrcAmount(amountInSourceCurrency);
                    setDisplayTargetAmount(response.data.toFixed(2));
                    //setDisplayToCurrency(targetCurrency);
    
                }else{
                    console.log("You entered data is wrong")
                    setButtonText("Convert Currency")
                    setIconLoading(false)
                    setIsloading(false)
                    
                }

             }).catch((err) => {
                console.error(err);
          
                // Handle error response from the server
                // The request encountered an error
                console.log("Request encountered an error");
          
                // ... other error handling code ...
              });

            
            
            
        
              
     
        }catch(err){

            console.error(err)

            // Handle error response from the server
            if (err.response) {
                // The request was made and the server responded with a status code
                if (err.response.status === 500) {
                  console.log("Server responded with a 500 error:", err.response.data);
                  setErrorMessage(err.response.data.description);
                } else {
                  console.log("Server responded with an error:", err.response.data);
                  // Handle other status codes if needed
                }
              } else if (err.request) {
                // The request was made, but no response was received
                console.log("No response received from the server.");
              } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error during request setup:", err.message);
              }
            }

        
        
 
    }

    const fetchData = (value, field) => {
        setIsLoadingResults(true); 
         //fetch("http://localhost:4000/getAllCurrencies")
        //fetch("https://rate-rocket.onrender.com/getAllCurrencies")
        fetch("https://rate-rocket-api.vercel.app/getAllCurrencies")
            .then((response) => response.json())
            .then((json) => {
                // Convert the object to an array of key-value pairs
                const currenciesArray = Object.entries(json);

                // Filter the array based on the currency name and code (value)
                const result = currenciesArray.filter(([currencyCode, currencyName]) => {
                    //console.log(`currencyCodes ${currencyCode}`)
                 
                    return (value && currencyName.toLowerCase().includes(value.toLowerCase())  || value && currencyCode.toLowerCase().includes(value.toLowerCase()));
                });

      

                //console.log(result)

                if(field === "src"){
                    setSourceSearchResult(result)
                    //setDisplayFromCurrency(result);
                    
                    //console.log("source result 196: "+ result);
                }
                else if (field === "target"){
                    setTargetSearchResult(result)
                    //setDisplayToCurrency(result);
              
                }


            })
            .catch((error) => {
                console.error("Error fetching data:", error);

            }).finally(() => {
                setIsLoadingResults(false); // Set loading to false when data fetching is complete
              });
    };

    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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



    //to be removed
    // const handleChange = (value, src) =>{
    //     if(src === "source"){
    //         //console.log("source:"+ value)
    //         setSourceInput(value)
    //         fetchData(value,"src")
      
    //     }
    //     else if(src === "target"){
    //         //console.log("target:"+ value)
    //         setTargetInput(value)
    //         fetchData(value,"target")
    //     }
    // }

    const handleClear = (field) => {
        if (field === 'source') {
          setSourceInput('');
          setSourceCurrency('')
      
          
          console.log( sourceInputRef.current.value)
          sourceInputRef.current.value = null

          
          if (sourceInputRef.current) {
      
            sourceInputRef.current.focus();
          }
        } else if (field === 'target') {
          setTargetInput('');
          if (targetInputRef.current) {
            targetInputRef.current.focus();
          }
        }else if (field === 'sourceAmount') {

          setAmountInSourceCurrency('');
          if (sourceAmountRef.current) {
            sourceAmountRef.current.focus();
          }
        }
      };




    const handleButtonClick = () => {

        const currencyNameRegex = /^(.*?)\s?\((.*?)\)$/;

        setDisplaySrcAmount(amountInSourceCurrency)
        //setDisplayFromCurrency(sourceInput)
        setDisplayTargetAmount(amountInTargetCurrency)
        //setDisplayToCurrency(targetInput)


         //Setting source currency name display
         const seperatedSrcCurrencyName = completeSrcCurrencyName.match(currencyNameRegex);
         const displaySrcCurrencyName = seperatedSrcCurrencyName ? seperatedSrcCurrencyName[1].trim() : null;
         setDisplayFromCurrency(displaySrcCurrencyName)


         //Setting target currency name display
         const seperatedTargetCurrencyName = completeTargetCurrencyName.match(currencyNameRegex);
         const displayTargetCurrencyName = seperatedTargetCurrencyName ? seperatedTargetCurrencyName[1].trim() : null;
         setDisplayToCurrency(displayTargetCurrencyName)

      };

      const handleAutoCompleteChange = (value, inputType) => {
        //setSearchTerm(value);

   
        const currencyCodeRegex = /\(([^)]+)\)/;

        if(inputType ==="src"){

        
            const match = value.match(currencyCodeRegex);
            const currencyCode = match ? match[1] : null;
            setSourceCurrency(currencyCode)

            setCompleteSrcCurrencyName(value) // store full src name 

           
           
        }if(inputType ==="target"){
           
            const match = value.match(currencyCodeRegex);
            const currencyCode = match ? match[1] : null;
            setTargetCurrency(currencyCode)

            setCompleteTargetCurrencyName(value) // store full target name 
        }
        
      };

    return (
        
        
        <div className=" mt-6  relative ">
        

            


        
            {/* <h1 className=" lg:mx-32 p-5 text-center text-5xl max-[415px]:text-3xl max-[280px]:text-[25px]  font-bold text-green-500">Rate Rocket</h1> */}
            {/* <p className="lg:mx-32 opacity-30 py-6">Welcome to "Rate Rocket" This application allows you to easily convert currencies based on the latest exchange rates. Rate Rocket is a powerful and user-friendly currency converter app that simplifies the process of converting currencies for travelers, business professionals, and anyone dealing with international transactions. With its sleek design and real-time exchange rate data, Rate Rocket ensures that you stay on top of currency conversions with ease and accuracy.</p> */}

            {/* Form Area */}
            <div className="mt-5  flex items-center justify-center flex-col ">
                <section className='w-full lg:w-1/2 '>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor={date} className="block mb-2 text-sm font-medium  ">Date: </label>

                                    <Input  onChange={date? (e)=>setDate(e.target.value):setDate(getTodayDate())} 
               
                                                id={date}
                                                name={date}
                                                placeholder="Select Date and Time"
                                                size="lg"
                                                type="date"
                                                max={getTodayDate()}
                                                min={"1999-01-04"}
                                                defaultValue={getTodayDate()}
                                                variant="filled"
                                                focusBorderColor="green.300"
                                                borderWidth={0.1}
                                                required
                                                    
                                                />

                            {/* <input onChange={date? (e)=>setDate(e.target.value):setDate(getTodayDate())} type="date" id={date} name={date} min={"1999-01-04"} max={getTodayDate()}
                            defaultValue={getTodayDate()}
                             style={{ appearance: "none"  }} // Add the appearance property here
                            className="bg-gray-50 border col border-gray-300  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  text-black dark:text-green-400 font-medium dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Date" required /> */}
                        </div>
                        {/*Source Currency*/}
                        <div className="mb-4 relative">
                            <label htmlFor={sourceCurrency} className="block mb-2 text-sm font-medium dark:gray-500">
                                Source Currency:
                            </label>
                            <div className="relative">

                                {/* <Input
                               
                                    ref={sourceInputRef}
                                    id={sourceCurrency}
                                    name={sourceCurrency}
                                    value={sourceInput}
                                    required
                                    onChange={(e) => handleChange(e.target.value, "source")}
                                    type="text"
                    
                                    variant="filled"
                                    colorScheme={"teal"}
                                    placeholder="Country Name or Code"
                                    size="lg"
                                    fontSize={14}
                                    focusBorderColor="green.300"
                                    borderWidth={0.1}
                                    _placeholder={{ opacity: 0.6, color: "gray.600", fontSize:15 }}
                                /> */}


                                <Stack direction="column">
                                    {/* <Text>Basic </Text> */}
                                    <AutoComplete rollNavigation  onChange={(e) => {handleAutoCompleteChange(e,"src")}} variant="filled" >
                                    <AutoCompleteInput   onChange={(e) => {setSourceInput(e.target.value)}} ref={sourceInputRef} variant="filled" size="lg" placeholder="Country Name or Code" fontSize={14}
                                    focusBorderColor="green.300"
                                    borderWidth={0.1}
                                    _placeholder={{ opacity: 0.6, color: "gray.600", fontSize:15 }} autoFocus  required/>
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

                                {sourceCurrency != ""  && ( // Render the close icon only when sourceInput is not empty
                                    <CloseIcon
                                    color={"teal"}
                                    w={2.5}
                                    h={2.5}
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[25px]  hover:cursor-pointer"
                                        onClick={() => handleClear("source")} // Clear the sourceInput when the close icon is clicked
                                    />
                                )}

                             
                               

                            </div>
                        </div>


                        {/* <Results sourceInput = {sourceInput} sourceSearchResult={sourceSearchResult}  setSourceInput ={setSourceInput} target={false} setSourceCurrency={setSourceCurrency} isLoadingResults={isLoadingResults}/> */}

                            {/*target Currency*/}

                        <div className="mb-4 relative">
                            <label htmlFor={targetCurrency} className="block mb-2 text-sm font-medium  dark:gray-500">
                                Target Currency:
                            </label>
                            <div className="relative">
                            

                                {/* <Input
                                   required
                                    ref={targetInputRef}
                                    id={targetCurrency}
                                    name={targetCurrency}
                                    value={targetInput}
                                    onChange={(e) => handleChange(e.target.value, "target")}
                                    type="text"
                                    variant="filled"
                                    colorScheme={"teal"}
                                    placeholder="Country Name or Code"
                                    size="lg"
                                    fontSize={14}
                                    focusBorderColor="green.300"
                                    borderWidth={0.1}
                                    _placeholder={{ opacity: 0.6, color: "gray.600", fontSize:15 }}
                                /> */}

                                <Stack direction="column">
                                    {/* <Text>Basic </Text> */}
                                    <AutoComplete rollNavigation onChange={(e) => {handleAutoCompleteChange(e,"target")}} variant="filled" >
                                    <AutoCompleteInput variant="filled" size="lg" placeholder="Country Name or Code" fontSize={14}
                                    focusBorderColor="green.300"
                                    borderWidth={0.1}
                                    _placeholder={{ opacity: 0.6, color: "gray.600", fontSize:15 }}  required/>
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

                                {targetInput && ( // Render the close icon only when targetInput is not empty
                                    <CloseIcon
                                     color={"teal"}
                                    w={2.5}
                                    h={2.5}
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[25px] text-black dark:text-white hover:cursor-pointer"
                                        onClick={() => handleClear("target")} // Clear the targetInput when the close icon is clicked
                                    />
                                )}
                            </div>
                        </div>

                        {/* <Results targetInput = {targetInput} targetSearchResult={targetSearchResult} setTargetSearchResult={setTargetSearchResult} setTargetInput ={setTargetInput} target={true} setTargetCurrency={setTargetCurrency} isLoadingResults={isLoadingResults}/> */}

                        <div className=" relative mb-4">
                            <label
                                htmlFor={amountInSourceCurrency}
                                name={amountInSourceCurrency}
                                className="block mb-2 text-sm font-medium "> Amount in Source Currency:</label>

                                <div className=' relative'>
                                <Input
                                   required
                                    ref={sourceAmountRef}
                                    id={amountInSourceCurrency}
                                    name={amountInSourceCurrency}
                                     value={amountInSourceCurrency}
                                    onChange={(e)=>setAmountInSourceCurrency(e.target.value)}
                                    type="number"
                                    min={1}
                                    focusBorderColor="green.300"
                                    borderWidth={0.1}
                                    variant="filled"
                                    colorScheme={"teal"}
                                    placeholder="Example: 250"
                                    size="lg"
                                    fontSize={14}
                                    _placeholder={{ opacity: 0.6, color: "gray.600", fontSize:15 }}
                                />

                                {amountInSourceCurrency && ( // Render the close icon only when targetInput is not empty
                                    <CloseIcon
                                    w={2.5}
                                    h={2.5}
                                    color={"teal"}
                                        className="absolute right-5 top-1/2 transform -translate-y-1/2 text-[25px] text-black dark:text-white hover:cursor-pointer"
                                        onClick={() => handleClear("sourceAmount")} // Clear the targetInput when the close icon is clicked
                                    />
                                )}
                                </div>

                            {/* <input onChange={(e)=>setAmountInSourceCurrency(e.target.value)} type="number" min={1} id={amountInSourceCurrency}
                            name={amountInSourceCurrency}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Example: 250" required /> */}
                        </div>

                        
                        {/* <button onClick={handleButtonClick} className='bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 hover:cursor-pointer'>{buttonText} {iconLoading ? <RotateIcon isloading={isloading}></RotateIcon>: ""}</button> */}
                        <Button
                            type='submit'
                            isLoading={isloading}
                            loadingText="Converting.."
                            colorScheme="whatsapp"
                            spinnerPlacement="end"
                            onClick={handleButtonClick}
                            >
                            {buttonText}
                        </Button>
                

                    </form>
                </section>
            </div>
            {/* Result */}
            {!isloading ? (
                <div className='  text-center py-5 mt-10    flex items-center justify-center'>

                { (displaySrcAmount !== "" && displayFromCurrency !== "" && displayToCurrency !== "" && displaySrcAmount > 0)  ? 
                
                <div className='block md:flex text-lg opacity-80 '>
                     <div className=' flex  mr-2'>
                     <Box className='   text-[25px] md:text-[25px]'>{formatNumberWithComma(displaySrcAmount)}</Box>
                     <div className=' ml-1'>{`${displaySrcAmount > 1 ? displayFromCurrency +"s" : displayFromCurrency}`}</div>
                     </div> 
                  ＝  
                <div className='mx-2 text-green-600 text-[25px] font-semibold'>{formatNumberWithComma(displayTargetAmount)}</div>  
                <div>{`${displayTargetAmount > 1 ? displayToCurrency + "s" : displayToCurrency}`}</div>


                </div>:null}
                 
            </div>
    
            ): null}

            {/* If the user entered invalid data for textfields */}
            {response.data === null ? (<div className=' text-center py-5 mt-5 text-red-500'>You entered invalid data, Select currencies from the dropdown. </div>) : ""}


            {/*<div className="text-center  text-gray-600 p-3 fixed bottom-0 w-[100%]"><p>Designed & Developed by Kaytrun by Kumudu</p></div>*/}


            {/* <div className=" fixed bottom-0 left-0 p-5  z-[-1]  text-center pt-4 w-full  md:mt-40 sm:text-xs md:text-sm lg:text-md text-xs">
                <p className=" text-gray-600">
                      Proudly Made In 🇱🇰  by Kumudu Wijewardene <a href="https://github.com/kumuduwije" rel="noopener noreferrer" target="_blank"><GitHubIcon className="flex mb-[3px] ml-[2px] hover:cursor-pointer text-gray-400 hover:text-gray-200" fontSize="small"/></a>
                </p>
            </div> */}

            {errorMessage && (
  <div className="text-red-500 text-center py-2">
    Error: {errorMessage}
  </div>
)}


        </div>
        
    )
}
