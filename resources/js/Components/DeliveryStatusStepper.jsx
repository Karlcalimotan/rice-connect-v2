import React from 'react';

const DeliveryStatusStepper = ({ status, type }) => {
    const steps = [
        { key: 'Pending', label: type === 'palay' ? 'Awaiting Pickup' : (type === 'rice_pickup' ? 'Preparing' : 'Waiting for Driver') },
        { key: 'In Transit', label: type === 'palay' ? 'Heading to Miller' : (type === 'rice_pickup' ? 'Date Scheduled' : 'Heading to Retailer') },
        { key: 'Delivered', label: type === 'palay' ? 'Arrived (At Miller)' : (type === 'rice_pickup' ? 'Ready at Hub' : 'Truck Arrived') },
        { key: 'Confirmed Received', label: type === 'palay' ? 'Finalized / Received' : (type === 'rice_pickup' ? 'Picked Up & Done' : 'Final Sign-off') },
    ];

    const getCurrentStep = () => {
        if (status === 'date_scheduled') return 1;
        if (status === 'ready_for_pickup') return 2;
        if (status === 'Pending' || status === 'Payment Pending' || status === 'Payment Authorized') return 0;
        if (status === 'In Transit') return 1;
        if (status === 'Delivered' || status === 'Received') return 2;
        if (status === 'Confirmed Received' || status === 'Completed' || status === 'completed') return 3;
        return 0;
    };

    const currentStepIndex = getCurrentStep();

    return (
        <div className="w-full py-6">
            {/* Desktop Horizontal Stepper (hidden on mobile, visible on sm and up) */}
            <div className="hidden sm:flex items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.key}>
                        <div className="relative flex flex-col items-center flex-1">
                            <div 
                                className={`w-10 h-10 flex items-center justify-center border-4 border-black font-black text-lg transition-all z-10 ${
                                    index <= currentStepIndex 
                                        ? 'bg-green-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                                        : 'bg-white text-gray-300 border-gray-200'
                                }`}
                            >
                                {index + 1}
                            </div>
                            <div 
                                className={`mt-3 text-[10px] font-black uppercase tracking-tighter text-center max-w-[80px] leading-none ${
                                    index <= currentStepIndex ? 'text-black' : 'text-gray-300'
                                }`}
                            >
                                {step.label}
                            </div>
                        </div>

                        {index < steps.length - 1 && (
                            <div className="flex-auto h-1 border-t-4 border-black -mt-8 mx-[-20px] z-0">
                                <div 
                                    className={`h-full bg-green-500 transition-all duration-500 ${
                                        index < currentStepIndex ? 'w-full' : 'w-0'
                                    }`}
                                ></div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile Vertical Stepper (visible on mobile, hidden on sm and up) */}
            <div className="flex sm:hidden flex-col gap-6 relative pl-4">
                {/* Vertical connecting line */}
                <div className="absolute left-[34px] top-6 bottom-6 w-1 bg-gray-200 border-l-2 border-black z-0">
                    <div 
                        className="w-full bg-green-500 transition-all duration-500" 
                        style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>

                {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center gap-6 relative z-10">
                        <div 
                            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center border-4 border-black font-black text-sm transition-all ${
                                index <= currentStepIndex 
                                    ? 'bg-green-500 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                                    : 'bg-white text-gray-300 border-gray-200'
                            }`}
                        >
                            {index + 1}
                        </div>
                        <div 
                            className={`text-xs font-black uppercase tracking-wider ${
                                index <= currentStepIndex ? 'text-black' : 'text-gray-300'
                            }`}
                        >
                            {step.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryStatusStepper;
