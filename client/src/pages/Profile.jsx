import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordChange from '../components/profile/PasswordChange';

function Profile() {
    const { isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('account');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/me');
                setProfileData(response.data?.user || response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || err.response?.data?.error || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchProfile();
        }
    }, [isAuthenticated]);

    if (isLoading || loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    <p className="font-medium">Error loading profile</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!profileData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto max-w-4xl px-4">
                <ProfileHeader user={profileData} />

                <div className="mt-8 rounded-lg bg-white shadow">
                    <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                    <div className="p-6">
                        {activeTab === 'account' && (
                            <ProfileForm user={profileData} setProfileData={setProfileData} />
                        )}
                        {activeTab === 'password' && <PasswordChange />}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
