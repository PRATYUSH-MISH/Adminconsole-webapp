
import {createPortal} from 'react-dom';

const Portal = ({ children, onClose }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    return createPortal(
        <div onClick={handleBackdropClick}
        className="fixed  inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50 z-50 ">
            <div className="bg-[#333333] p-6 rounded-lg shadow-lg dark:bg-gray-900">
                {children}
              
                <div className="mt-3 flex justify-center">
                     <button 
                      onClick={onClose}
                      className="px-8 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80">
                          Close
                      </button>
                </div>
            </div>
        </div>,
        document.body
    );
};


export default Portal;
