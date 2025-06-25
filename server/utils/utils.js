import Otp from '../models/RegistrationOtp.js'

const computeNextActualResetDate = (date) => {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1; // Next month

    if (month > 11) {
        month = 0;
        year++;
    }

    const maxDay = new Date(year, month + 1, 0).getDate();
    const resetDay = Math.min(date, maxDay);

    return new Date(year, month, resetDay);
};

const getNextDueDate = (preferredDay, fromDate) => {
    const nextMonth = new Date(fromDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const year = nextMonth.getFullYear();
    const month = nextMonth.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();

    const dayToUse = Math.min(preferredDay, daysInMonth);

    return new Date(year, month - 1, dayToUse);
}

const verifyOtp = async (email, otp) => {
    if (!email || !otp) throw new Error('Missing fields');

    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) throw new Error('Invalid OTP');
    if (existingOtp.expiresAt < new Date()) throw new Error('OTP expired');

    return true;
}

const sendOtpToEmail = () => {
    console.log('Sending OTP to email...');
}

export { computeNextActualResetDate, getNextDueDate, verifyOtp, sendOtpToEmail };