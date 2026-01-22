import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function AvailabilityToggle({ itemId, isAvailable, onToggle }) {
    const [loading, setLoading] = useState(false);
    const [available, setAvailable] = useState(isAvailable);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await api.patch(`/products/${itemId}`, {
                isAvailable: !available,
            });
            setAvailable(!available);
            toast.success(`Item marked as ${!available ? 'available' : 'unavailable'}`);
            if (onToggle) onToggle();
        } catch (error) {
            console.error('Failed to update availability:', error);
            toast.error('Failed to update availability');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 ${available ? 'bg-green-500' : 'bg-red-500'
                }`}
        >
            <span className="sr-only">Toggle availability</span>
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${available ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    );
}

export default AvailabilityToggle;
