import React from 'react'

const Search = () => {
  return (
    <div className=' flex flex-col md:flex-row'>
        <div className=' p-7 border-b-2  md:border-r-2 md: min-h-screen '>
     <form  className=' flex flex-col gap-2 space-y-7'>

        <div className=' flex items-center gap-2'>
        <label className=' whitespace-nowrap font-semibold'>Search Term :
   </label>
    <input id='searchTerm' placeholder='Search...' type="text" className=' rounded-lg p-3  border w-full' />
        </div>

        <div className=' flex gap-2  flex-wrap items-center'>
            <label className=' font-semibold' >Type:</label>
            <div className='flex gap-2'>
                <input type="checkbox" id='all'  className='w-5'/>
                <span>Rent & Sale</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='rent'  className='w-5'/>
                <span>Rent </span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='sale'  className='w-5'/>
                <span>Sale</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='offer'  className='w-5'/>
                <span>Offer</span>
            </div>
        </div>
        <div className=' flex gap-2  flex-wrap items-center'>
            <label className=' font-semibold' >Amenities:</label>
            <div className='flex gap-2'>
                <input type="checkbox" id='parking'  className='w-5'/>
                <span>Parking</span>
            </div>
            <div className='flex gap-2'>
                <input type="checkbox" id='furnished'  className='w-5'/>
                <span>Furnished </span>
            </div>

        </div>
  
  <div className=' flex items-center gap-2'>
    <label className=' font-semibold'>Sort:</label>
    <select  id="sort_order" className=' border p-3 rounded-lg'>
        <option value="">Price high to low</option>
        <option value="">Price low to high</option>
        <option value="">Latest</option>
        <option value="">Oldest</option>
    </select>
  </div>
   <button className=' bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
     </form>
        </div>

        <div className=' text-3xl font-semibold  border-b p-3 text-slate-700  mt-5'>
          Listing results :
        </div>
    </div>
  )
}

export default Search
 