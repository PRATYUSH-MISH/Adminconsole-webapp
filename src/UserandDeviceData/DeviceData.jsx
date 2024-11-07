import { useEffect, useState, useRef } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { db } from "../firebase";
import { ref, get, child, update } from "firebase/database";
import { Uiii } from "./DeiveUII.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
//
import { useDispatch,useSelector } from "react-redux";
import {
  setDeviceData,
  setLoading,
  setErr,
  setEditData,
  toggleEditing,
  setmacadd,
  setModel,
  setSerialNo,
  
} from './Store';

const DeviceData = () => {
  const dispatch = useDispatch();
  const {
    deviceData,
    loading,
    error,
    editData,
    isEditing,
    macadd,
    model,
    serialNo,
  } = useSelector(state => state.device);



  //const [deviceData, setDeviceData] = useState(null);
  //const [loading, setLoading] = useState(false);
  //const [error, setError] = useState(null);
 
  const [userId, setUserId] = useState("");
  const [searchId, setSearchId] = useState("");
  const searchInputRef = useRef(null);
   //const [editData, setEditData] = useState({});
  // const [isEditing, setIsEditing] = useState(false);
//const [macadd,setmacadd]=useState("")
  //const [model, setModel] = useState(null); // State for model
  //const [serialNo, setSerialNo] = useState(null); 

  // Fetch data from Firebase


  const getData = async () => {
  dispatch(setLoading(true));
    try {
      const dbRef = ref(db);
      const adminSnapshot = await get(child(dbRef, `qr/admin/${searchId}`));
      if (adminSnapshot.exists()) {
        const macAddress = adminSnapshot.val().mac;
        const model = adminSnapshot.val().model;
        const serialNo = adminSnapshot.val().serialNo;
        
       dispatch( setmacadd(macAddress))
        dispatch(setModel(model))
        dispatch(setSerialNo(serialNo))



        const regSnapshot = await get(child(dbRef, `qr/reg/${macAddress}`));
        if (regSnapshot.exists()) {
          dispatch(setDeviceData(regSnapshot.val()));
          dispatch(setEditData(regSnapshot.val())); // Preload data for editing
        } else {
          dispatch(setErr("No data available under reg collection"));
          
        }
      } else {
        alert("No data available under admin collection");
        dispatch(setDeviceData(null));
      }
    } catch (error) {
      alert("Error fetching document:", error);
      dispatch(setErr("Failed to load data"));
    } finally {
      dispatch(setLoading(false));
    }
  };
  // Focus the search input on load
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);
  // Handle search input submission
  const handleSearch = () => {
    setSearchId(userId);
  };
  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = value === "Yes" ? true : value === "No" ? false : value;
    const updatedData = JSON.parse(JSON.stringify(editData));
    updateNestedState(updatedData, name, newValue);

    // Dispatch the updated data immutably
    dispatch(setEditData(updatedData));

    // const updatedData = { ...editData };
    // updateNestedState(updatedData, name, newValue);
    // dispatch(setEditData(updatedData));
  };

  const updateNestedState = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
     
  const lastObj = keys.reduce((acc, key) => {
    
    if (!acc[key]) {
      acc[key] = {};
    }
    return acc[key];
  }, obj);

  // Update the value at the last key
  lastObj[lastKey] = value;
  };

  // Toggle editing mode
  const toggleEdit = () => {
    dispatch(toggleEditing());
  };

  // Add or update data in Firebase
  const addupdate = async () => {
    dispatch(setLoading(true));
    try {
      const dbRef = ref(db);
      const adminSnapshot = await get(child(dbRef, `qr/admin/${searchId}`));
      if (adminSnapshot.exists()) {
        const macAddress = adminSnapshot.val().mac;
        await update(ref(db, `qr/reg/${macAddress}`), editData);

        getData(); // Fetch the updated data
        dispatch(setDeviceData(editData));// Update local state
        toast.success("Data updated successfully!", {
          theme: "dark",
          autoClose: 2000,

        });
        dispatch(toggleEditing()); // Exit edit mode
      } else {
        alert("MAC Address not found under admin collection");
      }
    } catch (error) {
      console.error("Error updating document:", error);
      dispatch(setErr("Failed to update data"));
    } finally {
      dispatch(setLoading(false));
    }
  };
