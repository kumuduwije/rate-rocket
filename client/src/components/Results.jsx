import React from 'react';

export default function Results({ searchResult, input }) {
    // searchResult.map((res, index) => {
    //     console.log(res[index + 1]);
    //     // console.log(res[index][index]);
    //     return null; // Added a return statement for the map function
    // });



    return (
        <>
            {searchResult && searchResult.length > 0 ? (
                <div className="w-100 opacity-60 flex flex-col rounded-md mt-1 bg-blue-950 p-3 max-h-60 overflow-y-scroll">
                    {searchResult.map((res, index) => (
                        <div key={index} className="p-1 rounded-md my-[2px] hover:bg-[#374151] hover:cursor-pointer">
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
