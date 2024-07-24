import axios from 'axios';
import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { IoLocationSharp } from "react-icons/io5";
import { FaBath, FaChair, FaParking, FaShare } from "react-icons/fa";
import { FaBed } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';


const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const { currentUser } = useSelector((state) => state.user);

   console.log(contact)
    console.log("current",currentUser);
    // console.log("listing",listing.listing.name);
    
    
 
    // useEffect(()=>{
    // const fetchListing = async () => {
    //   try {
    //     setLoading(true);
    //    console.log("-------------------------------- rendering data")
    //    console.log(listing)


    //     const {data} = await axios.get(`http://localhost:3000/api/listing/get/${params.listingId}`);


    //      console.log('data rendersd ----------------')
    //      setListing(data);
    
    //     if (data.success === false) {
    //       setError(true);
    //       setLoading(false);
    //       return;
    //     }
    
     
    //     setLoading(false);
    //     setError(false);
    
    //     console.log(data);
    //     console.log(error)
    //     console.log(loading)
    //     console.log('listing', listing);
    //   } catch (error) {
    //     console.error('Error fetching listing:', error);
    //     setError(true);
    //     setLoading(false);
    //   }
    // };
   
   
    //     fetchListing();
      
    //   },[params.listingId])
    


    const listingId = params.listingId;
      
    useEffect(()=>{
        const fetchListing = async () => {
            const {data} = await axios.get(
              `http://localhost:3000/api/listing/get/${listingId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true,
              }
            );
              console.log(data)
              if (data.success === false) {
                console.log(data.message)
                return;
              }
              setListing(data);
        }
      fetchListing();
    },[listingId]);

    // console.log("listing1-------------", listing)
    
  //   useEffect(() => {
  //     const fetchListing = async () => {
  //         const { data } = await axios.get(
  //             `http://localhost:3000/api/listing/get/${listingId}`,
  //             {
  //                 headers: {
  //                     'Content-Type': 'application/json',
  //                 },
  //                 withCredentials: true,
  //             }
  //         );
  //         console.log(data);
  //         if (data.success === false) {
  //             console.log(data.message);
  //             return;
  //         }
  
  //         setListing(data);
  //         console.log("listing-------------", data);
  //     };
  //     fetchListing();
  // }, [listingId]); 
  return (
    <main className=' mb-10'>
    {
      listing ? (
<div>
<Swiper navigation>
            {listing.listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
<div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}




<div className=' w-[60%]  mx-auto flex flex-col'>
  <h1 className='text-3xl mt-6 '>{listing.listing.name} - $ {listing.listing.regularPrice}{listing.listing.type === 'rent' ? ' / month' : '' }</h1>

  <div className='mt-4   '>
  <span className=' text-green-700  '><IoLocationSharp /></span>

  <p className=' text-slate-500 font-semibold' >
      {listing.listing.address}</p>
  </div>
  <div className=' flex gap-4 flex-wrap'>
  
             <div className=' border px-14 py-1 text-white  rounded-md bg-[#7F1D1D]'> For  <span className=' capitalize'>{listing.listing.type}</span></div>
             {
              listing.listing.offer ? (
                <div className=' border px-14 py-1 text-white  rounded-md bg-[#14532D]'> $ <span className=' capitalize'>{listing.listing.discountPrice}</span> discount</div>
              ) : ""
             }
 

  </div>
  <p className=' mt-4'><span className=' font-semibold'>Description</span> - {listing.listing.description}</p>

  <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.listing.bedrooms} beds `
                  : `${listing.listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.listing.bathrooms} baths `
                  : `${listing.listing.bathrooms} bath `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaParking className='text-lg' />
                {listing.listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaChair className='text-lg' />
                {listing.listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
            </ul>  
           
            {currentUser && listing.listing.userRef !== currentUser.validUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-slate-700 text-white rounded-lg uppercase mt-12 hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing = {listing}/>}

</div>
</div>
      ) : (
        <p className=' text-center my-7 text-2xl'>Loading...</p>
      )
    }
   
    </main>
  )
}

export default Listing
