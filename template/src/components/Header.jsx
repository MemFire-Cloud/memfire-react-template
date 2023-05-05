import { React} from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout, Menu,  } from "antd";
import { SignOut } from '../pages/Profile/api'
const { Header } = Layout;

export default function HeaderComponent(props) {
    const navigate = useNavigate();
    let [searchParams] = useSearchParams()
    const signout = () => {
        SignOut().then((res) => {
            navigate("/");
        }).catch(err => {

        })
    }
    return (
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[props.type]}>
                    <Menu.Item key="2"><a href={'/crud?id=' + searchParams.get('id')}>CRUD</a> </Menu.Item>
                    <Menu.Item key="3"><a href={'/filestorage?id=' + searchParams.get('id')}>网盘</a></Menu.Item>
                    <Menu.Item key="4"><a href={'/chatroom?id=' + searchParams.get('id')}>聊天室</a></Menu.Item>
                    <Menu.Item key="1"><a   href={'/profile?id=' + searchParams.get('id')}>个人信息</a></Menu.Item>
                    <a className="absolute right-5" onClick={signout}>退出登录</a>
                </Menu>
            </Header>
            )
    
};


