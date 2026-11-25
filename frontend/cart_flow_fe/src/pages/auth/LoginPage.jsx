import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Toggle } from '../../components/ui';
import AuthLayout, { GoogleAuthButton, isValidEmail, useAuthToasts } from './AuthLayout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useAuthToasts();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('error', 'Email Required', 'Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      addToast('error', 'Invalid Password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginCustomer(email.trim(), password);
      setLoading(false);
      addToast('success', 'Welcome Back', 'Signed in successfully.');
      setTimeout(() => navigate('/account'), 450);
    }, 450);
  };

  const handleGoogleLogin = () => {
    loginCustomer('vikram.roy@cartflow.luxury', 'google-oauth');
    addToast('success', 'Google Sign-In', 'Signed in with Google.');
    setTimeout(() => navigate('/account'), 400);
  };

  return (
    <AuthLayout
      bannerImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
      eyebrow="CARTFLOW ATELIER"
      bannerTitle="Tailored silhouettes, pure natural fibres, delivered seamlessly."
      perks={[
        'Track orders & manage saved addresses',
        'Access exclusive limited-batch drops',
        'Complimentary express doorstep exchanges',
      ]}
      heading="Welcome Back"
      subheading="Sign in to manage your orders, saved addresses, and wishlist."
      toasts={toasts}
      onRemoveToast={removeToast}
      footer={
        <div className="cf-auth-switch-footer">
          <span>New to CartFlow?</span>{' '}
          <Link to="/register" className="cf-switch-auth-link">
            Create an account
          </Link>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="cf-auth-inputs-stack" noValidate>
        <Input
          label="Email Address"
          type="email"
          required
          placeholder="you@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          placeholder="Enter your password"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="cf-auth-meta-options">
          <Toggle
            label="Remember me"
            checked={rememberMe}
            onChange={setRememberMe}
          />
          <Link to="/forgot-password" className="cf-forgot-pass-link">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          iconRight={LogIn}
          className="cf-auth-primary-btn"
        >
          Sign In
        </Button>
      </form>

      <GoogleAuthButton onClick={handleGoogleLogin} />
    </AuthLayout>
  );
}
