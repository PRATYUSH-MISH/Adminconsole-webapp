import { createPortal } from 'react-dom';

const Portal = ({ children, handleCancel }) => {
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };
    return createPortal(
        <div 
            onClick={handleBackdropClick}
            className="fixed  inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-50 z-50 ">
            <div className="relative bg-[#333333] inline-block px-2 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl rtl:text-right dark:bg-gray-900 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6 p-6 ">
                {children}
            </div>
        </div>,
        document.body
    )
}
export default Portal