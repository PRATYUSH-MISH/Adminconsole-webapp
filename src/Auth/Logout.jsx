import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import Portal from './Portals';
const Logout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <>
    

   
    <Portal
      handleCancel={handleCancel}
    >
      <div className="flex  justify-center items-center">

{/* do CSS here For Mobile View #changes @sushobhitfg */}

        <div className="relative w-72   p-5 overflow-hidden transition-all transform  rtl:text-right dark:bg-gray-900  sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div className="flex items-center justify-center">
              <span className="mb-4 inline-flex justify-center items-center w-[62px] h-[62px] rounded-full border-4 border-yellow-50 bg-yellow-100 text-red-600">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
                </svg>
              </span>

            </div>

            <div className="mt-2 text-center">
              <h3 className="text-lg font-medium leading-6 text-white capitalize dark:text-white" id="modal-title">Logout Here</h3>
              <p className="mt-2 text-white text-sm  dark:text-gray-400">
                Are you sure you would like to sign out of your account?
              </p>
            </div>
          </div>
          <div className=" mt-5 sm:flex sm:items-center  flex justify-center flex-1 items-center ">
            <button onClick={handleLogout} className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide text-white
                         capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:w-auto sm:mt-0 hover:bg-blue-500
                          focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
              Logout
            </button>
            <button onClick={handleCancel} type="button"
              className="w-full px-4 py-2 mt-2 text-sm font-medium tracking-wide bg-red-500
                            capitalize transition-colors duration-300 transform border border-gray-200 rounded-md
                             sm:mt-0 sm:w-auto sm:mx-2 dark:text-gray-200 dark:border-gray-700 
                             dark:hover:bg-gray-800 hover:bg-red-400 focus:outline-none focus:ring
                              focus:ring-gray-300 focus:ring-opacity-40 text-white">
              Cancel
            </button>
          </div>
        </div>

      </div>

    </Portal>
    
    </>
  );
};

export default Logout;
