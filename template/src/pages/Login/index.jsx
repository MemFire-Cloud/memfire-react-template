import { useState, useEffect } from 'react'
import { supabase } from '../../supabaseClient'
import { useNavigate } from "react-router-dom";
import { message} from "antd";
import { UserLogin } from './api'
export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [session, setSession] = useState(null)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            if (session) {
                navigate("/profile?id=" + session.user.id);
            }
        })
        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            if (session) {
                navigate("/profile?id=" + session.user.id);
            }
        })
    })
    const handleLogin =  (event) => {
        event.preventDefault()
        setLoading(true)
        UserLogin(email, password).then((res) => {
            navigate("/profile?id=" + res.id);
        }).catch(err => {
            message.error(err)
        })
        // const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
        // if (error) {
        //     alert(error.error_description || error.message)
        // } else {
        //     navigate("/profile?id=" + user.id);
        // }
        setLoading(false)
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handleLogin}>
                <h2 className="text-2xl font-bold mb-6">登录</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
                        邮箱
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
                        密码
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        disabled={loading}
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        登录
                    </button>
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/signUp"
                    >
                        注册
                    </a>
                </div>
            </form>
        </div>
    );
}
