import { useEffect } from 'react';
import { ref, get, update } from 'firebase/database';
import { db } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPhoneNumber,
  setUserData,
  setMacAddresses,

  seterror,

  setloadingg,
  setUserEditing,
  
  handleMacEditt,
  updateUserData,
  updateMacAddresses,
}
from './Store'
const UserData = () => {
  //const [phoneNumber, setPhoneNumber] = useState("");
 // const [userData, setUserData] = useState(null);
//  const [macAddresses, setMacAddresses] = useState({});
 // const [error, setError] = useState(null);
 // const [loading, setLoading] = useState(false);
 // const [userEditing, setUserEditing] = useState(false);
 // const [macEditing, setMacEditing] = useState({});
  const dispatch = useDispatch();
  const {
    phoneNumber,
    userData,
    macAddresses,
    Loading,
    err,
    userEditing,
    macEditing
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (phoneNumber) {
      fetchUserDataByPhone(phoneNumber);
    }
  }, []);

  const handleSearch = () => {
    //.trim remove white spaces //
    if (phoneNumber.trim()) {
      fetchUserDataByPhone(phoneNumber);
    } else {
      dispatch(seterror('Please enter a phone number.'));
    }
  };

  const fetchUserDataByPhone = async (phone) => {
    dispatch(setloadingg(true));
    dispatch(seterror(null));
    try {
      const userRef = ref(db, `users/${phone}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        dispatch(setUserData(data));

        //Object.entries(data) converts the data object into an array of key-value pairs
        const macData = Object.entries(data).filter(([key]) => key.includes(":"));
        dispatch(setMacAddresses(Object.fromEntries(macData)));



      } else {
        dispatch(seterror('No data found for this phone number.'));
        dispatch(setUserData(null));
        dispatch(setMacAddresses({}));

      }
    } catch (err) {
      dispatch(seterror('Error fetching data.'));

      console.error(err);
    } finally {
      dispatch(setloadingg(false));
    }
  };

  const handleUserEdit = () => {
    dispatch(setUserEditing(!userEditing));
  };

  const handleMacEdit = (mac) => {
    dispatch(handleMacEditt({ mac }));
    // setMacEditing((prev) => ({
    //   ...prev,
    //   [mac]: !prev[mac],
    // }));
  };

  const handleUserUpdate = async () => {
    if (phoneNumber && userData) {
      try {
        const userRef = ref(db, `users/${phoneNumber}`);
        await update(userRef, userData);
        dispatch(seterror(null));
        dispatch(setUserEditing(false));
        fetchUserDataByPhone(phoneNumber); 
        toast.success("User data updated successfully!", {
          theme: "dark",
          autoClose: 2000,

        });
      } catch (err) {
        dispatch(seterror('Error updating data.'));
        toast.error("Failed to update user data.");
        console.error(err);
      }
    } else {
      dispatch(seterror('Please enter a phone number and ensure user data is loaded.'));
    }
  };

  const handleMacUpdate = async (mac) => {
    if (phoneNumber && macAddresses[mac]) {
      try {
        const macRef = ref(db, `users/${phoneNumber}/${mac}`);
        await update(macRef, macAddresses[mac]);
        dispatch(seterror(null));
       // Get previous state
        dispatch(handleMacEditt({ mac })); // You may need to adapt this based on your state structure

        // Compute the updated macEditing state
      
        fetchUserDataByPhone(phoneNumber); 
        toast.success(
          <div>
            MAC address <strong>{mac}</strong> updated successfully!
          </div>
          , {
            theme: "dark",
            autoClose: 2000,

          } );

      } catch (err) {
        dispatch(seterror('Error updating MAC address.'));
        console.error(err);
      }
    }
  };
  

  
  const handleChange = (e, key) => {
  const value = e.target.value === "true" ? true : e.target.value === "false" ? false : e.target.value;
    dispatch(updateUserData({ key, value }));
};

const handleMacChange = (e, mac, key) => {
  const value = e.target.value === "true" ? true : e.target.value === "false" ? false : e.target.value;
  dispatch(updateMacAddresses({ mac, key, value }));
};


  return (<>
  
    <ToastContainer />
    <h1 className="flex justify-center items-center  text-xl font-semibold mb-0 text-white dark:text-gray-400 ">User Data</h1>
    <div className=' flex  justify-start items-start w-full  '>

      <div className=" rounded-3xl w-full   p-6  max-w-[670px] mx-auto">
        

        <div className=" flex  items-center space-x-4">
          <div className="flex-1  ">
            
            
      <div className="flex flex-col sm:flex-row justify-center items-center mb-5 space-y-3 sm:space-y-0 sm:space-x-3">
         <input
          type="text"
          id="phoneNumber"
          value={phoneNumber}
                onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
           placeholder="Enter Phone Number"
           className="w-full bg-[#333333] sm:w-auto px-4 text-gray-300 py-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
        <button 
         onClick={handleSearch} 
         className=" sm:w-auto px-4 py-2 font-thin tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#2977a4] rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
         >
         <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" /> Search
        </button>
      </div>

            
          </div>
        </div>

        {err&& <p className="text-red-500 mb-4">{err}</p>}
        {Loading &&  <div className="flex items-center justify-center ">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
        </div>
      </div>
    </div>}

        {/* User Information */}
        {userData && (
          <div className="p-4  mb-4 shadow-md rounded bg-[#333333] ">
            <h2 className="text-lg font-bold text-gray-200 mb-2">User Information</h2>

            <div>
              <label className="block mb-2 text-gray-200">Active QR:</label>
              <input
                type="text"
                value={userData.active_qr || ""}
                onChange={(e) => handleChange(e, 'active_qr')}
                disabled={!userEditing}
                className="w-full p-2 border text-gray-200 bg-[#494F55] border-gray-300 rounded mb-2"
              />
            </div>
            {/* <div>
              <label className="block mb-2">Address:</label>
              <input
                type="text"
                value={userData.address || ""}
                onChange={(e) => handleChange(e, 'address')}
                disabled={!userEditing}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div> */}
            {/* <div>
              <label className="block mb-2">Contacts Status:</label>
              <select
                value={userData.contacts_status ? "true" : "false"}
                 onChange={(e) => handleChange(e, 'contacts_status')}
               
                disabled={!userEditing}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              >
                <option value="true" >True</option>
                <option value="false" >False</option>
              </select>
            </div> */}
            {/* <div>
              <label className="block mb-2">Latitude:</label>
              <input
                type="text"
                value={userData.lat || ""}
                onChange={(e) => handleChange(e, 'lat')}
                disabled={!userEditing}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div>
            <div>
              <label className="block mb-2">Longitude:</label>
              <input
                type="text"
                value={userData.lon || ""}
                onChange={(e) => handleChange(e, 'lon')}
                disabled={!userEditing}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div>
            <div>
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                value={userData.name || ""}
                onChange={(e) => handleChange(e, 'name')}
                disabled={!userEditing}
                className="w-full p-2 border border-gray-300 rounded mb-2"
              />
            </div> */}

            {userEditing ? (
              <button
                onClick={handleUserUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            ) : null}

            <button
              onClick={handleUserEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
            >
              {userEditing ? "Cancel" : "Edit"}
            </button> 
          </div>
        )}

        {/* Display MAC addresses and selected fields */}
        {Object.keys(macAddresses).length > 0 && Object.entries(macAddresses).map(([mac, data]) => (
          <div key={mac} className="p-4 mb-4 shadow-md rounded bg-[#333333]">
            <h2 className="text-lg font-bold mb-2 text-gray-200">MAC Address: {mac}</h2>
            <div>
              <label className="block mb-2 text-gray-200">MNV:</label>
              <input
                type="number"
                value={data.mnv || ""}
                onChange={(e) => handleMacChange(e, mac, 'mnv')}
                disabled={!macEditing[mac]}
                className="w-full bg-[#494F55]  text-white p-2 border border-gray-300 rounded mb-2"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Model:</label>
              <input
                type="number"
                value={data.model || ""}
                onChange={(e) => handleMacChange(e, mac, 'model')}
                disabled={!macEditing[mac]}
                className="w-full p-2 border text-white bg-[#494F55] border-gray-300 rounded mb-2"
              />
            </div>
                
            <div>
              <label className="block mb-2 text-white">Motor ID:</label>
              <input
                type="text"
                value={data.motor_id || ""}
                onChange={(e) => handleMacChange(e, mac, 'motor_id')}
                disabled={!macEditing[mac]}
                className="w-full p-2 border text-white bg-[#494F55] border-gray-300 rounded mb-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-white">Recharge ID:</label>
              <input
                type="text"
                value={data.recharge_id || ""}
                onChange={(e) => handleMacChange(e, mac, 'recharge_id')}
                disabled={!macEditing[mac]}
                className="w-full p-2 border text-white bg-[#494F55] border-gray-300 rounded mb-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-white">Recharge Validity:</label>
              <input
                type="number"
                value={data.recharge_validity|| ""}
                onChange={(e) => handleMacChange(e, mac, 'recharge_validity')}
                disabled={!macEditing[mac]}
                className="w-full p-2 border text-white bg-[#494F55] border-gray-300 rounded mb-2"
              />
            </div>

            <div>
              <label className="block mb-2 text-white">Recharge Status:</label>
              <select
                value={data.recharge_status ? "true" : "false"}
                onChange={(e) => handleMacChange(e, mac, 'recharge_status')}
                disabled={!macEditing[mac]}
                className="w-full p-2 border text-white bg-[#494F55] border-gray-300 rounded mb-2"
              >
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>



            {macEditing[mac] ? (
              <button
                onClick={() => handleMacUpdate(mac)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save 
              </button>
            ) : null}

            <button
              onClick={() => handleMacEdit(mac)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-4"
            >
              {macEditing[mac] ? "Cancel" : "Edit"}
            </button>
          </div>
        ))}
      </div>
    </div>
    
  </>
  );
};

export default UserData;
