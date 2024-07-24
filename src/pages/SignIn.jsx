import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { SignInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import { useSelector } from 'react-redux';
import OAuth from '../components/OAuth';
import axios from 'axios'


const SignIn = () => {
  const {currentUser } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const [password, setPassword] = useState(true)

     // const [error, setError] = useState(null)
    // const [loading, setLoading] = useState(false)
    const {loading , error} = useSelector((state) => state.user)
      const navigate = useNavigate();
      const dispatch = useDispatch()
    
    const handleChange = (e) => {
        
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    };
    const handleSubmit = async (e) => {
      try {
      
         dispatch(signInStart());
        console.log(error)
        e.preventDefault();        
        
        // const res = await fetch('http://localhost:3000/api/auth/signin',
        //     {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     // withCredentials: true,

        //      credentials: 'include',
          
        //     body: JSON.stringify(formData),

          
            const {data} = await axios.post('http://localhost:3000/api/auth/signin', formData, {
              headers: {
                'Content-Type': 'application/json',
              },
              // You can include credentials (cookies) if needed
              withCredentials: true,
          


        });
        // const data = await res.json()
        if (data.success === false) {
          // setLoading(false)
          // setError(data.error)
          dispatch(SignInFailure(data.error))
        
          console.log(error)
          return
        }
        // setLoading(false)
        // setError(null )
        dispatch(signInSuccess(data))
        console.log("data")
        console.log(data)
        console.log('currentUser.validUser.avatar')
        // console.log(currentUser.data.validUser.avatar)
    console.log("first")
            // console.log('object')
        
        navigate("/")
      } catch (error) {
        // setLoading(false)
        // setError(error.message)
        dispatch(SignInFailure(error.message))
      
      }
      

    }
    console.log(formData) 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl font-semibold text-center
      my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className=' flex flex-col gap-4' >
        <input type="email" placeholder='email' className=' outline-none hover:outline-none border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <div className=' relative  '>
        <input type={password ?"password" : "text" }  placeholder='password' className=' outline-none hover:outline-none w-full border p-3 rounded-lg' id='password' onChange={handleChange}/>
       <span className=' absolute top-[39%]  right-3'>{password ? <IoEyeOutline onClick={()=>setPassword(false)}/>: <IoEyeOffOutline onClick={()=> setPassword (true)}/> }</span>
        </div>
        <button disabled={loading}   className=' bg-slate-700 text-white p-3
         rounded-lg uppercase hover:opacity-95   disabled:opacity-80'>{loading ? 'loading...':'Sign In'}</button>
       <OAuth/>
      </form>
      <div className=' flex  gap-2 mt-5'>
        <p>Dont have an account? </p>
     <Link to='/sign-up'><span className=' text-blue-700 '>Sign up</span></Link>
      </div>
      {error && 
      <p className=' text-red-500'>{error}</p>
      }
    </div>
  )
}

export default SignIn
