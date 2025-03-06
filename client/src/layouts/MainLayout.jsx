import { NavLink, Outlet } from 'react-router';
import './mainlayout.css';
import { FaGithub } from "react-icons/fa";

const MainLayout = () => {
    return (
        <div className='main-layout'>
            <header className='py-4 px-8 bg-white-500 flex justify-between items-center bg-gray-800 text-white'>
                <h1 className='text-4xl'>Members Only</h1>
                <nav className='w-40'>
                    <ul className='flex justify-between items-center space-x-4'>
                        <NavLink to='/' className='hover:underline transition-all duration-300 ease-in-out'>Home</NavLink>
                        <NavLink to='/login' className='hover:underline transition-all duration-300 ease-in-out'>Login</NavLink>
                        <NavLink to='/signup' className='hover:underline transition-all duration-300 ease-in-out'>Signup</NavLink>
                    </ul>
                </nav>
            </header>
            <main className='border p-4'>
                <Outlet />
            </main>
            <footer className='flex justify-center items-center gap-4 bg-gray-700 text-white p-4'>
                <p className='font-semibold text-lg'>Made by Franklin</p>
                <a href="https://github.com/Four26" target='_blank' rel='noopener noreferrer' className='text-2xl hover:text-gray-300 transition-all duration-300 ease-in-out' aria-label='Github Profile'><FaGithub /></a>
            </footer>
        </div>
    )
}

export default MainLayout;