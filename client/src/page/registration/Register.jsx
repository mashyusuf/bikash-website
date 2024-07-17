import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosCommon from '../../hooks/useAxiosCommon';
import Swal from 'sweetalert2';

const Register = () => {
  const navigate = useNavigate();
  const axiosCommon = useAxiosCommon();
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('');
  const [cpin, setCpin] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleTermsClick = () => {
    Swal.fire({
      icon: 'info',
      title: 'Terms and Conditions',
      text: 'Display your terms and conditions here.',
      confirmButtonText: 'Close'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin !== cpin) {
      Swal.fire({
        icon: 'error',
        title: 'PINs do not match',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (pin.length !== 5) {
      Swal.fire({
        icon: 'error',
        title: 'PIN must be exactly 5 digits long',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (number.length !== 11) {
      Swal.fire({
        icon: 'error',
        title: 'Mobile number must be exactly 11 digits long',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (!termsAccepted) {
      Swal.fire({
        icon: 'error',
        title: 'You must accept the terms and conditions',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const response = await axiosCommon.post('/register', {
        name,
        lname,
        email,
        number,
        pin,
        role,
      });

      if (response.data?.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful',
          showConfirmButton: false,
          timer: 1500
        });
        navigate('/login');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration failed',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error registering user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Registration failed',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          <div className="p-8 md:p-12 bg-indigo-600 text-white">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-extrabold leading-tight">Create Your Account</h2>
              <p className="mt-4">Welcome to our registration page! Get started by creating your account.</p>
              <p className="mt-4">Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.</p>
            </div>
          </div>
          <div className="p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Register</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-800 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Enter first name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Enter last name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Enter mobile number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">PIN</label>
                  <input
                    type="password"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Enter 5-digit PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">Confirm PIN</label>
                  <input
                    type="password"
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    placeholder="Confirm 5-digit PIN"
                    value={cpin}
                    onChange={(e) => setCpin(e.target.value)}
                    maxLength="5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-800 text-sm mb-2">Role</label>
                  <select
                    className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3 rounded-md focus:outline-none focus:ring-indigo-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-500"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-800">
                    I accept the{' '}
                    <button
                      type="button"
                      onClick={handleTermsClick}
                      className="text-indigo-500 font-semibold hover:underline"
                    >
                      Terms and Conditions
                    </button>
                  </label>
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
