import { useNavigate } from 'react-router-dom';

const formatDateString = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

const handleLogout = async (navigate) => {
  try {
    const response = await fetch('https://photo-frame-website.onrender.com/logout', {
      method: 'GET',
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      // Handle successful logout on the client side
      localStorage.removeItem('tokens');
      localStorage.removeItem('userId');
      console.log('Logout successful'); 
      navigate('/login', { replace: true });
    } else {
      // Handle errors or display appropriate messages
      console.error('Logout failed');
    }
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export { formatDateString,handleLogout };