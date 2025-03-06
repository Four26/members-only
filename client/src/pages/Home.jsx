import { useEffect, useReducer } from "react";

function reducer(state, action) {
    switch (action.type) {
        case 'setUser':
            return { ...state, user: action.payload };
        case 'setPosts':
            return { ...state, posts: action.payload };
        case 'toggleModal':
            return { ...state, [action.modal]: action.payload };
        case 'updateUserAdminStatus':
            return { ...state, user: { ...state.user, ...action.payload }, isAdminModal: false, isAdmin: '' };
        case 'updateUserMembershipStatus':
            return { ...state, user: { ...state.user, ...action.payload }, joinClubModal: false, secretCode: '' };
        case 'deletePost':
            return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
        case 'resetField':
            return { ...state, [action.field]: action.payload ?? '' };
        default:
            return state;
    }
}

const Home = () => {

    const [state, dispatch] = useReducer(reducer, {
        user: null,
        posts: [],
        postModal: false,
        joinClubModal: false,
        isAdminModal: false,
        isAdmin: '',
        secretCode: ''
    })

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:3000/getallposts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',

            });
            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }
            dispatch({ type: 'setPosts', payload: data });
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) return;
        dispatch({ type: 'setUser', payload: storedUser })
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        //setState((prevState) => ({ ...prevState, user: null }));
        dispatch({ type: 'setUser', payload: null })
    }

    const handleAdminModal = () => {
        //setState((prevState) => ({ ...prevState, isAdminModal: true }));
        dispatch({ type: 'toggleModal', modal: 'isAdminModal', payload: true })
    }

    const beAnAdmin = async (e) => {
        e.preventDefault();
        if (state.isAdmin.toLocaleLowerCase() !== 'admin') return alert('Please enter the correct code to become an admin!');

        try {
            const response = await fetch('http://localhost:3000/updateAdminStatus', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userID: state.user.id, is_admin: true })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error(data.message);
                return alert('Failed to become an admin');
            }
            const updatedUser = { ...state.user, is_admin: true };
            dispatch({ type: 'updateUserAdminStatus', payload: updatedUser });
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (postID) => {
        try {
            const response = await fetch(`http://localhost:3000/deletePost/${postID}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return alert('Failed to delete post');
            }
            dispatch({ type: 'deletePost', payload: postID });
        } catch (error) {
            console.error(error)
        }
    }

    const handleJoinClub = async (e) => {
        e.preventDefault();
        {
            if (state.secretCode.toLocaleLowerCase() !== 'secret') {
                dispatch({ type: 'resetField', field: 'secretCode' });
                return alert('Please enter the correct secret code to join the club!');
            }

            try {
                const response = await fetch('http://localhost:3000/updateMembershipStatus', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ userID: state.user.id, membership_status: true })
                });
                const data = await response.json();
                if (!response.ok) {
                    console.error(data.message);
                    return alert('Failed to join the club');
                }

                const updatedUser = { ...state.user, membership_status: true };
                dispatch({ type: 'updateUserMembershipStatus', payload: updatedUser });
                localStorage.setItem('user', JSON.stringify(updatedUser));

            } catch (error) {
                console.error(error);
            }
        }
    }

    const createPost = () => {
        const membershipStatus = JSON.parse(localStorage.getItem('user'));
        if (membershipStatus.membership_status === false) {
            dispatch({ type: 'toggleModal', modal: 'joinClubModal', payload: false });
            return alert('Please join the club first to create a post!');
        }
        dispatch({ type: 'toggleModal', modal: 'postModal', payload: true });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.post.value;
        const id = state.user.id;
        if (!text) return alert('Please enter a message to post!');

        try {
            const response = await fetch('http://localhost:3000/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ text, id })
            });
            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }
            dispatch({ type: 'toggleModal', modal: 'postModal', payload: false })
            fetchPosts();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="h-screen">
            <div className="grid grid-cols-5 grid-rows-5 h-full">
                <div className="row-span-5 p-6 bg-gray-100 shadow-lg rounded-lg flex flex-col items-right space-y-6">
                    <button
                        onClick={() => {
                            if (!state.user) {
                                return alert('Please login or signup first to join the club!')
                            }
                            dispatch({ type: 'toggleModal', modal: 'joinClubModal', payload: true });
                        }}
                        className="w-full text-center bg-blue-500 text-white p-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-600 transition-all duration-200 ">
                        🔥Join the club
                    </button>
                    {state.user && (
                        <h3 className="text-xl font-semibold text-center text-gray-800">Welcome <span className="text-blue-600">{state.user?.username}</span></h3>
                    )}

                    {state.user && (
                        <button
                            onClick={handleLogout}
                            className="bg-red-300 text-white py-2 px-4 rounded w-full mt-4 hover:bg-red-400 transition duration-200 cursor-pointer">
                            Logout
                        </button>
                    )}
                    {/* Admin Modal*/}
                    {state.user && (
                        <p className="">Want to be an <a onClick={handleAdminModal} className="text-blue-400 underline cursor-pointer">
                            admin</a>?

                        </p>
                    )}

                    {state.isAdminModal && (

                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                                {/* Close button positioned at the top-right */}
                                <button
                                    onClick={() => dispatch({ type: 'toggleModal', modal: 'isAdminModal', payload: false })}
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-bold transition cursor-pointer"
                                >
                                    &times;
                                </button>

                                <form onSubmit={beAnAdmin}>
                                    <h4 className="text-lg font-semibold mb-2 text-center">Enter &quot;admin&quot; to become an admin</h4>
                                    <input
                                        type="text"
                                        value={state.isAdmin}
                                        onChange={(e) => dispatch({ type: 'resetField', field: 'isAdmin', payload: e.target.value })}
                                        className="border border-gray-300 p-2 rounded w-full mb-4" />
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-600">Submit</button>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Admin Modal End*/}
                </div>

                {/* Join Club Modal*/}
                {state.joinClubModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                        <div className="relative bg-white p-6 rounded-lg shadow-lg w-96">
                            {/* Close button positioned at the top-right */}
                            <button
                                onClick={() => dispatch({ type: 'toggleModal', modal: 'joinClubModal', payload: false })}
                                type="button"
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-3xl font-bold transition cursor-pointer"
                            >
                                &times;
                            </button>

                            <form onSubmit={handleJoinClub}>
                                <h4 className="text-lg font-semibold mb-2 text-center">Enter &quot;secret&quot; code to join</h4>
                                <input
                                    type="text"
                                    value={state.secretCode}
                                    onChange={(e) => dispatch({ type: 'resetField', field: 'secretCode', payload: e.target.value })}
                                    className="border border-gray-300 p-2 rounded w-full mb-4" />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full cursor-pointer hover:bg-blue-600">Join</button>
                            </form>
                        </div>
                    </div>
                )}

                <div className="col-span-3 row-span-5 p-6 overflow-y-scroll">
                    <div className="space-y-4">
                        {state.posts.map((post) => (
                            <div key={post.id} className="p-4 rounded bg-white shadow-md border border-gray-200">
                                <div className="mb-2">
                                    <p className="text-gray-800 text-lg font-medium">
                                        {post.text}
                                    </p>
                                    <div className="flex justify-between items-center text-sm text-gray-600">
                                        <p className="font-semibold text-blue-600">
                                            {state.user ? `@${post.username}` : 'Anonymous'}
                                        </p>
                                        <p>{state.user ? `${new Date(post.created_at).toLocaleDateString()} - ${new Date(post.created_at).toLocaleTimeString()}` : 'Date Hidden'}</p>
                                    </div>
                                    {state.user?.is_admin === true && (
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="bg-red-400 py-2 px-4 mt-4 text-white cursor-pointer rounded hover:bg-red-500 transition-all duration-200">Delete</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row-span-5 col-start-5 p-6 bg-gray-100 shadow-lg rounded-lg flex flex-col items-center justify-start     text-center">
                    <p className="text-xl font-semibold text-gray-800">
                        Welcome to <span className="text-blue-600 font-bold">Members Only</span>!
                    </p>
                    <p className="text-gray-700 mt-2">
                        Only club members can post messages. <br /> Join now to participate!
                    </p>

                    {state.user && (
                        <div className="mt-6">
                            <button
                                onClick={createPost}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md cursor-pointer hover:bg-blue-700 transition duration-300">
                                ✍️ Create Post
                            </button>
                            {state.postModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                                    <form onSubmit={handleSubmit} className="relative bg-white p-6 rounded-lg shadow-lg w-96" >
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>
                                            <button
                                                onClick={() => dispatch({ type: 'toggleModal', modal: 'postModal', payload: false })}
                                                type="button"
                                                className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition cursor-pointer"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                        <textarea
                                            name="post"
                                            className="w-full p-2 border border-gray-300 rounded-lg resize-none"
                                            rows="4"
                                        ></textarea>
                                        <button
                                            className="bg-blue-400 w-full mt-4 py-2 rounded-lg text-white font-semibold cursor-pointer hover:bg-blue-500 transition"
                                        >
                                            Post
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div >
        </div >
    )
}

export default Home;