import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react';
import Button from '../Button/Button';
import './OtpVerification.css';

/**
 * Reusable 6-Digit OTP Verification Component with Resend Timer
 */
export default function OtpVerification({
  email,
  length = 6,
  onVerify,
  onResend,
  onBack,
  loading = false,
  resendCooldown = 30,
  submitLabel = 'Verify & Continue',
}) {
  const [digits, setDigits] = useState(() => Array(length).fill(''));
  const [timer, setTimer] = useState(resendCooldown);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    // Handle paste or multi-char input
    if (clean.length > 1) {
      const pasted = clean.slice(0, length).split('');
      const next = Array(length).fill('');
      pasted.forEach((char, idx) => {
        next[idx] = char;
      });
      setDigits(next);
      const focusIdx = Math.min(pasted.length, length - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    const next = Array(length).fill('');
    pasted.split('').forEach((char, idx) => {
      next[idx] = char;
    });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = digits.join('');
    onVerify && onVerify(otp);
  };

  const handleResendClick = () => {
    if (timer > 0) return;
    setDigits(Array(length).fill(''));
    setTimer(resendCooldown);
    inputRefs.current[0]?.focus();
    onResend && onResend();
  };

  return (
    <form onSubmit={handleSubmit} className="cf-otp-wrapper">
      <div className="cf-otp-sent-banner">
        <ShieldCheck size={16} />
        <span>
          Enter the 6-digit code sent to <strong>{email}</strong>
        </span>
      </div>

      <div className="cf-otp-boxes-row" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={length}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className={`cf-otp-digit-input ${digit ? 'is-filled' : ''}`}
            aria-label={`OTP digit ${idx + 1}`}
          />
        ))}
      </div>

      <div className="cf-otp-resend-row">
        <span className="cf-otp-resend-label">Didn&apos;t receive the code?</span>
        <button
          type="button"
          className="cf-otp-resend-btn"
          onClick={handleResendClick}
          disabled={timer > 0}
        >
          <RotateCcw size={13} />
          <span>{timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}</span>
        </button>
      </div>

      <div className="cf-otp-actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="cf-auth-primary-btn"
        >
          {submitLabel}
        </Button>

        {onBack && (
          <button type="button" className="cf-otp-back-btn" onClick={onBack}>
            <ArrowLeft size={14} /> Change Email Address
          </button>
        )}
      </div>
    </form>
  );
}
