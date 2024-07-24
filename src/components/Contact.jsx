import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('')

  const onChange = (e) => {
    setMessage(e.target.value)
  
  }


  useEffect(()=>{
    const fetchLandlord = async () => {
        const {data} = await axios.get(
        `http://localhost:3000/api/user/${listing.listing.userRef}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
          console.log("-----------------",data)
          if (data.success === false) {
            console.log(data.message)
            return;
          }
          setLandlord(data);
    }
    fetchLandlord();
},[listing.listing.userRef]);
console.log(listing)



  return (
    <>
      {landlord &&  (
   <div className=' flex flex-col  gap-2'>
    <p>Contact <span className=' font-semibold'>{landlord.username}</span> for
    <span className=' font-semibold'>{listing.listing.name.toLowerCase()}</span></p>

    <textarea name="message" id="message" rows="2" value={message} onChange={onChange}
    placeholder='Enter your message here...' className=' w-full border p-3 rounded-lg' ></textarea>
    <Link className=' bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95' to={`mailto:${landlord.email}?subject=Regarding ${listing.listing.name}&body=${message}`}>Send Message</Link>
   </div>
  
      ) }
    </>
  )
}


export default Contact
