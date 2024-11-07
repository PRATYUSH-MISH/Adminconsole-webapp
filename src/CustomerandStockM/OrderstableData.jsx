import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileArrowUp, faTrash, } from '@fortawesome/free-solid-svg-icons';
import { ref, onValue, update, set } from "firebase/database";
import { uploadBytesResumable, getDownloadURL, ref as storageRef } from "firebase/storage";
import { db, storage } from '../firebase';
import Portal from './Portals';
import { useState, useEffect } from 'react';
import OrderRemark from './OrderRemark'
import DeviceRemark from './DeviceRemarks'
import { toast, ToastContainer } from 'react-toastify';
const OrdersNew = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const phoneNo = queryParams.get('phoneNo');
    const { orderId } = useParams();
    const [orders, setOrders] = useState([]);
    const [files, setFiles] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});
    const [showProgressBar, setShowProgressBar] = useState({});
    const [macAddressesData, setMacAddressesData] = useState([]);
    const [imeiDetails, setImeiDetails] = useState([]);
    const [deleteOrder, setDeleteOrder] = useState(null)
    const [deleteDevice, setDeleteDevice] = useState(null);
    ///
    const [newItem, setNewItem] = useState('');
    const [showAddOrder, setShowAddOrder] = useState(false);
    const initialFormData = {
        amountDue: '',
        date: '',
        totalAmount: '',
        invoiceId: '',
        channel: '',
        salesPersonName: '',
        orderItems: [] // Array to hold items
    };
    const [formData, setFormData] = useState(initialFormData)
    // Function to reset form data
    const resetFormData = () => {
        setFormData(initialFormData);
        setNewItem(''); // Reset the new item input field
    };
    const handleShowAddOrder = () => {
        resetFormData(); // Reset the form data when opening the form
        setShowAddOrder(true); // Show the form
    };

    const handleAddInput = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }
    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItem.trim()) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                orderItems: [...prevFormData.orderItems, newItem],
            }));
            setNewItem(''); // Reset new item input field
        }
    };
    const handleAddOrder = async () => {

        const { amountDue, date, totalAmount, invoiceId, channel, salesPersonName, orderItems } = formData;
        if (!amountDue || !date || !totalAmount || !invoiceId || !channel || !salesPersonName || orderItems.length === 0) {
            toast.error("Please fill all fields and add at least one order item.", {
                theme: "dark",
                autoClose: 2000,

            });
            return; // Prevent further execution if validation fails
        }

        const uniqueOrderId = `O${Math.floor(10000000 + Math.random() * 90000000)}`;// e.g., O1728542971
        try {
            const newOrderRef = ref(db, `ordersNew/${uniqueOrderId}`);
            await set(newOrderRef, {
                ...formData,
                customerId: orderId // Save the orderId directly as customerId
            });
            toast.success("Order added successfully!", {
                theme: "dark",
                autoClose: 2000,

            });
            setShowAddOrder(false); // Close the portal
        } catch (error) {
            console.error("Error adding order:", error);
            toast.error("Failed to add order. Please try again.", {
                theme: "dark",
                autoClose: 2000,

            });
        }
    }

    useEffect(() => {

        const ordersRef = ref(db, 'ordersNew');
        onValue(ordersRef, (snapshot) => {
            const ordersData = [];
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    const data = childSnapshot.val();

                    if (data.customerId === orderId) {
                        ordersData.push({
                            id: childSnapshot.key,
                            ...data,
                        });
                    }
                });
                setOrders(ordersData);
            } else {
                console.log('No orders available');
            }
        }, (error) => {
            console.error("Error fetching data:", error);
        });
    }, [orderId]);
    const handleRemoveItem = (index) => {
        setFormData((prevFormData) => {
            const updatedOrderItems = prevFormData.orderItems.filter((_, i) => i !== index);
            return { ...prevFormData, orderItems: updatedOrderItems };
        });
    };

    useEffect(() => {
        if (phoneNo) {
            const userRef = ref(db, `users/${phoneNo}`);

            onValue(userRef, (snapshot) => {
                const userData = snapshot.val();

                if (userData) {

                    const macData = Object.entries(userData)
                        .filter(([key]) => key.includes(":"));

                    const dataPromises = macData.map(([macAddress]) => {
                        return new Promise((resolve) => {
                            const macRef = ref(db, `users/${phoneNo}/${macAddress}`);
                            onValue(macRef, (macSnapshot) => {
                                const macDetails = macSnapshot.val();
                                // Convert first_start from epoch to a readable date
                                const firstStartDate = macDetails?.first_start
                                    ? new Date(macDetails.first_start).toLocaleString()
                                    : null;
                                const rechargedate = macDetails?.recharge_validity ? new Date(macDetails.recharge_validity).toLocaleString()
                                    : null

                                resolve({
                                    macAddress,
                                    first_start: firstStartDate,
                                    referralCode: macDetails?.referralCode,
                                    recharge_validity: rechargedate,
                                });
                            });
                        });
                    });



                    Promise.all(dataPromises).then(data => {
                        setMacAddressesData(data);

                        const macAddresses = data.map(item => item.macAddress);
                        fetchImeiDetails(macAddresses);
                    });

                }
            });
        }
    }, [phoneNo]);

    const fetchImeiDetails = (macAddresses) => {
        const imeiRef = ref(db, 'qr/admin');

        onValue(imeiRef, (snapshot) => {
            const imeiData = snapshot.val();
            const imeiResults = [];

            if (imeiData) {
                Object.entries(imeiData).forEach(([imei, data]) => {
                    if (data.mac && (Array.isArray(data.mac) || typeof data.mac === 'string')) {
                        const macsToCheck = Array.isArray(data.mac) ? data.mac : [data.mac];

                        const foundMacs = macsToCheck.filter(mac => macAddresses.includes(mac));

                        if (foundMacs.length > 0) {
                            imeiResults.push({
                                imei,
                                model: data.model,
                                serialNo: data.serialNo,
                                isDeleted: data.isDeleted || false,
                                foundMacs // Optional
                            });
                            // If the item is marked as deleted, add it to deletedItems
                            if (data.isDeleted) {
                                setDeletedItems(prev => new Set(prev).add(imei));
                            }
                        }
                    }

                });
            }
            setImeiDetails(imeiResults);
        });
    };






    const handleFileChange = (orderId) => (e) => {
        const file = e.target.files[0];
        if (file) {
            setFiles((prevFiles) => ({ ...prevFiles, [orderId]: file }));
        }
    };

    const uploadFile = (orderId, file) => {
        return new Promise((resolve, reject) => {
            const storageReference = storageRef(storage, `customers_bills/${orderId}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageReference, file);

            setShowProgressBar((prevVisibility) => ({ ...prevVisibility, [orderId]: true }));

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress((prevProgress) => ({ ...prevProgress, [orderId]: progress }));
                },
                (error) => {
                    toast.error(`Upload failed: ${error.message}`, {
                        theme: "dark",
                        autoClose: 2000,

                    });
                    reject(error);
                },
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    const order_refer = ref(db, `ordersNew/${orderId}`);
                    await update(order_refer, { bills: url });

                    toast.success(`Upload Successful for OrderID: ${orderId}`), {
                        theme: "dark",
                        autoClose: 2000,

                    };
                    setUploadProgress((prevProgress) => ({ ...prevProgress, [orderId]: 100 }));

                    setTimeout(() => {
                        setShowProgressBar((prevVisibility) => ({ ...prevVisibility, [orderId]: false }));
                        setUploadProgress((prevProgress) => ({ ...prevProgress, [orderId]: 0 }));
                    }, 5000); // 5 seconds

                    resolve();
                }
            );
        });
    };

    const handleFileUpload = (orderId) => {
        const file = files[orderId];
        if (!file) {
            toast.error('Please select a file!');
            return;
        }
        uploadFile(orderId, file);
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const order_refer = ref(db, `ordersNew/${orderId}`);
            await update(order_refer, { isDeleted: true });
            toast.success(`Order ${orderId} marked as deleted.`, {
                theme: "dark",
                autoClose: 2000,

            });
        } catch (error) {
            toast.error(`Failed to delete order: ${error.message}`, {
                theme: "dark",
                autoClose: 2000,

            });
        }
        finally {
            setDeleteOrder(null)
        }
    };


    const [deletedItems, setDeletedItems] = useState(new Set());
    /////////////////
    const handleDelete = async (imei) => {
        try {
            const order_refer = ref(db, `qr/admin/${imei}`);
            await update(order_refer, { isDeleted: true });
            setDeletedItems(prev => new Set(prev).add(imei));

            toast.success(`Order ${imei} marked as deleted.`, {
                theme: "dark",
                autoClose: 2000,

            });
        } catch (error) {
            toast.error(`Failed to delete order: ${error.message}`, {
                theme: "dark",
                autoClose: 2000,
            });
        }
        finally {
            setDeleteDevice(null)
        }
    };
    return (
        <div className="max-w-6xl mx-auto ">  <ToastContainer />
            <h2 className="text-lg font-semibold my-4 text-white">Orders for Customer ID: {orderId} </h2>
            <div className='flex justify-end items-end '>
                <button type='button'
                    onClick={handleShowAddOrder}
                    className="px-4 py-2 mb-2 rounded-lg text-xs text-white font-medium bg-blue-600"
                >
                    Add Order
                </button>
            </div>
            <table className="min-w-full bg-[#494F55] border border-gray-300  divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-[#333333] dark:bg-gray-800  ">
                    <tr>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 pl-2  py-3 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3 ">

                                <span>ID</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Date</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className=" flex items-center gap-x-3">

                                <span>Order Items</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Total Amount</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Amount Due</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Invoice ID</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Channel</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200 px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className=" flex items-center gap-x-3">

                                <span>Sales Person Name</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Invoice</span>
                            </div>
                        </th>
                        <th scope="col" className="px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Delete Order</span>
                            </div>
                        </th>
                        <th scope="col" className="border border-gray-300  divide-y divide-gray-200  px-4 text-xs font-semibold text-left rtl:text-right text-white dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Remark</span>
                            </div>
                        </th>

                    </tr>
                </thead>
                {showAddOrder && (
                    <Portal onClose={() => setShowAddOrder(false)}>
                        <ToastContainer />
                        <h2 className="text-lg font-medium text-white dark:text-white mb-4 ">Add New Order</h2>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Amount Due </strong>
                            <input
                                type="number"
                                name="amountDue"
                                value={formData.amountDue}
                                onChange={handleAddInput}
                                className="ml-3 border block w-full text-white bg-[#494F55]  rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right  dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Date of Order</strong>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleAddInput}
                                className="ml-1 border block w-full bg-[#494F55] rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Total Amount</strong>
                            <input
                                type="number"
                                name="totalAmount"
                                value={formData.totalAmount}
                                required
                                onChange={handleAddInput}
                                className="ml-1 border block w-full bg-[#494F55] rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Invoice ID</strong>
                            <input
                                type="text"
                                name="invoiceId"
                                value={formData.invoiceId}
                                required
                                onChange={handleAddInput}
                                className="ml-6 border block w-full bg-[#494F55] rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Enter Amount"
                            />
                        </div>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Channel</strong>
                            <input
                                type="text"
                                name="channel"
                                value={formData.channel}
                                required
                                onChange={handleAddInput}
                                className="ml-8 border block w-full bg-[#494F55] rounded text-xs mb-2 px-3 py-1 my-1 font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Provide channel of Sales"
                            />
                        </div>

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Salesperson</strong>
                            <input
                                type="text"
                                name="salesPersonName"
                                value={formData.salesPersonName}
                                required
                                onChange={handleAddInput}
                                className="ml-3 border block w-full bg-[#494F55] rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
                                placeholder="Enter Name"
                            />
                        </div>

                        {/* Order Items Input */}

                        <div className='flex whitespace-nowrap'>
                            <strong className='font-thin text-xs mt-2 text-white'>Items</strong>
                            <input
                                type="text"
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                required

                                placeholder="Enter Order Item"
                                className="ml-12 border block w-full bg-[#494F55] rounded mb-2 px-3 py-1 my-1 text-xs font-normal text-left rtl:text-right text-white dark:text-gray-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"

                            />

                        </div>

                        <div>
                            {/* List of order items with remove functionality */}
                            <ul className="list-disc pl-5">
                                {formData.orderItems.map((item, index) => (
                                    <li key={index} className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                                        {item}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="ml-2 text-red-600 hover:text-red-800"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className='flex whitespace-nowrap justify-center m-2' >
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="px-4 py-2 font-medium tracking-wide text-white hover:bg-blue-500 bg-blue-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            >
                                Add Item
                            </button>
                        </div>

                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                type="button"
                                onClick={handleAddOrder}
                                className="px-2 py-2 font-medium tracking-wide hover:bg-green-400 text-white capitalize transition-colors duration-300 transform bg-green-600 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                            >
                                Save Order
                            </button>
                        </div>


                        

                        
                    </Portal>
                )}


                {deleteOrder && (
                    <Portal onClose={() => setDeleteOrder(null)}>
                        <h2 className="text-lg font-medium  text-white dark:text-white mb-4">⚠️Confirm Delete⚠️</h2>
                        <p className="text-sm text-white dark:text-gray-300">Are you sure you want to delete this order?</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={() => handleDeleteOrder(deleteOrder)}
                                className="px-5 py-2 hover:bg-blue-500 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                            >
                                Confirm
                            </button>
                        </div>
                    </Portal>
                )
                }

                {deleteDevice && (
                    <Portal onClose={() => setDeleteDevice(null)}>
                        <h2 className="text-lg font-medium text-white dark:text-white mb-4 ">⚠️Confirm Delete⚠️ </h2>
                        <p className="text-sm text-white dark:text-gray-300">Are you sure you want to delete this Device?</p>
                        <div className="mt-4 flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(deleteDevice)}
                                className="px-5 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 hover:bg-blue-400 rounded-lg focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
                            >
                                Confirm
                            </button>
                        </div>

                    </Portal>
                )

                }

                {/* Add Remark Portal */}


                <tbody>
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order.id}
                                className={order.isDeleted ? 'opacity-50 pointer-events-none' : ''}

                            >
                                <td className="border border-gray-300  divide-y divide-gray-200 px-2 py-2 text-xs font-medium  whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                        <div className="flex items-center ">
                                            <h2 className="font-medium text-white dark:text-white ">{order.id}</h2>
                                        </div>
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white ">
                                        {order.date}
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white ">
                                        {order.orderItems.join(', ')}
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white ">
                                        {order.totalAmount}
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white">
                                        {order.amountDue}
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white">
                                        {order.invoiceId}
                                    </div>
                                </td>

                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white">
                                        {order.channel}
                                    </div>
                                </td>


                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white">
                                        {order.salesPersonName}
                                    </div>
                                </td>


                                <td className=" py-2 px-3">
                                    {!order.isDeleted && (
                                        <>
                                            <input type="file" id={`fileInput-${order.id}`} className='hidden' onChange={handleFileChange(order.id)} />
                                            <button
                                                onClick={() => document.getElementById(`fileInput-${order.id}`).click()}
                                                className=" px-1 mr-2 py-1 mt-2 font-medium text-blue-600"
                                            >
                                                <FontAwesomeIcon icon={faFileArrowUp} className='text-sm text-white ' />
                                            </button>
                                            {
                                                order.bills ? (
                                                    <>
                                                        <a href={order.bills}
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} className='text-sm mr-2 text-white ' />

                                                        </a>

                                                    </>
                                                ) : ("")

                                            }
                                            <button
                                                onClick={() => handleFileUpload(order.id)}
                                                className=" px-1 py-1 mt-2 rounded-lg text-xs text-white bg-green-600"
                                            >
                                                Upload
                                            </button>


                                            {showProgressBar[order.id] && (
                                                <div className="mt-2">
                                                    <div className="bg-gray-200 h-2">
                                                        <div
                                                            className="bg-blue-500 h-2"
                                                            style={{ width: `${uploadProgress[order.id] || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span>{uploadProgress[order.id]?.toFixed(0)}%</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </td>
                                <td className=" py-3 px-4 flex justify-center">
                                    <button
                                        onClick={() => setDeleteOrder(order.id)}
                                        className=" text-red-500 px-2 py-1 rounded"
                                        disabled={order.isDeleted}
                                    >
                                        <FontAwesomeIcon icon={faTrash} className='text-sm' />
                                    </button>
                                </td>
                                {/*  */}
                                <td className="border border-gray-300  divide-y divide-gray-200 px-1 py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center text-white ">

                                        <OrderRemark orderId={order.id} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="py-2 px-4 border text-center text-white">No orders found for this customer.</td>
                        </tr>
                    )}






                </tbody>
            </table>
            <h2 className="text-lg font-semibold my-4 text-white">Device Details </h2>
            <table className="min-w-full bg-[#333333] border border-gray-300  divide-y divide-gray-200 dark:divide-gray-700">
                <thead >
                    <tr>
                        <th scope="col" className=" px-4 py-3 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="flex text-white items-center gap-x-3">

                                <span>MAC Address</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>First Start</span>
                            </div>
                        </th>
                        <th scope="col" className="text-white px-4 text-xs font-semibold text-left rtl:text-right  dark:text-gray-400">
                            <div className="flex items-center gap-x-3">

                                <span>Referral Code</span>
                            </div>
                        </th>
                        <th scope="col" className="text-white px-4 text-xs font-semibold text-left rtl:text-right  dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>IMEI</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>Recharge Validity</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>Model</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>SerialNo</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>Remark</span>
                            </div>
                        </th>
                        <th scope="col" className=" px-4 text-xs font-semibold text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <div className="text-white flex items-center gap-x-3">

                                <span>Delete</span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {macAddressesData.map(({ macAddress, first_start, referralCode, recharge_validity }) => {
                        const imeiDetail = imeiDetails.find(imeiEntry => {
                            return imeiEntry.foundMacs && imeiEntry.foundMacs.includes(macAddress);
                        }) || {};

                        const isDeleted = deletedItems.has(imeiDetail.imei);
                        const rowClass = isDeleted ? 'opacity-50 pointer-events-none' : '';

                        return (
                            <tr key={macAddress} className={rowClass} >
                                <td className="px-1 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className=" flex items-center ">
                                        {macAddress || '-'}
                                    </div>
                                </td>
                                <td className="px-1 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {first_start || '-'}
                                    </div>
                                </td>
                                <td className="px-7 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {referralCode || '-'}
                                    </div>
                                </td>
                                <td className="px-1 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {imeiDetail.imei || '-'}
                                    </div>
                                </td>
                                <td className="px-6 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {recharge_validity || '-'}
                                    </div>
                                </td>
                                <td className="px-6 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {imeiDetail.model || '-'}
                                    </div>
                                </td>
                                <td className="px-4 text-white bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {imeiDetail.serialNo || '-'}
                                    </div>
                                </td>
                                <td className="px-4 bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {/* here comes device remark */}
                                        <DeviceRemark imei={imeiDetail.imei} />


                                    </div>
                                </td>
                                <td className="px-4 bg-[#494F55] py-2 text-xs whitespace-nowrap">
                                    <div className="flex items-center ">
                                        {!isDeleted && (
                                            <button
                                                onClick={() => setDeleteDevice(imeiDetail.imei)}
                                                className=" text-red-500 px-2 py-1 rounded"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className='text-sm' />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

        </div>
    );
}

export default OrdersNew;
