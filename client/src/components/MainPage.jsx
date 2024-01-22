
import React, {useState,useRef} from 'react'
import axios from "axios"
import SyncIcon from '@mui/icons-material/Sync';
import { styled } from '@mui/system';
import Results from "./Results";
//import GitHubIcon from '@mui/icons-material/GitHub';
import { IoIosClose } from "react-icons/io";


let response =""; // response global variable update in line 88

const RotateIcon = styled(SyncIcon)`
  display: ${({ isloading }) => (!isloading ? 'inline-block' : 'none')};
  animation: ${({ isloading }) => (!isloading ? 'spin 1s linear infinite' : 'none')};

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

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
  


export default function MainPage() {

  
    //States
    const [date, setDate] = useState(null);
    const [sourceCurrency, setSourceCurrency] = useState("");
    const [targetCurrency, setTargetCurrency] = useState("");
    const [amountInSourceCurrency, setAmountInSourceCurrency] = useState(0);
    const [amountInTargetCurrency, setAmountInTargetCurrency] = useState(0);
    // const [currencyNames, setCurrencyNames] = useState([])
    const [isloading, setIsloading] = useState(true)
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

    // handleSubmit
    const handleSubmit =async (e) =>{
          e.preventDefault() 
          console.log(date)
    
          setIconLoading(true)
          setIsloading(false)
          setShowResult(false)
          setButtonText("Converting...")
          
            
        try{

            response = await axios.get("http://localhost:4000/convertCurrencies",
            {params:
                {
                date,
                sourceCurrency,
                targetCurrency,
                amountInSourceCurrency
                }
            })



            // const response = await axios.get("https://rate-rocket.onrender.com/convertCurrencies",
            //     {params:
            //             {
            //                 date,
            //                 sourceCurrency,
            //                 targetCurrency,
            //                 amountInSourceCurrency
            //             }
            //     })

            console.log("Gathered data:"+date,sourceCurrency,targetCurrency,amountInSourceCurrency)
            console.log("convertCurrencies response : "+response.data)
            
            if(response.data !== null || response){

                setIsloading(false)
                setIconLoading(false)
                setAmountInTargetCurrency(response.data.toFixed(2));
                setDisplayTargetAmount(response.data.toFixed(2));
                setShowResult(true)
                setButtonText("Convert Currency")
            }else{
                console.log("You entered data is wrong")
                setButtonText("Convert Currency")
                setIconLoading(false)
                setIsloading(false)
                
            }
        
              
     
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
    //Get currency names from api
    // useEffect(() => {
    //     const getCurrencyNames = async() =>{
    //         try{
    //             const response = await axios.get("http://localhost:5000/getAllCurrencies");
    //             setCurrencyNames(response.data)
    //            console.log(response.data)
    //         }catch(err){
    //             console.error(err);
    //         }
    //     }
    //     getCurrencyNames().then(r => {});
    // }, [])

    const fetchData = (value, field) => {
        setIsLoadingResults(true); 
         fetch("http://localhost:4000/getAllCurrencies")
        //fetch("https://rate-rocket.onrender.com/getAllCurrencies")
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
                    
                    console.log("source result 196: "+ result);
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




    const handleChange = (value, src) =>{
        if(src === "source"){
            //console.log("source:"+ value)
            setSourceInput(value)
            fetchData(value,"src")
      
        }
        else if(src === "target"){
            //console.log("target:"+ value)
            setTargetInput(value)
            fetchData(value,"target")
        }


    }

    const handleClear = (field) => {
        if (field === 'source') {
          setSourceInput('');
          
          if (sourceInputRef.current) {
      
            sourceInputRef.current.focus();
          }
        } else if (field === 'target') {
          setTargetInput('');
          if (targetInputRef.current) {
            targetInputRef.current.focus();
          }
        }
      };

    const handleButtonClick = () => {
       // setDisplaySrcAmount(amountInSourceCurrency)
       // setDisplayFromCurrency(currencyNames[sourceCurrency])
       // setDisplayTargetAmount(amountInTargetCurrency.toFixed(2))
       // setDisplayToCurrency(currencyNames[targetCurrency])

        // setDisplaySrcAmount(amountInSourceCurrency)
        // setDisplayFromCurrency(sourceCurrency)
        // setDisplayTargetAmount(amountInTargetCurrency)
        // setDisplayToCurrency(targetCurrency)

        setDisplaySrcAmount(amountInSourceCurrency)
        setDisplayFromCurrency(sourceInput)
        setDisplayTargetAmount(amountInTargetCurrency)
        setDisplayToCurrency(targetInput)


      };

    return (
        
        <div className=" mt-6 relative ">
        
            <h1 className=" lg:mx-32 p-5 text-center text-5xl max-[415px]:text-3xl max-[280px]:text-[25px]  font-bold text-green-500">Rate Rocket</h1>
            {/* <p className="lg:mx-32 opacity-30 py-6">Welcome to "Rate Rocket" This application allows you to easily convert currencies based on the latest exchange rates. Rate Rocket is a powerful and user-friendly currency converter app that simplifies the process of converting currencies for travelers, business professionals, and anyone dealing with international transactions. With its sleek design and real-time exchange rate data, Rate Rocket ensures that you stay on top of currency conversions with ease and accuracy.</p> */}

            {/* Form Area */}
            <div className="mt-5 to  flex items-center justify-center flex-col ">
                <section className='w-full lg:w-1/2'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor={date}
                                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Date: </label>

                            <input onChange={date? (e)=>setDate(e.target.value):setDate(getTodayDate())} type="date" id={date} name={date} 
                            defaultValue={getTodayDate()}
                             style={{ appearance: "none"  }} // Add the appearance property here
                            className="bg-gray-50 border col border-gray-300  text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  text-black dark:text-green-400 font-medium dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Date" required />
                        </div>
                        {/*Source Currency*/}
                        <div className="mb-4 relative">
                            <label htmlFor={sourceCurrency} className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">
                                Source Currency:
                            </label>
                            <div className="relative">
                                <input
                                ref={sourceInputRef}
                                    required
                                    id={sourceCurrency}
                                    name={sourceCurrency}
                                    value={sourceInput}
                                    onChange={(e) => handleChange(e.target.value, "source")}
                                    type="text"
                                    placeholder="Type source currency name: "
                                    className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 e dark:focus:ring-green-500 dark:focus:border-green-500 pr-10" // Add pr-10 for padding-right to accommodate the close icon
                                />
                                {sourceInput && ( // Render the close icon only when sourceInput is not empty
                                    <IoIosClose
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[25px] text-black dark:text-white hover:cursor-pointer"
                                        onClick={() => handleClear("source")} // Clear the sourceInput when the close icon is clicked
                                    />
                                )}
                            </div>
                        </div>


                        <Results sourceInput = {sourceInput} sourceSearchResult={sourceSearchResult}  setSourceInput ={setSourceInput} target={false} setSourceCurrency={setSourceCurrency} isLoadingResults={isLoadingResults}/>

                            {/*target Currency*/}

                        <div className="mb-4 relative">
                            <label htmlFor={targetCurrency} className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">
                                Target Currency:
                            </label>
                            <div className="relative">
                                <input
                                    ref={targetInputRef}
                                    required
                                    id={targetCurrency}
                                    name={targetCurrency}
                                    value={targetInput}
                                    onChange={(e) => handleChange(e.target.value, "target")}
                                    type="text"
                                    placeholder="Type target currency name: "
                                    className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 e dark:focus:ring-green-500 dark:focus:border-green-500 pr-10" // Add pr-10 for padding-right to accommodate the close icon
                                />
                                {targetInput && ( // Render the close icon only when targetInput is not empty
                                    <IoIosClose
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[25px] text-black dark:text-white hover:cursor-pointer"
                                        onClick={() => handleClear("target")} // Clear the targetInput when the close icon is clicked
                                    />
                                )}
                            </div>
                        </div>

                        <Results targetInput = {targetInput} targetSearchResult={targetSearchResult} setTargetSearchResult={setTargetSearchResult} setTargetInput ={setTargetInput} target={true} setTargetCurrency={setTargetCurrency} isLoadingResults={isLoadingResults}/>

                        <div className="mb-4">
                            <label
                                htmlFor={amountInSourceCurrency}
                                name={amountInSourceCurrency}
                                className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Amount in Source Currency:</label>

                            <input onChange={(e)=>setAmountInSourceCurrency(e.target.value)} type="number" id={amountInSourceCurrency}
                            name={amountInSourceCurrency}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="Example: 250" required />
                        </div>

                        
                        <button onClick={handleButtonClick} className='bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 hover:cursor-pointer'>{buttonText} {iconLoading ? <RotateIcon isloading={isloading}></RotateIcon>: ""}</button>
                

                    </form>
                </section>
            </div>
            {/* Result */}
            {!isloading ? (
                <div className='text-center py-5 mt-5 text-blue-950 dark:text-white '>
                {showResult ? <p className='text-lg opacity-80'>
         
                {displaySrcAmount} {`${displaySrcAmount > 1 ? displayFromCurrency +"s" : displayFromCurrency}`}  ＝  <span className='text-green-600 font-semibold'>{displayTargetAmount}</span>  {`${displayTargetAmount > 1 ? displayToCurrency + "s" : displayToCurrency}`}
                </p>:null}
                 
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
