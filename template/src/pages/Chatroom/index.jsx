import React, { useState, useEffect } from "react";
import { supabase } from '../../supabaseClient'
import { message } from "antd";
import { GetInitialMessages, SendMessages, GetProfile } from './api'
import { Layout, Row, Col, List, Avatar, Form, Input, Button } from 'antd';
import HeaderComponent from "../../components/Header";


const { Content } = Layout;

const ChatRoom = () => {
    const [form] = Form.useForm();
    const [messages, setMessages] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    //监听数据变化打开
    useEffect(async () => {
        const { data:{session}, error } = await supabase.auth.getSession();
        supabase
            .channel('public:messages')
            .on(
                'postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                GetInitialMessages().then(res => {
                    setMessages(res)
                }).catch(err => {
                    message.error(err)
                });
            }
            ).subscribe();
        if (session?.user?.id) {
            setUserInfo(session?.user)
        } else {
            message.error("请先登录")
        }

    }, [])
    // 获取列表
    useEffect(() => {
        GetInitialMessages().then(res => {
            setMessages(res)
        }).catch(err => {
            message.error(err)
        });
    }, [])
    const sendMessage = values => {
        SendMessages({ user_id: userInfo.id, message: values.message, avatar: userInfo.user_metadata.avatar, user_name: userInfo.user_metadata.user_name }).then((res) => {
            if (res) {
                form.resetFields();
            }
        }).catch(err => {
            message.error(err)
        })

    };
    return (
        <Layout style={{ height: '100vh' }}>
            <HeaderComponent type={'4'} />
            <Content style={{ padding: '50px', width: '70%' }}>
                <Row gutter={[16, 16]} className="h-4/5 overflow-y-auto">
                    <Col span={16}>
                        <List
                            itemLayout="horizontal"
                            dataSource={messages}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.imgUrl} />}
                                        title={item.user_name}
                                        description={item.message}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                <Form onFinish={sendMessage} form={form} className="w-4/5 relative -bottom-6" >
                    <Row gutter={[16, 16]}>
                        <Col span={16}>
                            <Form.Item name="message">
                                <Input placeholder="Type your message here" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    发送
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Content>
        </Layout>
    );
};

export default ChatRoom;