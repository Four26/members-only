import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import handleFocus from "../components/handleFocus";
import handleBlur from "../components/handleBlur";
import togglePassword from "../components/togglePassword";

const Signup = () => {
    const navigate = useNavigate();
    const [focused, setFocused] = useState({
        firstname: false,
        lastname: false,
        email: false,
        password: false,
        confirmPassword: false,
        isAdmin: false
    });
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false
    });
    const [error, setError] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        const formData = {
            firstname: e.target.firstname.value,
            lastname: e.target.lastname.value,
            username: e.target.username.value,
            password: e.target.password.value,
            confirmPassword: e.target.confirmPassword.value,
        }

        console.log(formData)
        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                setError(data.message);

                setTimeout(() => {
                    setError('');
                }, 2000);
                return;
            }
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <div className="sign-up-con shadow-[0px_3px_8px_rgba(0,0,0,0.24)] rounded-lg w-[400px] mx-auto mt-10 mb-10 p-6">
                <h2 className="text-center text-3xl font-semibold mb-6 text-gray-800">Sign Up</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form action="/signup" method="POST" className="flex flex-col space-y-6" onSubmit={handleSignup}>
                    {[
                        { name: 'firstname', type: 'text', label: 'First Name' },
                        { name: 'lastname', type: 'text', label: 'Last Name' },
                        { name: 'username', type: 'text', label: 'Username' },
                        { name: 'password', type: showPassword.password ? 'text' : 'password', label: 'Password' },
                        { name: 'confirmPassword', type: showPassword.confirmPassword ? 'text' : 'password', label: 'Confirm Password' }
                    ].map(({ name, type, label }) => (
                        <div key={name} className="relative">
                            <label htmlFor={name} className={`absolute left-3 transition-all duration-300 text-gray-500 bg-white px-2 pointer-events-none ${focused[name] ?
                                '-top-2 text-xs text-blue-500' : 'top-3 text-base'}`}>
                                {label}
                            </label>
                            <input
                                type={type}
                                name={name}
                                required
                                onFocus={() => handleFocus(setFocused, name)}
                                onBlur={(e) => handleBlur(setFocused, name, e.target.value)}
                                className={`w-full p-3 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 ${name === 'username' || name === 'password' || name === 'confirmPassword' ? 'normal-case' : 'capitalize'}`} />
                            {(name === 'password' || name === 'confirmPassword')
                                && (
                                    <span className="absolute right-4 top-4 text-gray-500 cursor-pointer"
                                        onClick={() => togglePassword(setShowPassword, name)}
                                    >
                                        {showPassword[name] ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </span>
                                )}
                        </div>
                    ))}

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold text-lg shadow-md hover:bg-blue-600 transition-all duration-300 cursor-pointer"
                    >
                        Sign Up
                    </button>
                    <p className="text-center text-gray-600 text-sm">Already have an account? <Link to="/login" className="text-blue-500 font-semibold hover:underline">Log in</Link></p>
                </form>
            </div>

        </div>
    )
}

export default Signup;