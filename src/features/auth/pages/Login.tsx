import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginWithGoogle } from '../../../services/firebase/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Particles } from '@/components/ui/particles';
import { ChevronLeftIcon, Grid2x2PlusIcon } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await loginUser(email, password);
            console.log("Login successful");
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Note: GitHub login is not yet implemented in auth service, keeping placeholder logic
    const handleGithubLogin = async () => {
        alert("GitHub login not implemented yet");
    };

    return (
        <div className="dark relative md:h-screen md:overflow-hidden w-full bg-background text-foreground">
            <Particles
                className="absolute inset-0"
                quantity={120}
                ease={20}
                color="#ffffff"
                vx={0.3}
                vy={0.3}
                refresh
            />

            {/* Ambient Background Gradients */}
            <div
                aria-hidden
                className="absolute inset-0 isolate -z-10"
            >
                <div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,100%,0.2)_0,hsla(0,0%,55%,.05)_50%,hsla(0,0%,100%,0.05)_80%)] absolute top-0 left-0 h-[1280px] w-[560px] -translate-y-[350px] -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,0.15)_0,hsla(0,0%,100%,0.05)_80%,transparent_100%)] absolute top-0 left-0 h-[1280px] w-[240px] translate-x-[5%] -translate-y-1/2 -rotate-45 rounded-full" />
                <div className="bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,100%,0.15)_0,hsla(0,0%,100%,0.05)_80%,transparent_100%)] absolute top-0 left-0 h-[1280px] w-[240px] -translate-y-[350px] -rotate-45 rounded-full" />
            </div>

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4">
                <Button variant="ghost" className="absolute top-4 left-4" asChild>
                    <Link to="/">
                        <ChevronLeftIcon className="me-1 h-4 w-4" />
                        Home
                    </Link>
                </Button>

                <div className="mx-auto space-y-4 w-full max-w-sm">
                    <div className="flex items-center gap-2">
                        <Grid2x2PlusIcon className="h-6 w-6" />
                        <span className="text-xl font-semibold">Global Shop</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-2xl font-bold tracking-wide">
                            Sign In to Global Shop
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Enter your email to sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                disabled={loading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading} size="lg">
                            {loading ? (
                                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            ) : null}
                            Sign In
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Button type="button" size="lg" className="w-full" disabled={loading} onClick={handleGoogleLogin}>
                            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </Button>
                        <Button type="button" size="lg" className="w-full" disabled={loading} onClick={handleGithubLogin}>
                            <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            Continue with GitHub
                        </Button>
                    </div>

                    <p className="text-muted-foreground mt-8 text-sm">
                        Don&apos;t have an account?{" "}
                        <Link
                            to="/signup"
                            className="hover:text-primary underline underline-offset-4"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;