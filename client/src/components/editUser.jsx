import React ,{useState,useEffect, useId} from 'react';
import { useNavigate} from 'react-router-dom';
import {updateUserById,deleteUser,getUser} from '../API/Auth.controller';
import {} from '../validations/AuthValidations';
import Spinner from './spinner';

export default function editUser({ userId }) {
    
    const navigate = useNavigate();
    const [user,setUser] = useState({});
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [about,SetAbout] = useState('');
    const [address,setAddress] = useState('');
    const [country,setCountry] = useState('');
    const [city,setCity] = useState('');
    const [zip,setZip] = useState('');
    const [phone,setPhone] = useState('');
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [success,setSuccess] = useState(null);
    const [imagePath, setImagePath] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Fetch user data
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                setLoading(true);
                setTimeout(async () => {
                const user = await getUser(userId);
                setUser(user);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setEmail(user.email);
                SetAbout(user.about);
                setAddress(user.address);
                setCountry(user.country);
                setCity(user.city);
                setZip(user.zip);
                setPhone(user.phone);
                setImagePath(user.imagePath);
                setImagePreview(user.imagePath);
                setLoading(false);
            }, 5000); 
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
        fetchUser();    
    },[userId] );
    
  
//image input
    const imageHandler = (e) =>{
        const selectedImage = e.target.files[0];
        setImagePath(selectedImage);

        const imageUrl = URL.createObjectURL(selectedImage);
        setImagePreview(imageUrl);
    };

// Submit form data
const updateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const formData = new FormData();

        // Append form fields to FormData
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('about', about);
        formData.append('address', address);
        formData.append('country', country);
        formData.append('city', city);
        formData.append('zip', zip);
        formData.append('phone', phone);

        // Append file if it exists
        if (imagePath) {
            formData.append('imagePath', imagePath);
        }

        // const res = await axios.put(`http://localhost:3030/api/user/${userId}/update`, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     },
        // });

        const res = await updateUserById(userId, formData);
        console.log(res.data);
        setSuccess(res.data.message);
        setLoading(false);
    } catch (error) {
        console.error("Error in updateUser function:", error);
        setError(error.message);
        setLoading(false);
    } finally {
        setLoading(false);
    }
}


    //delete Account
    const deleteAccount = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await deleteUser(userId);
            setSuccess(response.message);
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


    

