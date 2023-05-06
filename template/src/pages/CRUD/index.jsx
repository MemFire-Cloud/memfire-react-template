import { useState, useEffect } from 'react';
import { supabase } from "../../supabaseClient";
import { Space, Table, Button, Form, Input, Popconfirm, Layout, Modal, Pagination,message,Switch } from 'antd';
import { FetchTodo, FetchPage, SearchText, UpdateTodo, AddTodo, DeleteTodo } from './api'
import HeaderComponent from "../../components/Header";
const { Content } = Layout;
const layout = {
    labelCol: { span: 8  },
    wrapperCol: { span: 16 },
};

const TableList = () => {
    const [addModel, setAddModel] = useState(false);
    const [editModel, setEditModel] = useState(false);
    const [todo_id, setTodoId] = useState(null);
    const [todoList, setTodoList] = useState([]);
    const [todoInfo, setTodoInfo] = useState();
    const [completed, setCompleted] = useState();
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(0);
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(9);
    const onFinishSearch =  (values) => {
        if(!values.todoInfo.completed){
            values.todoInfo.completed = false
        }
        SearchText(values.todoInfo).then((res) => {
            setStart(0)
            setEnd(9)
            setTodoList(res)
        }).catch(err => {
            message.error(err)
        })
    };
    const handleOk =  async () => {
        const { data:{session}, error } = await supabase.auth.getSession()
        if (addModel) {
            AddTodo({ todo: todoInfo, completed: completed,user_id: session.user.id }).then((res) => {
                getTodoList(start, end)
                setAddModel(false);
                setEditModel(false)
            }).catch(err => {
                message.error(err)
            })
        } else if (editModel) {
            UpdateTodo({ todo: todoInfo, completed: completed  },todo_id).then((res) => {
                getTodoList(start, end)
                setAddModel(false);
                setEditModel(false)
            }).catch(err => {
                message.error(err)
            })
        }

    };

    const handleCancel = () => {
        setAddModel(false);
        setEditModel(false)
    };
    function edit(item) {
        setCompleted(item.completed)
        setTodoInfo(item.todo)
        setEditModel(true)
        setTodoId(item.id)
    }
    const del =  (id) => {
        DeleteTodo(id).then((res) => {
            getTodoList(start, end)
        }).catch(err => {
            message.error(err)
        })
    }
    const getTodoList =  (start, end) => {
        FetchPage(start, end).then((res) => {
            setTodoList(res)
        }).catch(err => {
            message.error(err)
        })
    };
    const allCount =  () => {
        FetchTodo().then((res) => {
            setTotal(res)
        }).catch(err => {
            message.error(err)
        })
    }
    // 获取列表
    useEffect(() => {
        getTodoList(start, end);
        allCount()
    }, [])
    // 获取列表
    useEffect(() => {
        setStart(current * 10 - 10)
        setEnd(current * 10 - 1)
        getTodoList(current * 10 - 10, current * 10 - 1);
    }, [current])
    const validateMessages = {
        required: '${label} is required!',
    };
    const columns = [
        {
            title: '待办事项',
            dataIndex: 'todo',
            key: 'todo',
            render: (text) => <span>{text}</span>,
        },
        {
            title: '是否完成',
            dataIndex: 'completed',
            key: 'completed',
            render: (text) => <span>{text === true ? '完成' : '未完成'}</span>,
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm title="确认删除？" onConfirm={() => del(record.id)}>
                        <Button danger>删除</Button>
                    </Popconfirm>
                    <Button onClick={(e) => { edit(record) }}>编辑</Button>
                </Space>
            ),
        },
    ];
    return (
        <Layout className='min-h-screen'>
        <HeaderComponent type={'2'}/>
            <Space direction="vertical" style={{ width: '100%', padding: '0 100px' }} size={[0, 48]}>
                <Layout>
                    <Space className='mt-10 mb-10'>
                        <Form
                            {...layout}
                            layout="inline"
                            name="nest-messages"
                            onFinish={onFinishSearch}
                            validateMessages={validateMessages}
                        >
                            <Form.Item name={['todoInfo', 'todo']} label="代办事项">
                                <Input autocomplete="off" />
                            </Form.Item>
                            <Form.Item style={{ width: '200px' }}  name={['todoInfo', 'completed']} label="是否完成">
                            <Switch />
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="default" htmlType="submit">
                                    查询
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button type="default" htmlType="reset">
                                    重置
                                </Button>
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                                <Button onClick={() => setAddModel(true)} type="default" >
                                    添加
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                    <Content>
                        <Table columns={columns} pagination={false} dataSource={todoList} />
                        <Pagination className='mt-10 mb-10' defaultCurrent={1} total={total}
                            onChange={(page) => setCurrent(page)}
                        />
                    </Content>
                </Layout>

                <Modal title={addModel ? '新增' : '编辑'} open={addModel || editModel} onOk={handleOk} onCancel={handleCancel}>
                    <div className="mb-5 flex items-end mt-10">
                        <label className="block font-bold mb-2 w-1/6" htmlFor="name">
                            待办事项 :
                        </label>
                        <Input
                            autocomplete="off"
                            className="w-full px-3 py-2 border rounded-md w-9/12"
                            id="name"
                            type="text"
                            value={todoInfo}
                            onChange={(event) => setTodoInfo(event.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5 flex items-end">
                        <label className="block font-bold mb-2 w-1/6" htmlFor="name">
                            是否完成 :
                        </label>
                        <Switch
                            checked={completed}
                            onChange={(checked) => setCompleted(checked)}
                            required
                        />
                    </div>
                </Modal>
            </Space>
        </Layout>
    );
};

export default TableList;