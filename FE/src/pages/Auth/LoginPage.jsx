import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import authService from '../../services/authService'
import { login } from '../../slices/authSlice'

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('dev@example.com');
  const [password, setPassword] = useState('test123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { token, user } = await authService.login(email, password);
      dispatch(login({ token, user }));
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className='flex items-center' >
      <div />

      <div>

        <div>
          {/* Header */}

          <div>
            <div>
              <BrainCircuit className='' strokeWidth={2} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>

          </div>

          {/* form */}
          <div>
            {/* email */}
            <div>
              <label htmlFor="email">Email</label>
              <div>
                <div className={`absolute inset-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusField === 'email' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Mail className='' strokeWidth={2} />
                </div>
                <input type="email"
                  name="email"
                  id="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onfocus={() => setFocusField('email')}
                  onBlur={() => setFocusField(null)}
                  placeholder="your@example.com"
                  className={`'}`}
                />
              </div>

            </div>

            {/* password */}
            <div>
              <label className="">Password</label>
              <div>

                <div className={`absolute inset-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${focusField === 'password' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  <Lock className='' strokeWidth={2} />
                </div>
                <input type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onfocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                  placeholder="********"
                  className={``}
                />
              </div>

            </div>
            {/* error message */}

            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? <div>'Signing in...' </div> : <div>'Login' <ArrowRight className="ml-2" strokeWidth={2} /> </div>}
            </button>

          </div>

          {/* footer */}
          <div>
            
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>

        </div>

        {/* subtle footer text */}
          <p>By continuing, you agree to our <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
      </div>


    </div>
  )
}

export default LoginPage
