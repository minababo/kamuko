import { Clock, Hash, Wallet } from 'lucide-react';

const NextStepsInfo = () => {
    const steps = [
        {
            icon: Clock,
            title: "We're preparing your order",
            description: "Our team is working on your order right now"
        },
        {
            icon: Hash,
            title: "Show your order number at the counter",
            description: "Present your order number when you arrive"
        },
        {
            icon: Wallet,
            title: "Pay cash upon collection",
            description: "Complete payment when you pick up your order"
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">What's Next?</h3>
            <div className="space-y-6">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                        <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                                <Icon className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-1">
                                    {step.title}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NextStepsInfo;
