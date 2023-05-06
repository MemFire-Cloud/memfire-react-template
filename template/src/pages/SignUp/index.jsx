import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { SignUp } from './api'
export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handlesignUp = (event) => {
        event.preventDefault()
        setLoading(true)
        SignUp(email, password).then((res) => {
            navigate("/profile");
            message.success('注册成功，自动帮您登录')
        }).catch(err => {
            message.error(err)
        })
        setLoading(false)
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-full max-w-md bg-white p-6 rounded-lg shadow-md" onSubmit={handlesignUp}>
                <h2 className="text-2xl font-bold mb-6">注册</h2>
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
                        注册
                    </button>
                    <a
                        className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        href="/"
                    >
                        去登录
                    </a>
                </div>
            </form>
        </div>
    );
}
