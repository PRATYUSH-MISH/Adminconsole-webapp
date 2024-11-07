import  {useParams} from 'react-router-dom'
import { ref, onValue } from "firebase/database";

import { db } from '../firebase';
import { useState,useEffect } from 'react';
import OrdersNew from './OrderstableData';
const CoustomerM=()=>{
const {orderId}=useParams()
    const [customerData, setCustomerData] = useState(null);
    const [customerDetails, setCustomerDetails] = useState(null);


    useEffect(() => {
        if (orderId) {
            // Reference the customer data in Firebase Realtime Database
            const customerRef = ref(db, `customers/${orderId}`)
            const detailsRef = ref(db, `customerDetails/${orderId}`);
            // Fetch data from the database
            onValue(customerRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCustomerData(data);
                } else {
                    console.log('No data available for this orderId');
                }
            }, (error) => {
                console.error("Error fetching data:", error);
            });
            // Fetch data from the customerDetails node
            onValue(detailsRef, (snapshot) => {
                if (snapshot.exists()) {
                    const details = snapshot.val();
                    setCustomerDetails(details);
                } else {
                    console.log('No data available for this orderId in customerDetails');
                }
            }, (error) => {
                console.error("Error fetching customer details:", error);
            });




        }
    }, [orderId]);
    if (!customerData ||  !customerDetails) {
        return(
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        )
    }
    const { email} = customerData;
    const {
        alternatePhoneNo,
        billingAddress,
        shippingAddress,
        type,
        businessName,
        gstNo
    } = customerDetails || {};
    return (


        <>
            <div className="max-w-md mx-auto bg-[#333333] shadow-lg rounded-lg overflow-hidden my-4">
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2 text-white">Customer Details</div>
                    <p className=" text-base text-white"><strong>Email:</strong> {email}</p>
                    {customerDetails && (
                        <>
                            <p className="text-white text-base"><strong>Alternate Phone No:</strong> {alternatePhoneNo}</p>
                            <p className="text-white text-base"><strong>Billing Address:</strong> {billingAddress}</p>
                            <p className="text-white text-base"><strong>Shipping Address:</strong> {shippingAddress}</p>
                            {type === 'Business' && (
                                <>
                                    <p className="text-white text-base"><strong>Business Name:</strong> {businessName}</p>
                                    <p className="text-white text-base"><strong>GST No:</strong> {gstNo}</p>
                                </>
                            )}
                        </>
                    )}




                </div>

            </div>


            <OrdersNew />



        </>
    );

}
export default CoustomerM