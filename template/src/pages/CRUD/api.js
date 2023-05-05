import { supabase } from '../../supabaseClient'
//列表模块API
// 获取列表数据
export const FetchTodo = async () => {
    try {
        const { data, error } = await supabase
            .from('todo_list')
            .select('*')
        if (error) {
            throw error
        } else {
            return data.length > 0 ? data.length : 0
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
// 分页查询
export const FetchPage = async (start, end) => {
    try {
        const { data, error } = await supabase
            .from('todo_list')
            .select('*')
            .order('created_at', { ascending: false })
            .range(start, end)
            .limit(10);
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
// 模糊查询
export const SearchText = async (query) => {
    try {
        const { data, error } = await supabase
            .from('todo_list')
            .select('*').order('created_at', { ascending: false }).filter('todo', 'ilike', `%${query.todo ? query.todo : ''}%`).filter('completed', 'eq', query.completed)
            .limit(10);
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//修改列表数据
export const UpdateTodo = async (update, id) => {
    try {
        const { error } = await supabase
            .from('todo_list')
            .update(update)
            .eq('id', id)
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//添加数据
export const AddTodo = async (todo) => {
    try {
        const { error } = await supabase
            .from('todo_list')
            .insert(todo)
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//删除数据
export const DeleteTodo = async (id) => {
    try {
        const { error } = await supabase
            .from('todo_list')
            .delete()
            .eq('id', id);
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
