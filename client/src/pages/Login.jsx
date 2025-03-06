import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import handleFocus from "../components/handleFocus";
import handleBlur from "../components/handleBlur";
import togglePassword from "../components/togglePassword";

const Login = () => {
    const [focused, setFocused] = useState({
        name: false,
        password: false
    });
    const [showPassword, setShowPassword] = useState({
        password: false
    });
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setTimeout(() => {
                    setError('');
                }, 2000);
                return;
            }

            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="log-in-con shadow-[0px_3px_8px_rgba(0,0,0,0.24)] rounded-lg w-[400px] mx-auto mt-10 p-6">
                <h2 className="text-center text-3xl font-semibold mb-4 text-gray-800">Log In</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form action="/login" method="POST" className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                    {[
                        { name: 'username', type: 'text', label: 'Username' },
                        { name: 'password', type: showPassword.password ? 'text' : 'password', label: 'Enter your password' }
                    ].map(({ name, type, label }) => (
                        <div key={name} className="relative">
                            <label htmlFor={name} className={`absolute left-3 transition-all duration-300 text-gray-500 bg-white px-2 pointer-events-none ${focused[name] ? '-top-2 text-xs text-blue-500' : 'top-3 text-base'}`}>{label}</label>
                            <input
                                type={type}
                                name={name}
                                required
                                onChange={(e) => name === 'username' ? setUsername(e.target.value) : setPassword(e.target.value)}
                                onFocus={() => handleFocus(setFocused, name)}
                                onBlur={(e) => handleBlur(setFocused, name, e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-gray-800" />
                            {name === 'password' && (
                                <span>
                                    <span className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                                        onClick={() => togglePassword(setShowPassword, name)}
                                    >
                                        {showPassword[name] ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </span>
                                </span>
                            )}
                        </div>
                    ))}

                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300 cursor-pointer">Log In</button>
                    <p className="text-center text-sm text-gray-600 ">Don&apos;t have an account?<Link to="/signup" className="font-semibold text-blue-500 hover:underline">Sign up</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;