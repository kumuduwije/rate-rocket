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



         <div >
            {loading && <p className=' text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-500 text-lg'><CircularProgress color="success" style={{ animationDuration: '1s' }}/></p>}
            {!loading && !error && <MainPage />}
            {!loading && error && <div className='text-red-500'>{error}</div>}

      
      
      
            <div className='absolute right-0 bottom-0 p-5'>
              <div className='flex justify-center items-center text-gray-400'>
                <div className={isOnline ? 'bg-green-500 rounded h-2 w-2 mr-1' : 'bg-red-500 rounded h-2 w-2 mr-1'}></div>
                <div>{isOnline ? 'Online' : 'Offline'}</div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 p-5 z[-1] md:mt-40 sm:text-xs md:text-sm lg:text-md text-xs">
              <p className="text-gray-600 text-center">
                Proudly Made In 🇱🇰 by Kumudu Wijewardene{' '}
                <a href="https://github.com/kumuduwije" rel="noopener noreferrer" target="_blank">
                  <GitHubIcon className="flex mb-[3px] ml-[2px] hover:cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-200" fontSize="small" />
                </a>
              </p>
            </div>
        </div>
    </>
  );
}

export default App;
