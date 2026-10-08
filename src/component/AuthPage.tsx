import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogin, useSignup, useVerifyOpt } from '../api/generated/queries';
import { useAuth } from '../context/AuthContext';
import type { AuthFormData, AuthMode } from '../type/Auth';

type AuthPageProps = {
    initialMode?: AuthMode;
};

type Credentials = {
    username: string;
    password: string;
};

type AuthFormState = AuthFormData & {
    confirmPassword: string;
};

const emptyForm: AuthFormState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
};

const OTP_LENGTH = 6;

const getStatus = (err: unknown): number | undefined => {
    const anyErr = err as any;

    return (
        anyErr?.response?.status ??
        anyErr?.status ??
        anyErr?.cause?.status ??
        anyErr?.error?.status
    );
};

function AuthPage({ initialMode = 'login' }: AuthPageProps) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [formData, setFormData] = useState<AuthFormState>(emptyForm);
    const [otp, setOtp] = useState('');
    const [pendingEmail, setPendingEmail] = useState<string | null>(null);
    const [pendingCredentials, setPendingCredentials] = useState<Credentials | null>(null);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    const isSignUp = mode === 'signup';
    const isVerifying = pendingEmail !== null;

    /* ------------------------------- login ------------------------------- */

    const loginMutation = useLogin(undefined, {
        onSuccess: async () => {
            await login();
            navigate('/dashboard', { replace: true });
        },
        onError: (err: unknown) => {
            console.log('Login error:', err);

            const status = getStatus(err);

            setNotice('');

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

    /* ------------------------------- signup ------------------------------ */

    const signupMutation = useSignup(undefined, {
        onSuccess: (_data, variables) => {
            setPendingEmail(variables.body.email ?? '');
            setPendingCredentials({
                username: variables.body.username ?? '',
                password: variables.body.password ?? ''
            });
            setOtp('');
            setError('');
            setNotice('');
        },
        onError: (err: unknown) => {
            console.log('Sign-up error:', err);

            const status = getStatus(err);

            if (status === 409) {
                setError('That username or email is already registered.');
            } else if (status === 400) {
                setError('Please check your details and try again.');
            } else if (status !== undefined) {
                setError('Something went wrong. Please try again.');
            } else {
                setError('Unable to connect to the server.');
            }
        }
    });

    /* --------------------------- otp verification ------------------------ */

    const verifyMutation = useVerifyOpt(undefined, {
        onSuccess: () => {
            const credentials = pendingCredentials;

            setPendingEmail(null);
            setPendingCredentials(null);
            setOtp('');
            setError('');
            setNotice('Account verified.');
            setMode('login');
            setFormData((current) => ({ ...current, password: '', confirmPassword: '' }));

            if (credentials?.username && credentials.password) {
                loginMutation.mutate({ body: credentials });
            }
        },
        onError: (err: unknown) => {
            console.log('Verification error:', err);

            const status = getStatus(err);

            if (status === 400 || status === 401 || status === 422) {
                setError('That code is invalid or has expired.');
            } else if (status !== undefined) {
                setError('Something went wrong. Please try again.');
            } else {
                setError('Unable to connect to the server.');
            }
        }
    });

    /* ------------------------------ handlers ----------------------------- */

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((currentForm) => ({
            ...currentForm,
            [name]: value
        }));
    };

    const handleOtpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.username || !formData.password || (isSignUp && !formData.email)) {
            setError(isSignUp
                ? 'Username, email, and password are required.'
                : 'Username and password are required.');
            return;
        }

        if (isSignUp) {
            if (!formData.confirmPassword) {
                setError('Please confirm your password.');
                return;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match.');
                return;
            }

            if (formData.password.length < 8) {
                setError('Password must be at least 8 characters long.');
                return;
            }

            setError('');
            setNotice('');

            signupMutation.mutate({
                body: {
                    username: formData.username.trim(),
                    email: (formData.email ?? '').trim(),
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            });
            return;
        }

        setError('');
        setNotice('');

        loginMutation.mutate({
            body: {
                username: formData.username,
                password: formData.password
            }
        });
    };

    const handleVerifySubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (otp.length !== OTP_LENGTH) {
            setError(`Enter the ${OTP_LENGTH}-digit code from your email.`);
            return;
        }

        setError('');
        setNotice('');

        verifyMutation.mutate({
            body: {
                email: pendingEmail ?? '',
                otp
            }
        });
    };

    const toggleMode = () => {
        setMode((currentMode) => (currentMode === 'login' ? 'signup' : 'login'));
        setError('');
        setNotice('');
        setOtp('');
        setPendingEmail(null);
        setPendingCredentials(null);
    };

    const backToSignUp = () => {
        setPendingEmail(null);
        setPendingCredentials(null);
        setOtp('');
        setError('');
        setNotice('');
        setMode('signup');
    };

    /* -------------------------------- view ------------------------------- */

    return (
        <main className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
            <section
                className="card shadow-sm w-100"
                style={{ maxWidth: 420 }}
            >
                <div className="card-body p-4">
                    <header className="text-center mb-4">
                        <p className="text-uppercase text-primary fw-bold small mb-1">
                            {isVerifying ? 'Verify your email' : isSignUp ? 'Get started' : 'Welcome back'}
                        </p>
                        <h1 className="fw-bold mb-3">
                            {isVerifying ? 'Check your inbox' : isSignUp ? 'Create an account' : 'Sign in'}
                        </h1>
                        <div className="mx-auto bg-success rounded" style={{ width: 64, height: 3 }} aria-hidden="true" />
                    </header>

                    {isVerifying ? (
                        <form onSubmit={handleVerifySubmit} autoComplete="off">
                            <input
                                type="text"
                                name="fake-username"
                                className="d-none"
                                tabIndex={-1}
                                autoComplete="username"
                            />
                            <input
                                type="password"
                                name="fake-password"
                                className="d-none"
                                tabIndex={-1}
                                autoComplete="current-password"
                            />

                            <p className="text-secondary small">
                                We sent a {OTP_LENGTH}-digit code to <strong>{pendingEmail}</strong>.
                                Enter it below to activate your account.
                            </p>

                            <div className="mb-3">
                                <label htmlFor="otp" className="form-label">Verification code</label>
                                <input
                                    id="otp"
                                    className="form-control"
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    placeholder="Enter the 6-digit code"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    maxLength={OTP_LENGTH}
                                    autoFocus
                                    required
                                />
                            </div>

                            {notice && (
                                <div className="alert alert-success" role="status">
                                    {notice}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={verifyMutation.isPending || otp.length !== OTP_LENGTH}
                            >
                                {verifyMutation.isPending ? 'Verifying...' : 'Verify & continue'}
                            </button>

                            <button
                                type="button"
                                className="btn btn-link w-100 mt-2 text-decoration-none"
                                onClick={backToSignUp}
                            >
                                Wrong email? Go back
                            </button>
                        </form>
                    ) : (
                        <>
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <input
                                    type="text"
                                    name="fake-username"
                                    className="d-none"
                                    tabIndex={-1}
                                    autoComplete="username"
                                />
                                <input
                                    type="password"
                                    name="fake-password"
                                    className="d-none"
                                    tabIndex={-1}
                                    autoComplete="current-password"
                                />

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
                                        autoComplete="off"
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
                                            autoComplete="off"
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
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>

                                {isSignUp && (
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Confirm password
                                        </label>
                                        <input
                                            id="confirmPassword"
                                            className="form-control"
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Re-enter your password"
                                            autoComplete="new-password"
                                            required
                                        />
                                    </div>
                                )}

                                {notice && (
                                    <div className="alert alert-success" role="status">
                                        {notice}
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loginMutation.isPending || signupMutation.isPending}
                                >
                                    {isSignUp
                                        ? signupMutation.isPending
                                            ? 'Creating account...'
                                            : 'Sign Up'
                                        : loginMutation.isPending
                                            ? 'Signing in...'
                                            : 'Sign In'}
                                </button>
                            </form>

                            <button
                                type="button"
                                className="btn btn-link w-100 mt-2 text-decoration-none"
                                onClick={toggleMode}
                            >
                                {isSignUp
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Sign up"}
                            </button>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}

export default AuthPage;