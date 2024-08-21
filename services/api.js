// services/api.js
import { Platform } from 'react-native';

// Define your base URL based on environment
const isDevelopment = __DEV__;
// const isDevelopment = "";
const BASE_URL = isDevelopment ? 'http://localhost:3000' : 'https://chefhavn.com';


// API method for logging in
export const login = async (email, phoneNumber, loginWithEmail) => {
    const identifier = loginWithEmail ? email : phoneNumber;
    const payload = loginWithEmail ? { email, role: "Customer" } : { phone: phoneNumber, role: "Customer" };

    try {
        const response = await fetch(`${BASE_URL}/api/auth/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

// API method for sending OTP
export const sendOtp = async (email, phoneNumber, loginWithEmail) => {
    const payload = { email: loginWithEmail ? email : null, phone: !loginWithEmail ? phoneNumber : null };

    try {
        const response = await fetch(`${BASE_URL}/api/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response.json();
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

// Example API method
export const fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`${BASE_URL}/api/customers/profile-completion/${userId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

// Example API method for updating user
export const updateUserProfile = async (userId, userData) => {
    try {
        const response = await fetch(`${BASE_URL}/api/customers/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};
