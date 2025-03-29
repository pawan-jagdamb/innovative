import React from 'react'

export const Search = () => {
  return (
        <div className='flex flex-col md:flex-row text-richblack-100'>
            <div className='p-7 border-b-2 sm:border-r-2 md:min-h-screen 
            '>
                <form className='flex flex-col gap-8'>
                <div className='flex items-center gap-2 '>
                    <lagel
                    className='whitespace-nowrap font-semibold' 
                    >Search Term:</lagel>
                    <input
                        type='text'
                        id='searchTerm'
                        placeholder='Search...'
                        className='border rounded-lg  p-3 w-full'
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center text-richblack-100'>
                    <label className='text-richblack-100'>Type:</label>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='all'
                            className='w-5'

                        />
                        <span>offer</span>
                        {/* <span>Sale</span> */}

                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox'
                            id='all'
                            className='w-5'

                        />
                        {/* <span>offer</span> */}
                        <span>Sale</span>

                    </div>
                </div>

                <div className='flex items-center gap-2 text-richblack-400'>
                    <label>Sort:</label>
                    <select id='sort_order'
                    className='border rounded-lg p-3'
                    >
                        <option >Price High to low</option>
                        <option >Price Low to High</option>
                        <option >Latest</option>
                        <option>Oldest</option>
                    </select>
                </div>
                <button className='bg-richblack-700 p-3 text-richblack-200
                rounded-lg uppercase hover:opacity-95'>search</button>



                </form>
            </div>
            <div className=''>
                <h1 className='text-3xl font-semibold  p-3 text-richblack-600'>Listing Results</h1>
            </div>
        </div>
  )
}
