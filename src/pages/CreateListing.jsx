import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const {currentUser} = useSelector(state=>state.user)
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
       

    });
    const [uploading, setUploading] = useState(false)
    const [imageUploadError, setImageUploadError] = useState(false)
    console.log(files)
    console.log(formData)
    const handleImageSubmit = (e)=>{
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
           const promises = [];
           
           for (let i = 0; i < files.length; i++) {

            promises.push(storeImage(files[i]));
           }

           Promise.all(promises).then((urls)=>{
            setFormData({...formData , imageUrls:formData.imageUrls.concat(urls)})
            setImageUploadError(false)
            setUploading(false)
           }).catch((error)=>{
            setImageUploadError('Image Upload Failed (2 mb max per image)')
            setUploading(false)
           })

        }else{
            setImageUploadError('You can upload only 6 images per listing')
            setUploading(false)

        }

    }
    const storeImage = async (file)=>{
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           console.log(`Upload is ${progress}% done`)
          },
       
        (error) => {
         reject(error)
        },
        () => {
      
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
            
            resolve(downloadURL)
          );
        }
      );

      });
    }
    const handleRemoveImage = (index)=>{
    setFormData({...formData, imageUrls:formData.imageUrls.filter((url)=> url!== index)})
    }
    const handleChange =(e)=>{
      if (e.target.id === 'sale' || e.target.id === 'rent') {
        setFormData({
          ...formData,
          type: e.target.id,
        });
      }
      if (
        e.target.id === 'parking' ||
        e.target.id === 'furnished' ||
        e.target.id === 'offer'
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.checked,
        });
      }

      if (
        e.target.type === 'number' ||
        e.target.type === 'text' ||
        e.target.type === 'textarea'
      ) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value,
        });
      }
    
  
    }
    const handleSubmit = async (e)=>{
      e.preventDefault();
      try {
        if (formData.imageUrls.length < 1) {
           return setError("You must upload atleast one image")
        }
        if (+formData.regularPrice<+formData.discountPrice) {
           return setError("Discounted price must be lesser than regular price")
        }
       setLoading(true)
      setError(false);
      const {data} = await axios.post(             ///${currentUser.validUser._id}
      `http://localhost:3000/api/listing/create`,{
        ...formData,
        userRef: currentUser.validUser._id,
      },
        {
          headers: {
            'Content-Type': 'application/json',
            // authorization: currentUser.validUser.token,
          },
          withCredentials: true,
        }
      );
      console.log("---------------------data")
     console.log(data)
      // const res = await fetch('http://localhost:3000/api/listing/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     ...formData,
      //     userRef: currentUser.validUser_id,
      //   }),
      // });
      // const data = await res.json();
      setLoading(false)
      navigate(`/listing/${data.listing._id}`)
      if (data.success === false) {
       setError(data.message);
        return;
      }

        
      } catch (error) {
         setError(error.message);
         setLoading(false)
      }
    }
  return (
    <main className=' p-3  max-w-4xl  mx-auto'>
        <h1 className='text-3xl  font-semibold text-center my-7'>Create a Listing</h1>
        <form onSubmit={handleSubmit}  className=' flex flex-col  sm:flex-row gap-4'>
         <div className=' flex flex-col gap-4  flex-1'>
            <input type="text" placeholder="Name"  className=' border p-3  rounded-lg ' id='name' onChange={handleChange} value={formData.name} maxLength='62' minLength='10' required />
            <textarea type="text" placeholder="Description"  className=' border p-3  rounded-lg ' id='description' onChange={handleChange} value={formData.description} required />
            <input type="text" placeholder="Address"  className=' border p-3  rounded-lg ' id='address' required onChange={handleChange} value={formData.address} />
            
            <div className=' flex flex-wrap gap-6'>

            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className=' flex gap-2'>
                <input type="checkbox"  id='parking' onChange={handleChange} checked={formData.parking}  className=' w-5' />
                <span> Parking spot</span>
            </div>
            <div className=' flex gap-2'>
                <input type="checkbox"  id='furnished' onChange={handleChange} checked={formData.furnished}  className=' w-5' />
                <span> Furnished</span>
            </div>
            <div className=' flex gap-2'>
                <input type="checkbox"  id='offer' onChange={handleChange}  checked={formData.offer}  className=' w-5' />
                <span> Offer</span>
            </div>


         </div>

        <div className=' flex flex-wrap gap-6'>
            <div className=' flex  items-center gap-2'>
                <input type="number" id='bedrooms' onChange={handleChange} value={formData.bedrooms} max= '10' min='1' required className='p-3 border  border-gray-300  rounded-lg' />
                <p> Beds</p>
                
            </div>
            
            <div className=' flex  items-center gap-2'>
                <input type="number" id='bathrooms' onChange={handleChange}  value={formData.bathrooms} max= '10' min='1' required className='p-3 border  border-gray-300  rounded-lg' />
                <p> Baths</p>
                
            </div>
              
              
            <div className=' flex  items-center gap-2'>
                <input type="number" id='regularPrice' onChange={handleChange}  value={formData.regularPrice} max= '1000000' min='50' required className='p-3 border  border-gray-300  rounded-lg' />

                <div className=' flex flex-col items-center'>
                <p> Regular Price</p>
                {formData.type === 'rent' && (
                    <span className=' text-xs'>($ / month)</span>
                )}
                </div>
                
            </div>
              
            {formData.offer && 
            <div className=' flex  items-center gap-2'>
                <input type="number" id='discountPrice' onChange={handleChange}  value={formData.discountPrice} max= '1000000000' min='0' required className='p-3 border  border-gray-300  rounded-lg' />
                <div className=' flex flex-col items-center'>
                <p> Discounted Price</p>
                 <span className=' text-xs'>($ / month)</span>
                </div>
                
            </div>
}
        </div>

         </div>
    <div className=' flex  flex-col flex-1 gap-4 '>
    <p className=' font-semibold'>Images:
    <span className=' font-normal text-gray-600 ml-2'>The first image will be cover (max 6)</span></p>

    <div className=' flex gap-4 '>
        <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border  border-gray-300  rounded w-full ' type="file"  id="images" accept='image/*' multiple />
        <button disabled={uploading} type='button' onClick={handleImageSubmit} className=' p-3 text-green-700 border border-green-700  rounded  uppercase hover:shadow-lg  disabled:opacity-80'>
            { uploading ? 'Uploading...' : 'Upload'
}</button>

    </div>
    <p className=' text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
    {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
                <div key={url} className=' flex justify-between p-3 border items-center'>
               <img src={url} alt='Listing_img ' className=' w-40 h-40  object-contain rounded-lg'/>
               <button  type='button' onClick={() => handleRemoveImage(url)}className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                  Delete
                </button>
               </div>
            ))}


    <button disabled={loading || uploading}  className=' p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80'>
      {
        loading ? 'Creating...' : 'Create Listing'
      
      }
    </button>
    {error && <p className=' text-red-700 text-sm'>{error}</p>}

    </div>
         
        </form>
    </main>
  )
}

export default CreateListing
