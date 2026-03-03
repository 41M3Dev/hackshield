import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import authService from '../services/auth.service';
import Button from '../components/ui/Button';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token') || '';

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    authService
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />

      <div className="relative text-center max-w-md w-full bg-slate-900/80 border border-slate-700/60 rounded-2xl p-10 backdrop-blur-sm">
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-primary-400 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-100 mb-2">Verifying your email...</h2>
            <p className="text-sm text-slate-400">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Email verified!</h2>
            <p className="text-sm text-slate-400 mb-6">
              Your email has been successfully verified. You can now sign in.
            </p>
            <Link to="/login">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Verification failed</h2>
            <p className="text-sm text-slate-400 mb-6">
              The link is invalid or has expired. Please request a new verification email.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300">
                Back to Sign In
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
