import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import React, { useState , useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { app } from '../firebase'
import { UpdateUserFailure, UpdateUserStart , UpdateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { Link } from 'react-router-dom'
// import { useSelector } from 'react-redux';



const Profile = () => {
  // const {currentUser } = useSelector(state => state.user)
  const fileref = useRef(null)
  const {currentUser , loading, error}=useSelector(state=>state.user)
   const [file, setFile] = useState(undefined)
   const [filePerc, setFilePerc] = useState(0)
   const [fileUploadError, setFileUploadError] = useState(false);
   const [formData, setFormData] = useState({});
   const [updateSuccess, setUpdateSuccess] = useState(false);
   const [showListingError, setShowListingError] = useState(false)
   const [userListing, setUserListing] = useState([])
   const dispatch=useDispatch()
   console.log(formData)
   console.log(filePerc)  
   console.log(fileUploadError)
   console.log(formData)
   console.log('hello')
   console.log(currentUser.validUser._id)

  // firbase storage 
  // allow read;
  // allow write: if 
  // request.resource.size<2*1024*1024 &&
  // request.resource.contentType.matches('image/.*')
  useEffect(()=>{
    if (file) {
      handleFileUpload(file)
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
    
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  
  const handleDeleteUser =  async() => {
   try {
    dispatch(deleteUserStart());
     const {data} = await axios.delete(
      `http://localhost:3000/api/user/delete/${currentUser.validUser._id}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
   } catch (error) {
      
    dispatch(deleteUserFailure(error.message))

   }
  };  

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart())
       const {data} = await axios.get(
        'http://localhost:3000/api/auth/signout',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          // withCredentials: true,
        }
      );
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
         dispatch(signOutUserFailure(error.message))
    }
    
  }

  // const handleSubmit =  async (e) => {
  //   e.preventDefault();
  //   try {
  //      dispatch(UpdateUserStart())                       //     http://localhost:3000/api/user/update/666c04d71a2fe88b46c46ce5
     
      //  const res = await fetch(`http://localhost:3000/api/user/update/${currentUser.validUser._id}`,
  //       {
  //         method: 'POST',
  //         headers: {
  //             'Content-Type': 'application/json'
  //         }, 
  //         withCredentials: true,
  //         body: JSON.stringify(formData),
           
  //       });
  //       const data = await res.json();

  //       if (data.success === false) {
  //         dispatch(UpdateUserFailure(data.message))
  //         return
  //       }
  //       dispatch(UpdateUserSuccess(data))
  //   } catch (error) {
  //      dispatch(UpdateUserFailure(error.message))
  //   }
  // };  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(UpdateUserStart());
        console.log("=================>",currentUser.validUser.token)

      // const res = await fetch(`http://localhost:3000/api/user/update/${currentUser.validUser._id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
          
      //     'authorization':  currentUser.validUser.token
      //   },
        
      //   body: JSON.stringify(formData),
      // });
       // const data = await res.json();

      const {data} = await axios.post(
        `http://localhost:3000/api/user/update/${currentUser.validUser._id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            // authorization: currentUser.validUser.token,
          },
          withCredentials: true,
        }
      );
      


     
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));
        return;
      }

      dispatch(UpdateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };


  const handleShowListings = async ()=>{

    try {
      setShowListingError(false)
      const {data} = await axios.get(
        `http://localhost:3000/api/user/listing/${currentUser.validUser._id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (data.success === false) {
        setShowListingError(true)
        return;
      }
      setUserListing(data)
      // console.log(data)
      console.log("User------------------------->")
      console.log(userListing)
    
      
    } catch (error) {
      setShowListingError(true)
    }
  }

  const handleListingDelete = async (id)=>{
    try {
      const {data} = await axios.delete(
        `http://localhost:3000/api/listing/delete/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (data.success === false) {
        setShowListingError(true)
        return;
      }
      // handleShowListings()   //! Not good practice becoz we have to call DB
      setUserListing((prev)=> prev.filter((listing)=> listing._id !== id))
    } catch (error) {
      setShowListingError(true)
    }
  }





  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-3xl font-semibold text-center
      my-7'>Profile</h1>
      <form onSubmit={handleSubmit}  className=' flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileref}  hidden accept='image/*'/>
    <img onClick={()=>fileref.current.click()} className=' rounded-full h-24 w-24  object-cover cursor-pointer
     self-center  mt-2' src={formData.avatar || currentUser.validUser.avatar} alt="profile" />

<p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

   <input type="text"   defaultValue={currentUser.validUser.username} placeholder='username' id='username' onChange={handleChange} className=' border p-3 rounded-lg' />
   <input type="email"  defaultValue={currentUser.validUser.email} placeholder='email' id='email' onChange={handleChange} className=' border p-3 rounded-lg' />
   <input type="text"   placeholder='password' id='password' onChange={handleChange} className=' border p-3 rounded-lg' />
   <button disabled={loading}  className='  bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95
    disabled:opacity-80'>{
      loading ? 'Updating...' : 'Update'
    }</button>
    <Link  className=' bg-green-700 text-white p-3 rounded-lg text-center hover:opacity-95' to={"/create-listing"}> Create Listing</Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className=' text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignout} className=' text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className=' text-red-600 mt-5'>{
       error ? error : ''
      }</p>
      <p className=' text-green-500 mt-5' > 
        {
          updateSuccess && 'Profile updated successfully'
        }
      </p>
      <button className=' text-green-700 w-full' onClick={handleShowListings} >Show Listings</button>
      <p className=' text-red-700 mt-5'>{showListingError ? 'Error showing listings' : ''  }</p>
      { userListing && userListing.length > 0 && 
        <div className=' flex flex-col gap-4 '>

          <h1 className=' text-center mt-7 text-2xl font-semibold'>Your Listing</h1>
    {  userListing.map((listing)=>(
          <div className=' border rounded-lg p-3 flex justify-between items-center gap-4' key={listing._id}>
             <Link to={`/listing/${listing._id}`}>
                <img  
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain '
                />
              </Link>
              <Link className='flex-1 text-slate-700 font-semibold   hover:underline truncate' to={`/listing/${listing._id}`}>
              <p >{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                 <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700 uppercase'>Delete</button>
             
                 <Link to={`/update-listing/${listing._id }`}>
                 <button className='text-green-700 uppercase'>Edit</button>
                 
                 </Link>
              </div>

          </div>
        ))
      }

        </div>

      }
    </div>
  )
}

export default Profile
 