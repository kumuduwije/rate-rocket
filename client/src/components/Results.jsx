import React, { useEffect, useState } from 'react';
import { Oval } from 'react-loading-icons';

export default function Results({
  sourceSearchResult,
  sourceInput,
  setSourceInput,
  targetInput,
  targetSearchResult,
  setTargetInput,
  target,
  setSourceCurrency,
  setTargetCurrency,
  isLoadingResults,
}) {
  const [isClicked, setIsClicked] = useState(false);

  let input;
  let setInput;
  let searchResult;
  let setCurrency;

  if (!target) {
    input = sourceInput;
    setInput = setSourceInput;
    searchResult = sourceSearchResult;
    setCurrency = setSourceCurrency;
  } else {
    input = targetInput;
    setInput = setTargetInput;
    searchResult = targetSearchResult;
    setCurrency = setTargetCurrency;
  }

  useEffect(() => {
    setIsClicked(false);
  }, [searchResult]);

  const handleValue = (index) => {
    //console.log(searchResult[index][1]);
    setIsClicked(true);
    setInput(searchResult[index][1]);
    setCurrency(searchResult[index][0]);
    // setIsLoading(false); // No need for this, as it's handled in the parent component
  };

  console.log("inputLength"+ input.length)

  return (
    <>
      {/* {isLoadingResults && <Oval />}  */}
      
      { input !== "" && searchResult && searchResult.length > 0 &&(
        <div className={`w-100 opacity-60 flex flex-col rounded-md mt-1 bg-green-500  dark:bg-blue-950 p-3 max-h-60 overflow-y-scroll ${isClicked ? 'hidden' : ''}`}>
          {isLoadingResults ? (
            <div className=' flex justify-center items-center '><Oval/></div> // Show Oval while loading
          ) : (
            searchResult.map((res, index) => (
              <div onClick={() => handleValue(index)} key={index} className={`p-1  text-white rounded-md my-[2px] hover:bg-green-600 dark:hover:bg-[#374151] hover:cursor-pointer`}>
                {res[1]} {` (${res[0]})`}
              </div>
            ))
          )}
        </div>
        
        

        
      )}

      {isLoadingResults === false && input !== ""  && searchResult.length === 0  && (
        <div className="w-100 opacity-60 flex flex-col rounded-md mt-1 bg-blue-950 p-2 text-center">
          No match found.
        </div>
      )}

      

      
      
      
    </>
  );
}
