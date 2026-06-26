import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../../../api/axios';

const CompleteProfile = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const facebookId = params.get('facebookId');
    const fullName   = params.get('name');
    const provider   = params.get('provider');

    const handleSubmit = async () => {
        if (!email) return setError('Please enter your email address');
        setLoading(true);
        setError('');
        try {
            const { data } = await API_URL.post("/auth/complete-profile", { facebookId, fullName, email, provider } 
            );
            navigate(`/oauth-success?token=${data.token}&id=${data.id}&name=${data.name}&email=${data.email}&isBlocked=${data.isBlocked}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">

                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-5">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5a2.25 2.25 0 00-2.25 2.25m19.5 0l-9.75 6.75L2.25 6.75" />
                    </svg>
                </div>

                {/* Heading */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">One more step</h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                    Your Facebook account doesn't have an email address linked to it.
                    Please provide one to complete your registration.
                </p>

                {/* Input */}
                <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-1.5">
                        Email address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg outline-none transition
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                    />
                    {error && (
                        <p className="text-xs text-red-500 mt-1.5">{error}</p>
                    )}
                </div>

                {/* Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60
                        disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg
                        transition duration-150"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Please wait...
                        </span>
                    ) : 'Continue'}
                </button>

                {/* Footer */}
                <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
                    By continuing, you agree to our{' '}
                    <a href="/terms" className="text-gray-500 underline hover:text-gray-700">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-gray-500 underline hover:text-gray-700">Privacy Policy</a>.
                </p>

            </div>
        </div>
    );
};

export default CompleteProfile;