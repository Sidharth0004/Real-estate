import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import { Link, useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate()
    const {currentUser } = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    // console.log(currentUser)
    const handleSubmit = (e) => {
        e.preventDefault();
      const   urlParams = new URLSearchParams(window.location.search);
      urlParams.set('searchTerm', searchTerm);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    }
    const location = useLocation(); // Add useLocation hook
    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl)
        }
    },[location.search])
    // console.log(searchTerm
  return (
    
      <header className=' bg-slate-200 shadow-sm'>
        <div className='flex justify-between  max-w-6xl mx-auto p-3'>
            <Link to="/">
        <h1 className=' font-bold text-sm  sm:text-xl flex flex-wrap '>
            <span className=' text-slate-500'></span>
            <span className=' text-slate-600'>Estate</span>
        </h1>
        </Link>
        <form  onSubmit={handleSubmit} className='  bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" onChange={(e)=> setSearchTerm(e.target.value)} placeholder='Search...' value={searchTerm} className=' w-24 sm:w-64 bg-transparent focus:outline-none outline-none' />
            <button>
            <FaSearch className=' text-slate-500'/>

            </button>
        </form>
        <ul className='flex gap-4'>
            <Link to='/'>
            <li className=' hidden sm:inline-block text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline-block text-slate-700 hover:underline'>About</li>
            </Link>
            <Link to='/profile'>
            {currentUser ? <img className=' rounded-full w-7 h-7  object-cover' src={currentUser.validUser.avatar} alt="Profile" />  :  <li className=' sm:inline-block text-slate-700 hover:underline'>Sign in</li> 
           
           }
       
            
            </Link>
        </ul>
        </div>
       
      </header>
    
  )
}

export default Header
