import React, {useEffect, useState} from 'react';

export default function Results({sourceSearchResult, sourceInput,setSourceInput, targetInput, targetSearchResult, setTargetInput, target,setSourceCurrency,setTargetCurrency}) {
    const [isClicked, setIsClicked] = useState(false);

    let input;
    let setInput;
    let searchResult;
    let setCurrency;

    if(!target){
         input =sourceInput;
         setInput = setSourceInput
         searchResult = sourceSearchResult
        setCurrency = setSourceCurrency
    }else{
        input =targetInput;
        setInput = setTargetInput
        searchResult = targetSearchResult
        setCurrency = setTargetCurrency
    }


    useEffect(() => {
        setIsClicked(false); // Reset isClicked to false whenever searchResult changes
    }, [searchResult]);

    const handleValue = (index) => {
        //console.log(searchResult[index][1]);
        setInput(searchResult[index][1]);
        setCurrency(searchResult[index][0])
        setIsClicked(!isClicked); // Toggle the state to indicate the click event occurred
    };



    return (
        <>
            {searchResult && searchResult.length > 0 ? (
                <div className={`w-100 opacity-60 flex flex-col rounded-md mt-1 bg-blue-950 p-3 max-h-60 overflow-y-scroll ${isClicked ? 'hidden' : ''}`}>
                    {searchResult.map((res, index) => (
                        <div onClick={() => handleValue(index)} key={index} className={`p-1 rounded-md my-[2px] hover:bg-[#374151] hover:cursor-pointer`}>
                            {res[1]}
                        </div>
                    ))}
                </div>
            ) : input !== "" ? (
                <div className="w-100 opacity-60 flex flex-col rounded-md mt-1 bg-blue-950 p-2 text-center">
                    No match found.
                </div>
            ) : null}
        </>
    );
}

