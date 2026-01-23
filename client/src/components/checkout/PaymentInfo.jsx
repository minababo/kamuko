import { Wallet, CheckCircle } from 'lucide-react'

function PaymentInfo() {
    return (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Method</h2>

            <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-5">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                            <Wallet className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">Cash on Pickup</h3>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="mt-2 text-sm text-gray-700">
                            Pay with cash when you collect your order at the counter.
                        </p>
                        <div className="mt-4 rounded-lg bg-white p-3">
                            <p className="text-xs font-medium text-gray-900">Important:</p>
                            <ul className="mt-1 space-y-1 text-xs text-gray-600">
                                <li>• Please have exact change if possible</li>
                                <li>• Payment is due upon order collection</li>
                                <li>• Large bills may require change availability</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs text-gray-600">
                    <span className="font-semibold">Note:</span> Online payment options are currently not available.
                    We only accept cash payment at the time of pickup.
                </p>
            </div>
        </section>
    )
}

export default PaymentInfo
