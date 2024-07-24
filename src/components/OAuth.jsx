import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice'
import { useNavigate } from 'react-router-dom'
const OAuth = () => {
  
  const {currentUser } = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleGoogleClick = async () => {
        
         try {
             const  provider  = new GoogleAuthProvider()
             const auth = getAuth(app)

             const  result = await signInWithPopup(auth , provider)
             console.log(result)

            const res =  await fetch('http://localhost:3000/api/auth/google',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })

            })
            const data = await res.json()
            console.log(data)
            dispatch(signInSuccess(data))
            console.log(currentUser)
   
            navigate('/')

            
         } catch (error) {
            console.log("Could not sign-in with google" , error)
         }
    }
  return (
    <div>
   <button onClick={handleGoogleClick}  type='button' className=' w-full bg-red-700 text-white p-3 hover:opacity-95 rounded-lg uppercase'>Continue with Google</button>
    </div>
  )
}

export default OAuth
