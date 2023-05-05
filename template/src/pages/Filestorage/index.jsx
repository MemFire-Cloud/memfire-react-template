import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';
import { Layout, Menu, Upload, message, Button, Table, Divider, Popconfirm } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { UploadFile, DownloadFile, removeFile, ListFile, ListProfixFile } from './api'
import HeaderComponent from "../../components/Header";

const { Content, Sider } = Layout;


const Flie = () => {
    const [fileList, setFileList] = useState([]);
    const [openKeys, setOpenKeys] = useState(['all']);
    useEffect(() => {
        listFile()
    }, [])
    const handleUpload = (file) => {
        const fileSize = file.size / 1024 / 1024 < 5;
        if (!fileSize) {
            message('图片应当小于5MB!', 1000)
        }
        return fileSize;
    };
    const customRequest = (option) => {
        UploadFile(option.file).then(res => {
            message.success('上传成功');
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const listFile = () => {
        ListFile().then(res => {
            setFileList(res)
        }).catch(err => {
            message.error(err);
        });
    };
    const downloadFile = (record) => {
        DownloadFile(record.name).then(res => {
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const deleteFile = (record) => {
        removeFile(record.name).then(res => {
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const changeMenu = (key) => {
        if (key.key === 'all') {
            listFile()
        } else {
            ListProfixFile(key.key).then(res => {
                setFileList(res)
            }).catch(err => {
                message.error(err);
            });
        }

    };
    const columns = [
        {
            title: "文件名称",
            dataIndex: "name",
            key: "name",
            render: (text) => <a href="#">{text}</a>,
        },
        {
            title: "大小",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>

                    <Button type="link" onClick={() => downloadFile(record)} icon={<DownloadOutlined />}>
                        下载
                    </Button>
                    <Divider type="vertical" />
                    <Popconfirm title="确认删除？" onConfirm={() => deleteFile(record)} >
                        <Button danger>删除</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];
    return (
        <Layout style={{ height: '100vh' }}>
            <HeaderComponent type={'3'}/>
            <Content>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu mode="inline" defaultSelectedKeys={["all"]} openKeys={openKeys} style={{ height: "100%", borderRight: 0 }} onClick={changeMenu}>
                        <Menu.Item key="all">全部文件</Menu.Item>
                        <Menu.Item key="file">文件</Menu.Item>
                        <Menu.Item key="img">图片</Menu.Item>
                        <Menu.Item key="mp4">视频</Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: "0 24px 24px" }}>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <Upload accept=".doc,.xml,.docx,.jpg,.mp4" showUploadList={false} customRequest={customRequest} beforeUpload={(file) => handleUpload(file)}>
                                <Button icon={<UploadOutlined />}>上传文件</Button>
                            </Upload>
                        </div>
                        <Table columns={columns} dataSource={fileList} />
                    </Content>
                </Layout>
            </Layout>
            </Content>
            
        </Layout>
    );
};

export default Flie;