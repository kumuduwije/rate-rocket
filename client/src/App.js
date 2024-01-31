import { useEffect, useState } from 'react';
import './App.css';
import MainPage from './components/MainPage';
import GitHubIcon from '@mui/icons-material/GitHub';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Checking weather, The API is working before render the MainPage UI
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://openexchangerates.org/api/currencies.json?app_id=e0438901e95a43baa1a95679b29451ee'
        );

        // Assuming the response data is an object with currency codes as keys
        const currencyList = Object.keys(response.data);

        // If the request is successful, set loading to false after a 3-second delay
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        // If there's an error, set the error state
        if (error.response && error.response.status === 500) {
          setError('Error Occurred from the API Provider. Please try again later.');
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  

  return (
    <>
          {/* Render MainPage if there is no errors like status ===5000 */}
         {/* {!error ? (<MainPage/>): (<div className=' text-red-500 flex justify-center'>{error}</div>)}   */}


         <h1 className=" lg:mx-32 p-5 text-center text-5xl max-[415px]:text-3xl max-[280px]:text-[25px]  font-bold text-green-500">Rate Rocket</h1>


         {/* mb-[100px] md:mb-[200px] */}
         <div className=' mx-auto ' >
            {loading && <p className=' text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 text-lg'><CircularProgress color="success" style={{ animationDuration: '1s' }}/></p>}
            {(!loading && !error && isOnline )  ?<MainPage /> :"" }
            {!loading && error && <div className='text-red-500'>{error}</div>}
            {!isOnline ? <div className='text-red-500 text-lg text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>{"Please connect to the internet "}</div>: "" }

      
      
  
        </div>

            {/* footer */}
            <footer className={` md:absolute left-0 right-0 p-5 mt-20 bottom-0 max-[375px]:relative   block md:flex items-center justify-between ${loading || !isOnline ? " max-[375px]:fixed absolute ":""}`}>
              
             

            <div className="  z[-1]  sm:text-xs md:text-sm lg:text-md text-xs">
              <p className="text-gray-600 text-center">
                Proudly Made In 🇱🇰 by Kumudu Wijewardena
                <a href="https://github.com/kumuduwije" rel="noopener noreferrer" target="_blank">
                  <GitHubIcon className="flex mb-[3px] ml-[5px] hover:cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-200" fontSize="small" />
                </a>
              </p>
            </div>

            {/* Online logo */}
            <div className='flex justify-center items-center text-gray-400'>
                <div className={isOnline ? 'bg-green-500 rounded h-2 w-2 mr-1' : 'bg-red-500 rounded h-2 w-2 mr-1'}></div>
                <div>{isOnline ? 'Online' : 'Offline'}</div>
              </div>
            </footer>
    </>
  );
}

export default App;