// Fetch data when searchId changes
  useEffect(() => {
    if (searchId) {
      getData();
    }
  }, [searchId]);

  return (
  <>

  
    <ToastContainer />
      <h1 className="flex justify-center items-center mb-4 text-xl font-semibold text-white dark:text-gray-400">Device Data</h1>
    
    
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row justify-center items-center mb-5 space-y-3 sm:space-y-0 sm:space-x-3">
         <input
          type="text"
          ref={searchInputRef}
           value={userId}
           onChange={(e) => setUserId(e.target.value)}
           placeholder="Enter Search ID"
           className="w-full sm:w-auto bg-[#494F55] px-4 py-2 text-gray-200 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-white"
          />
  
        <button 
         onClick={handleSearch} 
         className=" sm:w-auto px-4 py-2 font-thin tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#2977a4] rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-white focus:ring-opacity-80"
         >
         <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" /> Search
        </button>
      </div>


      {error && <p className="text-red-500 mb-4">ERROR!{error}</p>}
      {loading && <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
          </div>
        </div>
      </div>}

      {/* Device Data Display */}
      {deviceData ?
        (
          <div>
            {
              deviceData.d ? (
               
                  <Uiii
                    deviceData={deviceData}
                    editData={editData}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    toggleEdit={toggleEdit}
                    addupdate={addupdate}
                  macadd={macadd}
                  model={model}
                  serialNo={serialNo}
                  />
              ) : (
                
                <div className="flex flex-col  ">
                  <div className="flex justify-end mr-14">
                  {!isEditing ? (
                      <button
                        onClick={toggleEdit}
                        className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex ">
                        <button
                          onClick={addupdate}
                          className="px-6 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        >
                          Save
                        </button>
                        <button
                          onClick={toggleEdit}
                          className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    </div>
                  <div className="flex justify-center items-center ">
                  <div className="w-full mt-2 max-w-sm px-4 py-3 bg-[#333333] rounded-md shadow-md dark:bg-gray-800">
                    <div className="flex-col items-center justify-between">
                      <h2 className="font-semibold text-sm text-white"> MAC : { macadd }</h2>  
                      <h2 className="font-semibold text-sm text-white"> Model: {model}</h2>
                      <h2 className="font-semibold text-sm text-white "> Serial Number: {serialNo}</h2>
                      

                    </div>

                    <div className=" p-0 m-0 ">

                      <div>
                       <label className="text-xs block mt-1 mb-1  text-white">Date</label>
                       <input
                        type="text"
                        name="dateTime"
                        value={editData.dateTime || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 bg-[#494F55] text-white  font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                      </div>
                      <div>
                       <label className="block mb-1 text-xs text-white">Feedback:</label>
                       <input
                        type="number"
                        name="feedback"
                        value={editData.feedback || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 font-medium border text-white bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                      </div>
                      <div>
                       <label className="block mb-1 text-xs text-white">Minimum voltage:</label>
                       <input
                        type="text"
                        name="initials.mnv"
                        value={editData.initials.mnv || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 bg-[#494F55] text-white font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                     </div>
                      <div>
                       <label className="block mb-1 text-xs text-white">Phase:</label>
                       <select
                        name="initials.phase"
                        value={editData.initials.phase ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 bg-[#494F55] text-white font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                       >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                       </select>
                      </div>
                      <div>
                        <label className="block text-xs mb-1 text-white">Recharge:</label>
                        <select
                        name="initials.recharge"
                        value={editData.initials.recharge ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 font-medium border text-white bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                        </select>
                     </div>
                     <div>
                      <label className="block mb-1 text-xs text-white">Motor Instruction:</label>
                      <input
                      type="number"
                        name="instruction.motor"
                        value={editData.instruction.motor ||""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 font-medium text-white border bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                       
                      </div>
                      <div>
                      <label className="block mb-1 text-xs text-white">Protection Instruction:</label>
                      <input
                        type="text"
                        name="instruction.protection"
                        value={editData.instruction.protection || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 font-medium bg-[#494F55] text-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      </div>
                      <div>
                      <label className="block mb-1 text-xs text-white">Mode:</label>
                        <input
                          type="text"
                          name="mode"
                          value={editData.mode || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full p-1 mb-1 font-medium border text-white bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                       </div>
                    
                      <div>
                      <label className="block mb-1 text-xs text-white">Model:</label>
                      <input
                        type="text"
                        name="model"
                        value={editData.model || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-1 mb-1 font-medium border text-white bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                       </div>
                                        
                    </div>

                    
                  </div>
                  

                  {/* card 1 ends */}

                  {/* card 2 starts */}

                 <div className="w-full  ml-5 max-w-sm px-4 py-3 bg-[#333333]  rounded-md shadow-md dark:bg-gray-800">

                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-sm mb-2 text-white"> Protection</h2>
                    </div>

                  <div className=" p-0 m-0">
                    <div>
                      <label className="block mb-2 text-xs text-white">Network:</label>
                      <input
                        type="text"
                        name="network"
                        value={editData.network || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-[#494F55] text-white p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <h2 className="text-sm font-bold mb-3 text-white "> Initials</h2>
                    <div>
                      <label className="block mb-2 text-white text-xs">Power Start Time:</label>
                      <input
                        type="text"
                        name="powerStartTime"
                        value={editData.powerStartTime || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 text-white bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white text-xs">Red Phase :</label>
                      <select
                        type="text"
                        name="r"
                        value={editData.r ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 text-white bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-3 text-white text-xs">Source:</label>
                      <input
                        type="text"
                        name="source"
                        value={editData.source || "N/A"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 text-white bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white  text-xs">Timer in action:</label>
                      <select
                        type="text"
                        name="timerInAction"
                        value={editData.timerInAction ? "Yes" : "No"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 text-white bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs text-white">Voltage Fault:</label>
                      <select
                        name="voltageFault"
                        value={editData.voltageFault ? "Yes" : "No"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 text-white bg-[#494F55] font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs text-white">Yellow Fault:</label>
                      <select
                        name="y"
                        value={editData.y ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 bg-[#494F55] text-white font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>



                    
                  </div>
                  

                 </div>

                 </div> 
                 



                  {/* <div className="bg-pink-500  p-4  w-full max-w-[670px] border-gray-400 rounded-xl "> */}
                      {/* <h2 className="font-semibold text-sm mb-4"> Data  { macadd }</h2> */}
                    {/* <div>
                       <label className="text-xs block mb-2">Date</label>
                      <input
                        type="text"
                        name="dateTime"
                        value={editData.dateTime || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Feedback:</label>
                      <input
                        type="number"
                        name="feedback"
                        value={editData.feedback || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Minimum voltage:</label>
                      <input
                        type="text"
                        name="initials.mnv"
                        value={editData.initials.mnv || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Phase:</label>
                      <select
                        name="initials.phase"
                        value={editData.initials.phase ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-2">Recharge:</label>
                      <select
                        name="initials.recharge"
                        value={editData.initials.recharge ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Motor Instruction:</label>
                      <input
                      type="number"
                        name="instruction.motor"
                        value={editData.instruction.motor ||""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                     / >
                       
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Protection Instruction:</label>
                      <input
                        type="text"
                        name="instruction.protection"
                        value={editData.instruction.protection || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Mode:</label>
                        <input
                          type="text"
                          name="mode"
                          value={editData.mode || ""}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />


                    </div>
                    
                    <div>
                      <label className="block mb-2 text-xs">Model:</label>
                      <input
                        type="text"
                        name="model"
                        value={editData.model || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div> */}

                    {/* <h2 className="text-sm font-bold mb-4"> Protection</h2>
                    <div>
                      <label className="block mb-2 text-xs">Network:</label>
                      <input
                        type="text"
                        name="network"
                        value={editData.network || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <h2 className="text-sm font-bold mb-4 "> Initials</h2>
                    <div>
                      <label className="block mb-2 text-xs">Power Start Time:</label>
                      <input
                        type="text"
                        name="powerStartTime"
                        value={editData.powerStartTime || "N/A"}

                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Red Phase :</label>
                      <select
                        type="text"
                        name="r"
                        value={editData.r ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Source:</label>
                      <input
                        type="text"
                        name="source"
                        value={editData.source || "N/A"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Timer in action:</label>
                      <select
                        type="text"
                        name="timerInAction"
                        value={editData.timerInAction ? "Yes" : "No"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Voltage Fault:</label>
                      <select
                        name="voltageFault"
                        value={editData.voltageFault ? "Yes" : "No"}


                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 text-xs">Yellow Fault:</label>
                      <select
                        name="y"
                        value={editData.y ? "Yes" : "No"}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-2 mb-2 font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div> */}


                    {/* Edit/Save buttons */}
                    {/* {!isEditing ? (
                      <button
                        onClick={toggleEdit}
                        className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex mt-4">
                        <button
                          onClick={addupdate}
                          className="px-6 py-2 mr-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        >
                          Save
                        </button>
                        <button
                          onClick={toggleEdit}
                          className="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                        >
                          Cancel
                        </button>
                      </div>
                    )} */}


                  {/* </div> */}
                </div>
              )
            }
          </div>
        ) : (
          <>
          {/* sketelon ui */}
          
          
          </>
        )}
    
    </>
    
  );
};
export default DeviceData;