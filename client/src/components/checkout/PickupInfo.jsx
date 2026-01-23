import { MapPin, Clock } from 'lucide-react'

function PickupInfo() {
    return (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Pickup Information</h2>

            <div className="space-y-6">
                {/* Restaurant Address */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Restaurant Location</h3>
                        <p className="mt-1 text-sm text-gray-600">
                            123 Main Street<br />
                            Downtown District<br />
                            City, State 12345
                        </p>
                        <a
                            href="https://maps.google.com/?q=123+Main+Street+Downtown+District"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm font-semibold text-orange-600 hover:text-orange-500"
                        >
                            View on map →
                        </a>
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                            <Clock className="h-5 w-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Opening Hours</h3>
                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <p>Monday - Friday: 10:00 AM - 10:00 PM</p>
                            <p>Saturday - Sunday: 9:00 AM - 11:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6 text-sm text-gray-600">
                    Pickup time will be confirmed after your order is placed.
                </div>
            </div>
        </section>
    )
}

export default PickupInfo
