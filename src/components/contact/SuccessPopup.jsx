import React, { useEffect } from 'react';
import { RiCloseLine } from '@remixicon/react';

const SuccessPopup = ({ isOpen, onClose }) => {

    useEffect(() => {
        if (isOpen && window.lenis) {
            window.lenis.stop();
        } else if (!isOpen && window.lenis) {
            window.lenis.start();
        }
        return () => {
            if (window.lenis) window.lenis.start();
        };
    }, [isOpen]);

    return (
        <div className={`fixed inset-0 z-[100000] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-[#0B1A2C]/80 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-[#EAE9E4] h-60 rounded-xl p-6 max-w-lg w-[90%] transition-transform duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                <button 
                    onClick={onClose}
                    aria-label="Close popup"
                    className="absolute top-6 right-6 w-10 h-10 bg-black/5 hover:bg-[#883F27] hover:text-white rounded-full flex items-center justify-center transition-colors text-[#0B1A2C]"
                >
                    <RiCloseLine size={24} />
                </button>
                <div className=" flex flex-col justify-between h-full space-y-6">
                    <h3 className="text-[#0B1A2C]  font-medium m-0">Received.</h3>
                    <p className="text-xl md:text-2xl text-[#0B1A2C] opacity-80 m-0">
                        A reply from <a href="mailto:me@pirantee.com" className="text-[#883F27] hover:underline font-medium">me@pirantee.com</a> is on its way, usually within two days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
