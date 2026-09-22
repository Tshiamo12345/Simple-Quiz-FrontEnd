import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin } from '../api/generated/queries';
import { useAuth } from '../context/AuthContext';
import type { AuthFormData, AuthMode } from '../type/Auth';

type AuthPageProps = {
    initialMode?: AuthMode;
};

const emptyForm: AuthFormData = {
    username: '',
    email: '',
    password: ''
};

function AuthPage({ initialMode = 'login' }: AuthPageProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [formData, setFormData] = useState<AuthFormData>(emptyForm);
    const [error, setError] = useState('');

    const isSignUp = mode === 'signup';

    const loginMutation = useLogin(undefined, {
        onSuccess: async () => {
            // Spring Boot sets the JWT in an httpOnly cookie.
            // We must await login() so AuthContext fetches /me
            // BEFORE we navigate, otherwise ProtectedRoute sees user=null.
            await login();
            navigate('/dashboard', { replace: true });
        },
        onError: (err: unknown) => {
            const status = (err as { response?: { status?: number } })?.response?.status;

            if (status === 401) {
                setError('Invalid username or password.');
            } else if (status === 403) {
                setError('Your account is disabled.');
            } else if (status) {
                setError('Something went wrong. Please try again.');
            } else {
                setError('Unable to connect to the server.');
            }
        }
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormData((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.username || !formData.password || (isSignUp && !formData.email)) {
            setError(isSignUp
                ? 'Username, email, and password are required.'
                : 'Username and password are required.');
            return;
        }

        setError('');

        if (isSignUp) {
            // TODO: replace with useSignup when ready
            console.log('Sign-up attempt:', formData);
            return;
        }

        loginMutation.mutate({
            body: {
                username: formData.username,
                password: formData.password
            }
        });
    };

    const toggleMode = () => {
        setMode((currentMode) => currentMode === 'login' ? 'signup' : 'login');
        setError('');
    };

    return (
        <main className="d-flex justify-content-center align-items-center vh-100">
            <section className="card p-4 shadow" style={{ width: '400px', maxWidth: '90%' }}>
                <h1 className="h2 text-center mb-4">
                    {isSignUp ? 'Create an account' : 'Welcome back'}
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            className="form-control"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                className="form-control"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            className="form-control"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && <div className="alert alert-danger" role="alert">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? 'Signing in...' : isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <button type="button" className="btn btn-link w-100 mt-3" onClick={toggleMode}>
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
            </section>
        </main>
    );
}

export default AuthPage;