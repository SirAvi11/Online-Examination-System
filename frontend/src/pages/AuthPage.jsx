import { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // API base URL - replace with your backend URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!isLoginView && !formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isLoginView && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLoginView && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isLoginView && !formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      return response.data;
    } catch (error) {
      if (error.response) {
        // Handle backend validation errors
        if (error.response.data.errors) {
          const backendErrors = {};
          error.response.data.errors.forEach(err => {
            backendErrors[err.path] = err.msg;
          });
          setErrors(backendErrors);
        } else {
          setErrors({ submit: error.response.data.message });
        }
      } else {
        setErrors({ submit: 'Network error. Please try again.' });
      }
      throw error;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        name: formData.username,
        password: formData.password
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Network error. Please try again.' });
      }
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      let response;
      if (isLoginView) {
        response = await handleLogin();

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        setSuccessMessage('Login successful! Redirecting...');
        // Redirect based on role
        setTimeout(() => {
            if (response.user.role === 'Teacher') {
            window.location.href = '/teacher-dashboard';
            } else {
            window.location.href = '/student-dashboard';
            }
        }, 200);
      } else {
        response = await handleRegister();
        setSuccessMessage('Registration successful! You can now login.');
        // Clear form after successful registration
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role:''
        });
        // Optionally switch to login view
        setIsLoginView(true);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="d-flex flex-column flex-md-row shadow rounded-3" style={{ height: '100%', width: '100%' }}>
      <div className="left-side d-flex flex-column align-items-center justify-content-center flex-shrink-0" style={{ width: '50%' }}>
        <img
          src="https://storage.googleapis.com/a1aa/image/b2b265dd-7f2f-4d31-de14-d0fac5f917b3.jpg"
          alt="Illustration of a student sitting on a chair writing exam papers with mathematical symbols around"
          width="280"
          height="280"
          className="img-fluid"
        />
        <h2 className="mt-4 fw-semibold text-dark" style={{ fontSize: '1.5rem' }}>Exam Mastery Hub</h2>
        <p className="abc text-secondary small mt-2 px-3">
          Unleash Your Academic Success with Exam Mastery Hub's Exam Excellence Platform
        </p>
        <div className="pagination-dots">
          <span className="dot"></span>
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </div>
      <div className="right-side d-flex flex-column justify-content-center" style={{ width: '50%' }}>
        <div className="mb-5 d-flex justify-content-center">
          <h1 className="logo-text">
            <i className="fas fa-graduation-cap"></i>
            <span>MASTERY</span>
            <span className="green-text">HUB</span>
          </h1>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="alert alert-success mb-4" role="alert">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {errors.submit && (
          <div className="alert alert-danger mb-4" role="alert">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLoginView && (
            <div className="mb-3 d-flex flex-column align-items-start">
              <label htmlFor="email" className="form-label text-secondary small">Email</label>
              <input
                type="email"
                className={`form-control input-focus ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          )}
          
          <div className="mb-3 d-flex flex-column align-items-start">
            <label htmlFor="username" className="form-label text-secondary small">
              {isLoginView ? 'Username or email' : 'Username'}
            </label>
            <input
              type="text"
              className={`form-control input-focus ${errors.username ? 'is-invalid' : ''}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={isLoginView ? 'Enter username or email' : 'Choose a username'}
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          {!isLoginView && (
            <div className="mb-3 d-flex flex-column align-items-start">
              <label htmlFor="role" className="form-label text-secondary small">Role</label>
              <select
                id="role"
                name="role"
                className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">-- Select Role --</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
              </select>
              {errors.role && <div className="invalid-feedback">{errors.role}</div>}
            </div>
          )}

          <div className="mb-3 d-flex flex-column align-items-start">
            <label htmlFor="password" className="form-label text-secondary small">Password</label>
            <input
              type="password"
              className={`form-control input-focus ${errors.password ? 'is-invalid' : ''}`}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {!isLoginView && (
            <div className="mb-3 d-flex flex-column align-items-start">
              <label htmlFor="confirmPassword" className="form-label text-secondary small">Confirm Password</label>
              <input
                type="password"
                className={`form-control input-focus ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>
          )}

          {isLoginView && (
            <div className="text-end mt-1">
              <button type="button" className="link-green btn btn-link p-0 small">Forgot password?</button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-signin w-100 py-2 mb-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {isLoginView ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              isLoginView ? 'Sign in' : 'Create Account'
            )}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          type="button"
          className="btn btn-outline-secondary d-flex align-items-center justify-content-center gap-2 w-100 mb-4"
          style={{ fontSize: '0.875rem' }}
        >
          <img
            src="https://storage.googleapis.com/a1aa/image/2dfae7aa-6c6f-474c-186e-4440834a396c.jpg"
            alt="Google logo icon"
            width="20"
            height="20"
          />
          <span>Sign in with Google</span>
        </button>

        <p className="text-center text-secondary small mb-0">
          {isLoginView ? 'Are you new? ' : 'Already have an account? '}
          <button 
            className="link-green btn btn-link p-0 small" 
            onClick={toggleView}
            style={{ textDecoration: 'none' }}
          >
            {isLoginView ? 'Create an Account' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}