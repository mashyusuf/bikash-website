import { useState } from 'react';
import { FaEnvelope, FaKey, FaCheck } from 'react-icons/fa'; // Importing icons from React Icons
import useAxiosCommon from '../../hooks/useAxiosCommon';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert

const Login = () => {
  const navigate = useNavigate();
  const axiosCommon = useAxiosCommon();
  const [credential, setCredential] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state

    try {
      const response = await axiosCommon.post('/login', {
        credential,
        pin,
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      Swal.fire({
        icon: 'success',
        title: 'Login successful!',
        showConfirmButton: false,
        timer: 1500 // Automatically close after 1.5 seconds
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login failed',
        text: error.response ? error.response.data : error.message,
        confirmButtonText: 'Try again'
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'credential') setCredential(value);
    if (name === 'pin') setPin(value);
  };

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="grid lg:grid-cols-4 md:grid-cols-3 items-center">
        <form className="lg:col-span-3 md:col-span-2 max-w-lg w-full p-6 mx-auto" onSubmit={handleSubmit}>
          <div className="mb-12">
            <h3 className="text-gray-800 text-4xl font-extrabold">Sign In</h3>
            <p className="text-gray-800 text-sm mt-6 leading-relaxed">
              Welcome back! Please log in to access your account and explore a world of possibilities. Your journey begins here.
            </p>
          </div>

          <div className="relative flex items-center">
            <label className="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
              <FaEnvelope className="inline-block mr-2 text-blue-600" /> Email or Number
            </label>
            <input
              type="text"
              name="credential"
              placeholder="Enter email or number"
              value={credential}
              onChange={handleChange}
              className="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-blue-600 rounded-md outline-none"
            />
          </div>

          <div className="relative flex items-center mt-8">
            <label className="text-gray-800 text-[13px] bg-white absolute px-2 top-[-9px] left-[18px] font-semibold">
              <FaKey className="inline-block mr-2 text-blue-600" /> PIN
            </label>
            <input
              type="password"
              name="pin"
              placeholder="Enter PIN"
              value={pin}
              onChange={handleChange}
              className="px-4 py-3.5 bg-white w-full text-sm border-2 border-gray-200 focus:border-blue-600 rounded-md outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                Remember me
              </label>
            </div>
            <div>
              <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">
                Forgot PIN?
              </a>
            </div>
          </div>

          <div className="mt-12">
            <button
              type="submit"
              className={`w-full shadow-xl py-2.5 px-4 text-sm tracking-wider font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291l1.293 1.293a1 1 0 001.414 0L12 17.414l3.293 3.293a1 1 0 001.414-1.414L13.414 16l3.293-3.293a1 1 0 00-1.414-1.414L12 14.586l-3.293-3.293a1 1 0 00-1.414 1.414L10.586 16l-3.293 3.293a1 1 0 000 1.414z"></path>
                </svg>
              ) : (
                <FaCheck className="inline-block mr-2" /> 
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
