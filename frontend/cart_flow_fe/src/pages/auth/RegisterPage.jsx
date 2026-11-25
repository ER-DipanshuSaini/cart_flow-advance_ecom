import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Toggle, OtpVerification } from '../../components/ui';
import AuthLayout, { GoogleAuthButton, isValidEmail, useAuthToasts } from './AuthLayout';

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export default function RegisterPage() {
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const { registerCustomer, loginCustomer } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useAuthToasts();

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      addToast('error', 'First Name Required', 'Please enter your first name.');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      addToast('error', 'Weak Password', 'Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      addToast('error', 'Terms Required', 'Please accept the Terms of Service to continue.');
      return;
    }

    setLoading(true);
    const otpCode = generateOtp();
    setTimeout(() => {
      setGeneratedOtp(otpCode);
      setLoading(false);
      setStep('otp');
      addToast('info', 'Verification OTP Sent', `A 6-digit OTP (${otpCode}) has been sent to ${email.trim()}.`);
    }, 450);
  };

  const handleVerifyOtp = (enteredOtp) => {
    if (enteredOtp.length !== 6) {
      addToast('error', 'Incomplete OTP', 'Please enter all 6 digits of your verification code.');
      return;
    }
    if (enteredOtp !== generatedOtp) {
      addToast('error', 'Invalid OTP', 'The verification code does not match. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ');
      registerCustomer(fullName, email.trim(), password);
      setLoading(false);
      addToast('success', 'Account Verified', 'Welcome to CartFlow! Redirecting to your dashboard.');
      setTimeout(() => navigate('/account'), 500);
    }, 450);
  };

  const handleResendOtp = () => {
    const newCode = generateOtp();
    setGeneratedOtp(newCode);
    addToast('info', 'OTP Resent', `New 6-digit verification code (${newCode}) sent to ${email.trim()}.`);
  };

  const handleGoogleRegister = () => {
    loginCustomer('vikram.roy@cartflow.luxury', 'google-oauth');
    addToast('success', 'Google Sign-Up', 'Account connected with Google.');
    setTimeout(() => navigate('/account'), 400);
  };

  return (
    <AuthLayout
      bannerImage="https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=85"
      eyebrow="JOIN CARTFLOW"
      bannerTitle="Timeless menswear crafted in pure natural textiles."
      perks={[
        'Priority access to small-batch drops',
        'Save delivery addresses & track orders',
        'Member rewards & exclusive seasonal offers',
      ]}
      heading={step === 'details' ? 'Create Account' : 'Verify Your Email'}
      subheading={
        step === 'details'
          ? 'Join CartFlow for faster checkout, saved addresses, and order tracking.'
          : 'Confirm your email address to activate your account.'
      }
      toasts={toasts}
      onRemoveToast={removeToast}
      footer={
        <div className="cf-auth-switch-footer">
          <span>Already registered?</span>{' '}
          <Link to="/login" className="cf-switch-auth-link">
            Sign in to account
          </Link>
        </div>
      }
    >
      {step === 'details' ? (
        <>
          <form onSubmit={handleDetailsSubmit} className="cf-auth-inputs-stack" noValidate>
            <div className="cf-auth-name-row">
              <Input
                label="First Name"
                type="text"
                required
                placeholder="Aarav"
                icon={User}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="Last Name"
                type="text"
                placeholder="Sharma (Optional)"
                icon={User}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

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
              placeholder="At least 6 characters"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={{ paddingTop: '4px' }}>
              <Toggle
                label="I agree to the Terms of Service & Privacy Policy"
                checked={agreeTerms}
                onChange={setAgreeTerms}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={UserPlus}
              className="cf-auth-primary-btn"
            >
              Send Verification OTP
            </Button>
          </form>

          <GoogleAuthButton onClick={handleGoogleRegister} />
        </>
      ) : (
        <OtpVerification
          email={email.trim()}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => setStep('details')}
          loading={loading}
          submitLabel="Verify & Create Account"
        />
      )}
    </AuthLayout>
  );
}
