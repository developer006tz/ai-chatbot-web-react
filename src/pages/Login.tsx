import { useState } from 'react';
import { Button } from '../components/shared/Button';
import { Input } from '../components/shared/Input';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn,signInWithGithub,signUpWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(`Invalid email or password ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-300 dark:bg-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          src="https://res.cloudinary.com/dcmwnrvzk/image/upload/f_auto,q_auto,w_896/v1731598362/social-smarttech-logo_hvn5fr.png"
          alt="Logo"
          className="mx-auto h-12 w-auto"
        />
        <h2 className="mt-6 dark:text-white text-center text-3xl font-extrabold text-gray-900">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-700 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='Email'
              autoComplete="email"
              className="bg-black/10 dark:bg-gray-800 text-black dark:text-white p-3"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              required
              className="bg-black/10 dark:bg-gray-800 text-black dark:text-white p-3"
            />

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4"
                size="lg"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-700 dark:text-gray-400 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
                {/*  Add a button to sign up with github */}
                <Button
                variant="outline"
                className="w-1/2"
                size="lg"
                onClick={() => signInWithGithub()}
                >
                <img
                    src="https://www.svgrepo.com/show/327364/logo-github.svg"
                    alt="Google"
                    className="h-5 w-5 mr-2"
                />
                Github
                </Button>
              <Button
                variant="outline"
                className="w-1/2"
                size="lg"
                onClick={() => signUpWithGoogle()}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5 mr-2"
                />
                Google
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}