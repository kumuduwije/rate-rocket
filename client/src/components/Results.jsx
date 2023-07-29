import React, {useEffect, useState} from 'react';

export default function Results({sourceSearchResult, input, setInput }) {
    const [isClicked, setIsClicked] = useState(false);

    let searchResult = sourceSearchResult


    useEffect(() => {
        setIsClicked(false); // Reset isClicked to false whenever searchResult changes
    }, [searchResult]);

    const handleValue = (index) => {
        //console.log(searchResult[index][1]);
        setInput(searchResult[index][1]);
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

