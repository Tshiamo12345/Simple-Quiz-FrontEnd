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
            await login();
            navigate('/dashboard', { replace: true });
        },
        onError: (err: unknown) => {
            console.log('Login error:', err);

            const anyErr = err as any;
            const status: number | undefined =
                anyErr?.response?.status ??
                anyErr?.status ??
                anyErr?.cause?.status ??
                anyErr?.error?.status;

            if (status === 401) {
                setError('Invalid username or password.');
            } else if (status === 403) {
                setError('Your account is disabled.');
            } else if (status !== undefined) {
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
        <main className="auth-page">
            <section className="auth-card">
                <header className="auth-header">
                    <p className="eyebrow">{isSignUp ? 'Get started' : 'Welcome back'}</p>
                    <h1>{isSignUp ? 'Create an account' : 'Sign in'}</h1>
                    <div className="heading-rule" aria-hidden="true" />
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            id="username"
                            className="form-control auth-input"
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
                                className="form-control auth-input"
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
                            className="form-control auth-input"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-brand w-100"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending
                            ? 'Signing in...'
                            : isSignUp
                                ? 'Sign Up'
                                : 'Sign In'}
                    </button>
                </form>

                <button type="button" className="auth-toggle" onClick={toggleMode}>
                    {isSignUp
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up"}
                </button>
            </section>
        </main>
    );
}

export default AuthPage;