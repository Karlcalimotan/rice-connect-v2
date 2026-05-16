import React from 'react';

const DeliveryStatusStepper = ({ status, type }) => {
    const steps = [
        { key: 'Pending', label: type === 'palay' ? 'Awaiting Pickup' : 'Waiting for Driver' },
        { key: 'In Transit', label: type === 'palay' ? 'Heading to Miller' : 'Heading to Retailer' },
        { key: 'Delivered', label: type === 'palay' ? 'Arrived (At Miller)' : 'Truck Arrived' },
        { key: 'Confirmed Received', label: type === 'palay' ? 'Finalized / Received' : 'Final Sign-off' },
    ];

    const getCurrentStep = () => {
        if (status === 'Pending' || status === 'Payment Pending' || status === 'Payment Authorized') return 0;
        if (status === 'In Transit') return 1;
        if (status === 'Delivered' || status === 'Received') return 2;
        if (status === 'Confirmed Received' || status === 'Completed') return 3;
        return 0;
    };

    const currentStepIndex = getCurrentStep();

    return (
        <div className="w-full py-6">
            <div className="flex items-center">
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
        </div>
    );
};

export default DeliveryStatusStepper;
