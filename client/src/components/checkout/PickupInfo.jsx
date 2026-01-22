import { useEffect } from 'react'
import { MapPin, Clock } from 'lucide-react'

function PickupInfo({ pickupTime, setPickupTime }) {
    // Generate pickup time options (current time + 30 mins to + 4 hours, in 15-min intervals)
    const generateTimeOptions = () => {
        const options = []
        const now = new Date()

        // Add 30 minutes minimum preparation time
        now.setMinutes(now.getMinutes() + 30)

        // Round to nearest 15 minutes
        const minutes = now.getMinutes()
        const roundedMinutes = Math.ceil(minutes / 15) * 15
        now.setMinutes(roundedMinutes)
        now.setSeconds(0)

        // Generate options for next 4 hours
        for (let i = 0; i < 16; i++) {
            const time = new Date(now.getTime() + i * 15 * 60000)
            const hours = time.getHours()
            const mins = time.getMinutes()

            // Format time as HH:MM
            const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`

            // Display format (12-hour with AM/PM)
            const displayHours = hours % 12 || 12
            const ampm = hours >= 12 ? 'PM' : 'AM'
            const displayString = `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`

            options.push({
                value: timeString,
                display: displayString
            })
        }

        return options
    }

    const timeOptions = generateTimeOptions()

    // Set default pickup time (first option)
    useEffect(() => {
        if (!pickupTime && timeOptions.length > 0) {
            setPickupTime(timeOptions[0].value)
        }
    }, [pickupTime, setPickupTime, timeOptions])

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

                {/* Pickup Time Selection */}
                <div className="border-t border-gray-200 pt-6">
                    <label htmlFor="pickupTime" className="block text-sm font-medium text-gray-900">
                        Select Pickup Time *
                    </label>
                    <p className="mt-1 text-sm text-gray-600">
                        Minimum preparation time: 30 minutes
                    </p>
                    <select
                        id="pickupTime"
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="mt-3 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                    >
                        <option value="">Choose a time</option>
                        {timeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.display}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </section>
    )
}

export default PickupInfo
