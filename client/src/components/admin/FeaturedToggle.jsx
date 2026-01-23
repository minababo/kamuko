import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';

function FeaturedToggle({ itemId, isFeatured, onToggle }) {
    const [loading, setLoading] = useState(false);
    const [featured, setFeatured] = useState(!!isFeatured);

    const handleToggle = async () => {
        setLoading(true);
        try {
            await api.patch(`/products/${itemId}`, {
                isFeatured: !featured,
            });
            setFeatured(!featured);
            toast.success(`Product ${!featured ? 'featured' : 'unfeatured'}`);
            if (onToggle) onToggle();
        } catch (error) {
            console.error('Failed to update featured status:', error);
            toast.error(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to update featured status'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 ${
                featured ? 'bg-orange-500' : 'bg-gray-300'
            }`}
        >
            <span className="sr-only">Toggle featured</span>
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    featured ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
}

export default FeaturedToggle;
