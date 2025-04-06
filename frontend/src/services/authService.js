// authService.js
require('dotenv').config();
// Function to handle normal login (email & password)
export const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
  
      const data = await response.json();
      return data; // Success: return the data (e.g., JWT or user data)
    } catch (error) {
      console.error('Login failed', error);
      throw error; // You can handle errors in the component where this is used
    }
  };
  
  // Function to handle Google login redirection
  export const googleLogin = () => {
    window.location.href = `${process.env.API_URL}/auth/google`; // Redirect to Google login
  };
  
  // Function to get the authenticated user details
  export const getUserDetails = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
  
      const data = await response.json();
      return data; // Return user details
    } catch (error) {
      console.error('Error fetching user details', error);
      throw error;
    }
  };
  
  // Function to refresh the JWT token
  export const refreshToken = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      return data; // Return new token or success
    } catch (error) {
      console.error('Error refreshing token', error);
      throw error;
    }
  };
  
  // Function to logout the user
  export const logoutUser = async () => {
    try {
      const response = await fetch(`${process.env.API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
  
      localStorage.removeItem('token'); // Clear token from localStorage
      return true;
    } catch (error) {
      console.error('Error logging out', error);
      throw error;
    }
  };  