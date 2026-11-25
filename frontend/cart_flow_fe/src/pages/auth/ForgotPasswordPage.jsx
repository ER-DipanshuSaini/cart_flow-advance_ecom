import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { Button, Input, OtpVerification } from '../../components/ui';
import AuthLayout, { isValidEmail, useAuthToasts } from './AuthLayout';

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'reset'
  const [email, setEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useAuthToasts();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      addToast('error', 'Email Required', 'Please enter your registered email address.');
      return;
    }
    if (!isValidEmail(email)) {
      addToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const otpCode = generateOtp();
    setTimeout(() => {
      setGeneratedOtp(otpCode);
      setLoading(false);
      setStep('otp');
      addToast('info', 'OTP Sent', `A 6-digit reset OTP (${otpCode}) has been sent to ${email.trim()}.`);
    }, 450);
  };

  const handleVerifyOtp = (enteredOtp) => {
    if (enteredOtp.length !== 6) {
      addToast('error', 'Incomplete OTP', 'Please enter all 6 digits of the OTP.');
      return;
    }
    if (enteredOtp !== generatedOtp) {
      addToast('error', 'Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('reset');
      addToast('success', 'OTP Verified', 'Please set your new password.');
    }, 400);
  };

  const handleResendOtp = () => {
    const newCode = generateOtp();
    setGeneratedOtp(newCode);
    addToast('info', 'OTP Resent', `New 6-digit OTP (${newCode}) sent to ${email.trim()}.`);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      addToast('error', 'Weak Password', 'New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('error', 'Password Mismatch', 'New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('success', 'Password Reset', 'Your password has been updated. Please sign in.');
      setTimeout(() => navigate('/login'), 600);
    }, 450);
  };

  const stepSubheadings = {
    email: 'Enter your registered email address and we will send you a 6-digit OTP.',
    otp: 'Enter the 6-digit verification code sent to your email.',
    reset: 'Create a strong new password for your CartFlow account.',
  };

  return (
    <AuthLayout
      bannerImage="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=85"
      eyebrow="ACCOUNT RECOVERY"
      bannerTitle="Securely restore access to your CartFlow wardrobe."
      perks={[
        '6-digit email OTP verification',
        'Instant password recovery',
        'Encrypted account protection',
      ]}
      heading={step === 'reset' ? 'Set New Password' : 'Forgot Password'}
      subheading={stepSubheadings[step]}
      toasts={toasts}
      onRemoveToast={removeToast}
      footer={
        <div className="cf-auth-switch-footer">
          <span>Remembered your password?</span>{' '}
          <Link to="/login" className="cf-switch-auth-link">
            Back to Sign In
          </Link>
        </div>
      }
    >
      {step === 'email' && (
        <form onSubmit={handleSendOtp} className="cf-auth-inputs-stack" noValidate>
          <Input
            label="Registered Email Address"
            type="email"
            required
            placeholder="you@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            iconRight={ArrowRight}
            className="cf-auth-primary-btn"
          >
            Send 6-Digit OTP
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <OtpVerification
          email={email.trim()}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => setStep('email')}
          loading={loading}
          submitLabel="Verify OTP"
        />
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="cf-auth-inputs-stack" noValidate>
          <Input
            label="New Password"
            type="password"
            required
            placeholder="At least 6 characters"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            placeholder="Re-enter new password"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            iconRight={Check}
            className="cf-auth-primary-btn"
          >
            Update Password
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