// Function to handle delete
const handleDeleteClick = () => {
    setShowModal(true); 
};

  return (
    <div>
        <form  onSubmit={updateUser}>
            <div className="bg-white">
                <div className="container mx-auto bg-white rounded">
                    <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5 bg-white ">
                        <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 text-center">
                            <p className="text-xl  text-gray-800  font-bold">Profile</p>
                            
                        </div>
                    </div>
                    <div className="mx-auto">
                        <div className=" w-11/12 mx-auto lg:mx-0 lg:w-full">
                            <div className="rounded relative mt-8 h-48 mx-auto">
                                <img src="https://cdn.tuk.dev/assets/webapp/forms/form_layouts/form1.jpg" alt className="w-full h-full object-cover rounded absolute shadow" />
                                <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded" />
                                <div className="flex items-center px-3 py-2 rounded absolute right-0 mr-4 mt-4 cursor-pointer">
                                    
                                    
                                </div>
                                <div className=" absolute w-20 h-20 bottom-0 -mb-10 ml-12 rounded-full overflow-hidden bg-gray-200 shadow flex items-center justify-center">
    {/* Image Preview */}
    {imagePreview && (
        <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-full object-cover"
        />
    )}
    {/* Input */}
    <label htmlFor="imageInput" className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 cursor-pointer" />
    <input
        id="imageInput"
        type="file"
        onChange={imageHandler}
        className="hidden"
    />
    {/* Edit Icon */}
    <div className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white rounded-full cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width={20} height={20} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
            <line x1={16} y1={5} x2={19} y2={8} />
        </svg>
    </div>
</div>


                            </div>
                            
                        </div>
                    </div>
                </div>
                
                <div className="mt-20 lg:flex justify-between border-b border-gray-200 pb-16">
                            <div className="w-80">
                                <div className="flex items-center">
                                    <h1 className="text-xl font-medium pr-2 leading-5 text-gray-800">Personal Information</h1>
                                </div>
                                <p className="mt-4 text-sm leading-5 text-gray-600">Information about the section could go here and a brief description of how this might be used.</p>
                                <div className=' pt-5'>
                                <button type="button" onClick={handleDeleteClick}
                className="w-full rounded-lg bg-white hover:bg-red-600 border border-red-700 px-6 py-2 text-center text-base font-semibold text-black hover:text-white shadow-xl ring-gray-500 ring-offset-2 transition focus:ring-2 uppercase"
              >
               Delete Account
                </button>
                                </div>
                            </div>
                            <div>
                                <div class="md:flex items-center lg:ml-24 lg:mt-0 mt-4">
                                    <div class="md:w-64">
                                        <label class="text-sm leading-none text-gray-800" id="firstName" >First name</label>
                                        <input type="text" value={firstName} onChange={(e)=> setFirstName(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="firstName" placeholder="John" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="lastName">Last name</label>
                                        <input type="text" value={lastName} onChange={(e)=> setLastName(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="lastName" placeholder="Doe" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="lastName">Address</label>
                                        <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="lastName"  />
                                    </div>
                                </div>
                                <div className="md:flex items-center lg:ml-24 mt-8">
                                <div className="md:w-64 ">
                                        <label className="text-sm leading-none text-gray-800" id="lastName">About</label>
                                        <textarea type="text" value={about} onChange={(e)=>SetAbout(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="lastName" placeholder="introduction" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="emailAddress">Email address</label>
                                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="emailAddress" placeholder="youremail@example.com" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="phone" >Phone number</label>
                                        <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="phone" placeholder="123-1234567" />
                                    </div>
                                    
                                    
                                </div>
                                <div className="md:flex items-center lg:ml-24 mt-8">
                                    <div className="md:w-64">
                                        <label className="text-sm leading-none text-gray-800" id="emailAddress">country</label>
                                        <input type="text" value={country} onChange={(e)=>setCountry(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800"  placeholder="Sri Lanka" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="phone" >city</label>
                                        <input type="text" value={city} onChange={(e)=>setCity(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="city" placeholder="colombo" />
                                    </div>
                                    <div className="md:w-64 md:ml-12 md:mt-0 mt-4">
                                        <label className="text-sm leading-none text-gray-800" id="phone" >ZIP code</label>
                                        <input type="text" value={zip} onChange={(e)=>setZip(e.target.value)} tabindex="0" className="w-full p-3 mt-3 bg-gray-100 border rounded border-gray-200 focus:outline-none focus:border-gray-600 text-sm font-medium leading-none text-gray-800" aria-labelledby="zip" placeholder="1234" />
                                    </div>
                                    
                                </div>
                                
                            </div>
                        </div>

         
              
            </div>
            <div className=' flex flex-auto items-center md:float-right gap-5 p-2 mx-auto'>
            {/* <button type='button'
                className="w-full rounded-lg bg-white hover:bg-red-600 border border-red-700 px-6 py-2 text-center text-base font-semibold uppercase text-black hover:text-white shadow-xl ring-gray-500 ring-offset-2 transition focus:ring-2"
              >
               cancel
                </button> */}
            <button
                type="submit"
                className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 hover:rounded-full px-10 py-2 text-center text-base font-semibold uppercase text-white shadow-xl ring-gray-500 ring-offset-2 transition focus:ring-2"
              >
               {loading? "loading" : "Update" } 
                </button>
            </div>
        </form>
      {/* Modal */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <Spinner/>
        </div>
      )}
            {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
          <p>Are you sure you want to delete your account?</p>
            <button onClick={() => setShowModal(false)} className="mt-4 px-4 py-1 bg-gray-200 text-black rounded-md border-red-600 hover:bg-gray-400 uppercase">Cancel</button>
            <button  onClick={deleteAccount} className="mt-4 px-4 py-1 float-right bg-orange-500 text-white rounded-md hover:bg-orange-600 uppercase">YES</button>
          </div>
        </div>
      )}
    </div>
  )
}
