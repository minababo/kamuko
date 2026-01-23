import { CheckCircle } from 'lucide-react';

const ConfirmationHeader = () => {
    return (
        <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
                <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
                Thank you for your order. We'll have it ready for you soon!
            </p>
        </div>
    );
};

export default ConfirmationHeader;
