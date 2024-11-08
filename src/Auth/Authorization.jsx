import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, set, get, onValue } from 'firebase/database';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword,onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const Authorization = () => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [users, setUsers] = useState([]);

//pass generator 
const generatorPassword =()=>{
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}


    useEffect(() => {
        // Fetch current user's role
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const roleRef = ref(db, `IAM/${user.email.replace('.', '_')}/role`);
                const snapshot = await get(roleRef);
                if (snapshot.exists()) {
                    setCurrentUserRole(snapshot.val());
                }
            }
        });

        // Fetch all users from database
        const usersRef = ref(db, 'IAM');
        onValue(usersRef, (snapshot) => {
            const usersData = [];
            snapshot.forEach((childSnapshot) => {
                const userData = {
                    email: childSnapshot.key.replace('_', '.'),
                    ...childSnapshot.val(),
                };
                usersData.push(userData);
            });
            setUsers(usersData);
        });
    }, []);

    const handleAssignRole = async () => {
        if (!email || !role) {
            toast.error('Please fill out both email and role fields.',{
        theme:"dark",
        autoClose:2000,
        
      });
            return;
        }
        if (role === "") {
            toast.error("Please select a valid role.",{
        theme:"dark",
        autoClose:2000,
        
      });
            return;
        }

        if (currentUserRole === 'admin' || (currentUserRole === 'manager' && (role === 'manager' || role === 'employee'))) {
           const password =generatorPassword();

           

            try {
                await createUserWithEmailAndPassword(auth, email, password);
                const userEmailKey = email.replace('.', '_');
                const roleRef = ref(db, `IAM/${userEmailKey}/role`);
                await set(roleRef, role);
                toast.success(`Role ${role} assigned to ${email} successfully!`,{
        theme:"dark",
        autoClose:2000,
        
      });
                setEmail('');  // Clear fields after success
                setRole('');
                // Send a welcome email after assigning the role
                sendMail(email,password);
            } catch (error) {
                console.error('Error assigning role:', error);
                toast.error('Failed to assign role.',{
        theme:"dark",
        autoClose:2000,
        
      });
            }
        } else {
            toast.error('Only admins or managers can assign roles. Managers can assign only "manager" or "employee" roles.');
        }
    };

    // Function to send a welcome email
    const sendMail = async (recipientEmail,password) => {
       // console.log ("YOUR EMAIL",recipientEmail)
        try {
            const response = await axios.post('https://own-server-e149.onrender.com/send-email', {
                to: recipientEmail,
                subject: "Welcome to the admin console",
                message: `Welcome to the admin console! Your login credentials are:\n\nEmail: ${recipientEmail}\nPassword: ${password}`,
            });
            toast.success(response.data.message || 'Email sent successfully!',{
                autoClose: 2000,
                position:'top-center',
            });
        } catch (error) {
            console.error("Error sending email:", error);
            toast.error("Failed to send email.",{
        theme:"dark",
        autoClose:2000,
        
      });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <ToastContainer />
            <h2 className="text-white text-2xl font-bold mb-4">Assign Role</h2>
            <div className="mb-6 flex">
                <input
                    type="email"
                    placeholder="User Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border text-white bg-[#333333] rounded p-2 mr-4"
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border text-white bg-[#333333] rounded p-2 mr-4"
                >
                    <option value="">Select Role</option>
                    {currentUserRole === 'admin' && (
                        <>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </>
                    )}
                    {currentUserRole === 'manager' && (
                        <>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </>
                    )}
                </select>
                <button onClick={handleAssignRole} className="bg-[#2977a4] text-white rounded p-2">
                    Assign Role
                </button>
            </div>

            {/* Users Table */}
            
            <table className="min-w-full  text-white divide-y divide-white dark:divide-gray-700 rounded-xl ">
                <thead className="bg-[#2F2F2F] dark:bg-gray-800 rounded-t-xl">
                    <tr>

                        <th 
                            className="  py-3.5  px-2 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">

                            <div className=" flex justify-start">

                                <span> Identifier</span>
                            </div>

                               </th>
                        <th
                            className=" py-3.5 px-2 text-sm font-normal text-left rtl:text-right  dark:text-gray-400">

                            <div className="flex justify-start">

                                <span>  Providers</span>
                            </div>

                        </th>
                        
                        <th
                            className=" py-3.5 px-2 text-sm font-normal text-left rtl:text-right dark:text-gray-400">

                            <div className="flex justify-start">

                                <span>Role</span>
                            </div>

                        </th>
                    </tr>
                </thead>
                <tbody className="bg-[#494F55] divide-y divide-white dark:divide-gray-700 dark:bg-gray-900"> 
                    {users.map((user) => (
                        <tr key={user.email}>
                            <td className="px-1 py-2 text-xs whitespace-nowrap">
                                <div className="flex items-center ">
                                    {user.email}
                                </div>
                            </td>    
                            <td className="px-1 py-2 text-xs whitespace-nowrap">
                                <div className="flex items-center ">
                                    Email
                                </div>
                            </td>    

                            <td className="px-1 py-2 text-xs whitespace-nowrap">
                                <div className="flex items-center ">
                                    {user.role||'N/A'}
                                </div>
                            </td>    


                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
};

export default Authorization;
