import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get where the user came from (e.g., clicked bookmark on homepage)
    // Get where the user came from (e.g., clicked bookmark on homepage)
    // When passed from NewsCard: navigate('/login', { state: { from: location } });
    // So location.state.from is the location object, we want its pathname.
    const from = location.state?.from?.pathname || "/";
    const [error, setError] = React.useState(null);

    const handleSuccess = async (credentialResponse) => {
        const success = await loginWithGoogle(credentialResponse.credential);
        if (success) {
            navigate(from, { replace: true });
        } else {
            setError("Login failed. Check console for details.");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface dark:bg-surface-dark p-8 rounded-2xl shadow-premium dark:shadow-premium-dark max-w-md w-full border border-border dark:border-border-dark relative z-10 text-center"
            >
                <h2 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-2">Welcome Back</h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8">Sign in to generate AI summaries and save bookmarks .</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                        {error}
                    </div>
                )}
                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text="continue_with"
                    />
                </div>

                <p className="mt-8 text-xs text-zinc-400">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
