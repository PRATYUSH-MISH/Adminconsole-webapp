import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ref, onValue,update, remove, set } from "firebase/database";

import { db,} from '../firebase';
import Portal from './Portals';
import CustomerRemark from './CoustmerRemark'
import { Link } from 'react-router-dom';
import { setOrders } from '../UserandDeviceData/Store';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const CustomerM = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector(state => state.orders)
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [enteredOrderId, setEnteredOrderId] = useState('');
  const [formData, setFormData] = useState({}); 
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingOrder, setIsAddingOrder] = useState(false); // State to toggle the portal
  const [orderData, setOrderData] = useState({
    customerId: '',
    name: '',
    email: '',
    phoneNo: '',
    alternatePhoneNo: '',
    shippingAddress: '',
    billingAddress: '',
    type: 'Individual', 
    businessName: '',
    gstNo: '',
    date: '',
    totalSales: '',
  });
  // Function to handle form input changes
  const handleNewOrderData = (e) => {
    const { name, value } = e.target;
    setOrderData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

// Show all or only the first one

//////////////////////////////////////////////////////
  useEffect(() => {
    const ordersRef = ref(db, 'customers/');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      dispatch(setOrders(data || {}));
    });
  }, [dispatch]);

  const handleDeleteorderClick = (orderId) => {
    setDeleteOrder(orderId);
    setEnteredOrderId(''); // Clear the input field
  };
  const [userRole, setUserRole] = useState(null);
  useEffect(()=>{
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }

  },[])

  const handleDelete = async (orderId) => {
    //console.log('Current user role:', userRole); // Log the userRole
    if (userRole !== 'admin' && userRole !== 'manager') {
      toast.error('Unauthorized: Only admins or managers can delete orders.', {
        theme: "dark",
        autoClose: 2000,

      });
      return;
    }

    if (enteredOrderId !== deleteOrder) {
      toast.error('Order ID does not match!', {
        theme: "dark",
        autoClose: 2000,

      });
      return;
    }
    try {
      // Delete storage associated with the order
     // const db = getDatabase();

      // Reference to the specific order in ordersNew
      //const orderRef = ref(db, `ordersNew/${orderId}`);
      //const orderSnapshot = await get(orderRef);

      // // Reference to list files in Firebase storage
       //const listResults = await storageRef.listAll();

      // // Delete each file in the directory
      //await Promise.all(listResults.items.map((itemRef) => deleteObject(itemRef)));

      // // Delete the order details from Firebase Database
      //const db = getDatabase();

      // Remove from customerDetails collection
      const customerDetailsRef = ref(db, `customerDetails/${orderId}`);
      await remove(customerDetailsRef);

      // Remove from customers collection
      const customerRef = ref(db, `customers/${orderId}`);
      await remove(customerRef);

      // Reset state
      setDeleteOrder(null);
      setEnteredOrderId(''); // Clear the input after deletion
      toast.success('Order deleted successfully!', {
        theme: "dark",
        autoClose: 2000,

      });
    } catch (error) {
      toast.error(`Failed to delete order or storage: ${error.message}`);
    }
  }
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveEditedOrder = async (orderId) => {
    try {
      const orderRef = ref(db, `orders/${orderId}/orderDetails/`);
      await update(orderRef, formData);
      toast.success(`Order ${orderId} updated successfully`, {
        theme: "dark",
        autoClose: 2000,

      });
      setEditingOrder(null);
    } catch (error) {
      toast.error(`Failed to update order: ${error.message}`, {
        theme: "dark",
        autoClose: 2000,

      });
    }
  };

  //delete
 
  //const customerId = orderData.customerId;
  const addOrder = (e) => {
    e.preventDefault()
        if (!orderData.customerId) {
          toast.error('Customer ID is required', {
            theme: "dark",
            autoClose: 2000,

          });
      return;
    }
    const customerId = orderData.customerId;
    const newOrder = {
      alternatePhoneNo: orderData.alternatePhoneNo,
      billingAddress: orderData.billingAddress,
      businessName: orderData.businessName,
      gstNo: orderData.gstNo,
      type: orderData.type,
      shippingAddress: orderData.shippingAddress,
    };
    const orderRef = ref(db, `customerDetails/${customerId}`);
    set(orderRef, newOrder)
      .then(() => {
        const customerDetails = {
          date: orderData.date,
          email: orderData.email,
          name: orderData.name,
          phoneNo: orderData.phoneNo,
          totalSales: orderData.totalSales,
        };
        const customerRef = ref(db, `customers/${customerId}`);
// Add customer personal details to customers
        return set(customerRef, customerDetails);
      })
      .then(() => {
        toast.success('Order and customer details added successfully');
        setOrderData({
          customerId: '', // Reset customerId as well
          alternatePhoneNo: '',
          billingAddress: '',
          businessName: '',
          gstNo: '',
          type: '',
          shippingAddress: '',
          date: '',
          email: '',
          name: '',
          phoneNo: '',
          totalSales: '',
        });
        setIsAddingOrder(false); 
      })
      .catch((error) => {
        console.error("Error adding order or customer details:", error);
      });
  };
  const [isSameAddress, setIsSameAddress] = useState(false);
  const handleSameAddressChange = () => {
    setIsSameAddress(!isSameAddress);
    if (!isSameAddress) {
      setOrderData((prevState) => ({
        ...prevState,
        billingAddress: prevState.shippingAddress,
      }));
    } else {
      setOrderData((prevState) => ({
        ...prevState,
        billingAddress: '',
      }));
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
 const filteredOrders = Object.keys(orders).filter(orderId => {
    const customerData = orders[orderId]

    const customerId = customerData.customerId; // Access customerId directly
    const phoneNo=customerData.phoneNo;
    //console.log("phone",phoneNo);
    
    const customerIdString = (customerId || "").toString().toLowerCase();

   //const phoneNoString = (phoneNo || "").toString().toLowerCase();// Remove non-numeric characters like "+"
   const phoneNoString = (phoneNo || "").replace(/[^\d]/g, ""); // Remove non-numeric characters from phone number

   //console.log(`Phone number for order ${orderId}: ${phoneNoString}`);
   const cleanedSearchTerm = searchTerm.replace(/[^\d]/g, "");
   //console.log(`Cleaned phone number: ${phoneNoString}, Cleaned search term: ${cleanedSearchTerm}`);

    return (
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerIdString.toLowerCase().includes(searchTerm.toLowerCase())||
      phoneNoString.includes(cleanedSearchTerm) 
    );
  });
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <>
      
      <section className="container px-4 mx-auto h-full">

        <div className="  gap-x-3">
          <h2 className="text-2xl  font-medium text-white dark:text-white">Order Details</h2>
        </div>
        <div className='flex justify-end h-12'>

          <button
            type='button'
            onClick={() => setIsAddingOrder(true)}
            className="text-white bg-[#2977a4] hover:bg-gradient-to-bl focus:ring-4 
             focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium
              rounded-lg text-sm px-5 py-1 text-center me-2 mb-4 "
          >
            Add Records
          </button>
          <input
            type="text"
            placeholder=" Search by ID"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="border text-white p-2 mb-4 bg-[#494F55] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col ">
          <div className="-mx-3  -my-2 overflow-x-auto  sm:-mx-6 lg:-mx-8">
            <div className="inline-block w-[100%] py-2  align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border  border-gray-200 dark:border-gray-700 md:rounded-lg">
                <table className="min-w-full divide-y rounded-xl  divide-gray-200  dark:divide-gray-700">
                  <thead className="rounded-xl bg-[#2F2F2F] text-white dark:bg-gray-800">
                    <tr>
                      <th scope="col" className=" py-3.5 px-2 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex justify-start">

                          <span>Customer ID</span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-4 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Name</span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-4 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Ph. No.</span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-4 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Date</span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-2 text-sm font-normal text-left rtl:text-left  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Total Sales</span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-4 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Remark </span>
                        </div>
                      </th>
                      <th scope="col" className=" py-3.5 px-1 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">
                        <div className="flex items-center gap-x-3">

                          <span>Delete </span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#494F55] divide-y divide-grey-500 dark:divide-gray-700 dark:bg-gray-900">
                    {
                      currentOrders.length > 0 ? (
                        currentOrders.map((orderId) => {                     
                          const customerDetails = orders[orderId];                     
                          const customerIdString = (customerDetails.customerId || "").toString().toLowerCase(); // Ensure customerId is a string
                          if (orderId.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
                            ||
                            customerIdString.includes(searchTerm.toLowerCase())
                          )
                            return (
                              <tr key={orderId}>
                                <td className="px-2 py-2 text-xs font-medium text-gray-700 whitespace-nowrap">
                                  <Link to={`/order/${orderId}?phoneNo=${encodeURIComponent(customerDetails?.phoneNo)}`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    <div className="inline-flex items-center gap-x-3">
                                      <div className="flex items-center ">
                                        <h2 className="font-medium text-white hover:text-blue-500 hover:underline dark:text-white ">{orderId}</h2>
                                      </div>
                                    </div>
                                  </Link>
                                </td>
                                <td className="px-1 py-2 text-xs whitespace-nowrap">
                                  <div className="flex text-white items-center ">
                                    {customerDetails?.name}
                                  </div>
                                </td>                         
                                <td className="px-1 py-2 text-xs whitespace-nowrap">
                                  <div className="flex text-white items-center ">
                                    {customerDetails?.phoneNo}
                                  </div>
                                </td>                           
                                <td className="px-1 py-2 text-xs whitespace-nowrap">
                                  <div className="flex text-white items-center">
                                    {customerDetails?.date}
                                  </div>
                                </td>

                                <td className="px-3 py-2 text-xs whitespace-nowrap">
                                  <div className="flex text-white items-center">
                                    {customerDetails?.totalSales}
                                  </div>
                                </td>   
                                <td className=" py-2 text-xs ">
                                  <div className="justify-evenly text-white flex-col">
                                 
                                    <CustomerRemark 
                                    customerDetails={customerDetails} 
                                    customerId={orderId}
                                     />


                                  </div>
                                </td>       
                                <td className="px-3 py-2 text-xs whitespace-nowrap">
                                  <div className="flex items-center">
                                    <button
                                      onClick={() => handleDeleteorderClick(orderId)}
                                      className=" px-1 py-1 font-medium text-white rounded-md  focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
                                    >
                                      <FontAwesomeIcon icon={faTrash} className='text-red-600 text-sm hover:text-red-500' />

                                    </button>
                                  </div>
                                </td>   

                              </tr>
                            );
                        })
                      ) : (
                        <tr>
                          <td colSpan="10" className="text-center  px-4 py-4">No orders found.</td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination start here */}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">


            <span>
              previous
            </span>
          </button>

          {Array.from({ length: Math.ceil(Object.keys(orders).length / ordersPerPage) }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`px-4 py-2 mx-1 rounded-md transition-colors duration-300 transform ${currentPage === pageNumber
                ? 'bg-blue-500 text-white dark:bg-blue-400'
                : 'bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(Object.keys(orders).length / ordersPerPage)}
            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800">
            <span>
              Next
            </span>
          </button>

        </div>

      </section>
      {/*  ADDING editing and deleteing portals */}
      {isAddingOrder && (
        <Portal onClose={() => setIsAddingOrder(null)}>
          <ToastContainer/>
          <h2 className="text-sm font-semibold text-white">Add New Order</h2>
        
          <div className="mt-4 ">
            {/* Form fields */}

            <div className='flex whitespace-nowrap'>
              <strong className='font-thin text-xs mt-2 text-white'>Cust ID: </strong>
              <input
                type="text"
                name="customerId"
                value={orderData.customerId || ''}
                onChange={handleNewOrderData}
                className="ml-4 border bg-[#494F55] block w-full rounded mb-2 px-3 py-1 my-1 text-sm font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="CustomerId"
              />
            </div>
            <div className='flex'>
              <strong className='font-thin text-xs mt-2 text-white'>Name: </strong>
              <input
                type="text"
                name="name"
                value={orderData.name || ''}
                onChange={handleNewOrderData}
                className="ml-6 block w-full px-3 py-1 bg-[#494F55] rounded my-1 border text-sm font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="Name"
              />
            </div>
            <div className='flex'>
              <strong className='font-normal  text-xs mt-2 text-white'>Email: </strong>
              <input
                type="email"
                name="email"
                value={orderData.email || ''}
                onChange={handleNewOrderData}
                className="ml-7 block w-full px-4 py-1 bg-[#494F55] rounded my-1 border text-sm font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder='Email'
              />
            </div>
            <div className='flex'>
              <strong className='font-thin text-white  text-xs mt-2'>Ship. Address:  </strong>
              <input
                type="text"
                name="shippingAddress"
                value={orderData.shippingAddress || ''}
                onChange={handleNewOrderData}
                className=" block w-full  px-3 py-1 border text-white bg-[#494F55] rounded my-2 text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="Shipping Address"
              />
            </div>
            <div className="flex items-center mt-4 mb-3">
              <input
                type="checkbox"
                checked={isSameAddress}
                onChange={handleSameAddressChange}
                className="form-checkbox "
              />
              <span className="ml-2 text-xs font-semibold text-white">Billing address is the same as shipping address</span>
            </div>
            <div className="flex">
              <strong className="font-normal text-xs mt-1 text-white">Bill. Address: </strong>
              <input
                type="text"
                name="billingAddress"
                value={orderData.billingAddress || ''}
                onChange={handleNewOrderData}
                className="ml-3 block w-full text-white bg-[#494F55] px-3 py-1 rounded my-2 border text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="Billing Address"
                disabled={isSameAddress}
              />
            </div>
            <div className='flex'>
              <strong className='font-normal text-xs my-2 text-white'>Type: </strong>
              <div className="ml-3 flex items-center space-x-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Individual"
                    checked={orderData.type === 'Individual'}
                    onChange={handleNewOrderData}
                    className="form-radio"
                  />
                  <span className="ml-2 text-xs text-white">Individual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="Business"
                    checked={orderData.type === 'Business'}
                    onChange={handleNewOrderData}
                    className="form-radio"
                  />
                  <span className="ml-2 text-xs text-white">Business</span>
                </label>
              </div>
            </div>
            {/* Conditionally render businessName and gstNo fields if 'Business' is selected */}
            {orderData.type === 'Business' && (
              <>
                <div className='flex'>
                  <strong className='font-normal text-xs my-2 text-white'>Business Name: </strong>
                  <input
                    type="text"
                    name="businessName"
                    value={orderData.businessName || ''}
                    onChange={handleNewOrderData}
                    className="ml-1 block w-full px-2 my-2 text-white bg-[#494F55] rounded border text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                    placeholder="Business Name"
                  />
                </div>
                <div className='flex'>
                  <strong className='font-normal text-xs my-2 text-white'>GST No: </strong>
                  <input
                    type="text"
                    name="gstNo"
                    value={orderData.gstNo || ''}
                    onChange={handleNewOrderData}
                    className="ml-8 block w-full px-2 my-2 bg-[#494F55] rounded border text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                    placeholder="GST No."
                  />
                </div>
              </>
            )}
            <div className='flex'>
              <strong className='font-normal  text-xs my-2 text-white'>Date: </strong>
              <input
                type="date"
                name="date"
                value={orderData.date || ''}
                onChange={handleNewOrderData}
                className="ml-9 block w-full px-2 my-2 bg-[#494F55] border rounded text-sm font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"

              />
            </div>
            <div className='flex whitespace-nowrap'>
              <strong className='font-normal text-xs my-3 text-white'>Ph. No: </strong>
              <input
                type="number"
                name="phoneNo"
                value={orderData.phoneNo || ''}
                onChange={handleNewOrderData}
                className="ml-6 block w-full text-white bg-[#494F55] px-4 py-1 border rounded my-2 text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="Phone Number"
              />
            </div>
            <div className='flex whitespace-nowrap'>
              <strong className='font-normal text-xs my-2 text-white '> Alt. Ph. No: </strong>
              <input
                type="number"
                name="alternatePhoneNo"
                value={orderData.alternatePhoneNo || ''}
                onChange={handleNewOrderData}
                className="ml-1 block w-full px-4 py-1 text-white bg-[#494F55] border rounded text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                placeholder="Alternate Phone Number"
              />
            </div>
            <div className='flex justify-center'>
              <button
                type="button"
                onClick={addOrder}
                className="text-white bg-[#2977a4] hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-7 py-2.5 text-center  mt-2 "
              >
                Submit 
              </button>
            </div>
          </div>
        </Portal>
      )
      }
      {editingOrder && (
        <Portal onClose={() => setEditingOrder(null)}>
          <h2 className="text-md font-semibold">Edit Order: {editingOrder}</h2>
          <div className="mt-4 ">
            <div className='flex'>
              <strong className='font-semibold text-sm mt-3  '>Name: </strong>
              <input
                type="text"
                name="Name"
                value={formData.Name || ''}
                onChange={handleInputChange}
                className="ml-5
              block w-full px-4 py-1 mt-2 text-gray-700 bg-white border 
              border-gray-200 rounded-md  text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 
               focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none
                focus:ring"
                placeholder="Name"
              />
            </div>
           <div className='flex'>
              <strong className='font-semibold text-sm mt-3  '>Address: </strong>
              <input
                type="text"
                name="Address"
                value={formData.Address || ''}
                onChange={handleInputChange}
                className="block w-full px-4 py-1 ml-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md
                text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300
                focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Address"
              />
            </div>
            <div className='flex'>
              <strong className='font-semibold text-sm mt-3'>Shipping Date: </strong>
              <input
                type="text"
                name="ShippingDate"
                value={formData.ShippingDate || ''}
                onChange={handleInputChange}
                className="block w-full px-4 -ml-3 py-1 mt-2  bg-white border border-gray-200 rounded-md
                   text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400 focus:ring-blue-300
                focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Shipping Date"
              />
            </div>
            <div className='flex'>
              <strong className='font-semibold text-sm mt-3'>Mobile Number: </strong>
              <input
                type="text"
                name="PhoneNumber"
                value={formData.PhoneNumber || ''}
                onChange={handleInputChange}
                className="block w-full px-4 py-1 -ml-5 mt-2 text-gray-700 bg-white border border-gray-200  text-sm font-normal text-left rtl:text-right dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Phone Number"
              />
            </div>
            <div className='flex'>
              <strong className='font-semibold text-sm mt-3'>Device ID: </strong>
              <input
                type="text"
                name="DeviceId"
                value={formData.DeviceId || ''}
                onChange={handleInputChange}
                className="ml-3
              block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-gray-200  text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Device ID"
              />
            </div>
            <div className='flex'>
              <strong className='font-semibold text-sm mt-3'>Channel: </strong>
              <input
                type="text"
                name="Channel"
                value={formData.Channel || ''}
                onChange={handleInputChange}
                className="ml-2
              block w-full px-4 py-1 mt-2 text-gray-700 bg-white border border-gray-200 text-sm font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                placeholder="Channel"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <button onClick={() => saveEditedOrder(editingOrder)}
                className="px-8 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300 focus:ring-opacity-80">
                Done
              </button>
            </div>
          </div>
        </Portal>
      )}
      {deleteOrder && (
        <Portal onClose={() => setDeleteOrder(null)}>
          <ToastContainer/>
          <h2 className="text-lg font-semibold text-white">Confirm Deletion</h2>
          <p className="mt-2 text-white">Please <strong>TYPE</strong> the OrderID: {deleteOrder} to Delete.</p>
          <input
            type="text"
            value={enteredOrderId}
            onChange={(e) => setEnteredOrderId(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            className="mt-2 p-2 border text-white bg-[#494F55] border-red-500 active:border-blue-500 rounded-lg w-full  "
            placeholder="Enter order ID"
          />
         <div className="mt-3 flex justify-center">
            <button onClick={() => handleDelete(deleteOrder)}
              disabled={enteredOrderId !== deleteOrder} // Disable if IDs don't match
              className={`px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform rounded-lg focus:outline-none focus:ring focus:ring-opacity-80
          ${enteredOrderId === deleteOrder ? 'text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2': 'bg-gray-300 cursor-not-allowed'}`}>
              Confirm
            </button>
          </div>
      </Portal>
      )}
    </>
  );
};
export default CustomerM;