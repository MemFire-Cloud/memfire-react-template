import { React, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout, message, } from "antd";
import { DownloadImage } from './api'
import HeaderComponent from "../../components/Header";

const Profile = () => {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const [prefile, setPrefile] = useState({})
    const [avatarUrl, setAvatarUrl] = useState(null)
    useEffect(() => {
        getProfile();
    }, [])
    const getProfile = async () => {
        const { data:{session}, error } = await supabase.auth.getSession()
            if (JSON.stringify(session.user.user_metadata) !== '{}') {
                if (session.user.user_metadata.avatar) {
                    downloadImage(session.user.user_metadata.avatar);
                }
                setPrefile(session.user.user_metadata)
            } else {
                message.info("暂无完整个人信息，请前去修改个人信息！");
            }
    }
    const downloadImage = (path) => {
        DownloadImage(path).then((res) => {
            if (res) {
                setAvatarUrl(res)
            }
        }).catch(err => {
            message.info('暂无完整个人信息，请前去修改个人信息！')
        })
    }
    return (
        <Layout>
            <HeaderComponent type={'1'} />
            <div className="bg-gray-100">
                <div className="container mx-auto pt-10 pb-12 px-4 md:pt-16 md:pb-16 xl:pt-20 xl:pb-28 xl:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-4">
                            <img src={avatarUrl || 'https://via.placeholder.com/300'} alt="Profile picture" className="max-w-full rounded-lg shadow-lg" />
                        </div>
                        <div className="md:col-span-8">
                            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{prefile?.user_name || '暂无'}</h1>
                            <p className="mt-5 text-lg text-gray-600">
                                {prefile?.introduction || '暂无'}
                            </p>
                            <div className="mt-8 flex">
                                <a href={'/updateProfile'} className="w-full hover:text-white md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600  md:py-4 md:text-lg md:px-10">
                                    修改个人信息
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
