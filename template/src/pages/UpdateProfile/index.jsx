import { useState, useEffect } from 'react';
import {  useSearchParams } from 'react-router-dom';
import { Input ,message} from 'antd';
import { useNavigate } from "react-router-dom";
import { DownloadImage, UploadImage, UpdateProfile, GetProfile } from './api'
const { TextArea } = Input;
function EditProfilePage() {
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [filePath, setFilePath] = useState(null)
    // 在这里做更新个人信息的操作
    const handleSubmit = (event) => {
        event.preventDefault();
        UpdateProfile({ email, introduction, ...{avatar:filePath,user_name:name} }).then((res) => {
            if (res) {
                navigate("/profile?id=" + searchParams.get('id'));
            }
        }).catch(err => {
            message.error(err)
        })
    };
    // 获取个人信息
    useEffect(() => {
        getProfile()
    }, [])
    // 下载文件
    useEffect(() => {
        if (filePath) downloadImage(filePath)
    }, [filePath])
    const handleChange =  (event) => {
        setLoading(true)
        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('请选择一个图片上传')
        }
        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`
        UploadImage(filePath, file).then((res) => {
            if (res) {
                setFilePath(filePath)
            }
        }).catch(err => {
            message.error(err)
        }).finally(()=>{
            setLoading(false)
        })
    }

     function downloadImage(path) {
        DownloadImage(path).then((res) => {
            if (res) {
                setImageUrl(res)
            }
        }).catch(err => {
            message.error(err)
        })
    }
    const handleNameChange = (event) => setName(event.target.value);
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handleIntroductionChange = (event) => setIntroduction(event.target.value);
    const getProfile =  (event) => {
        GetProfile(searchParams.get('id')).then((res) => {
            if (JSON.stringify(res) !== '{}') {
                    if(res.avatar){
                        downloadImage(res.avatar)
                    }
                    setFilePath(res.avatar)
                    setName(res.user_name)
                    setEmail(res.email)
                    setIntroduction(res.introduction);
            }
        }).catch(err => {
            message.error(err)
        })
    }
    return (
        <div className="bg-gray-100 w-full min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-5">修改个人信息</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label className="block font-bold mb-2" htmlFor="name">
                            头像
                        </label>
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Avatar"
                                className="avatar image"
                                style={{ height: 150, width: 150 }}
                            />
                        ) : (
                            <div className="avatar no-image" style={{ height: 150, width: 150 }} />
                        )}
                        <div style={{ width: 150 }}>
                            <label className="button primary block" htmlFor="single">
                                {loading ? '上传中 ...' : '上传'}
                            </label>
                            <input
                                style={{
                                    visibility: 'hidden',
                                    position: 'absolute',
                                }}
                                type="file"
                                id="single"
                                accept="image/*"
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="block font-bold mb-2" htmlFor="name">
                            姓名
                        </label>
                        <Input
                            className="w-full px-3 py-2 border rounded-md"
                            id="name"
                            type="text"
                            value={name}
                            onChange={handleNameChange}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block font-bold mb-2" htmlFor="email">
                            邮箱
                        </label>
                        <Input
                            className="w-full px-3 py-2 border rounded-md"
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block font-bold mb-2" htmlFor="password">
                            个人介绍
                        </label>
                        <TextArea rows={4} required placeholder="maxLength is 250" value={introduction} onChange={handleIntroductionChange} maxLength={250} />
                    </div>
                    <div className='flex justify-between'>
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                            保存
                        </button>
                        <button type="text" onClick={() => navigate("/profile?id=" + searchParams.get('id'))} className="px-4 py-2 bg-white text-black rounded-md">
                            返回
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditProfilePage;
