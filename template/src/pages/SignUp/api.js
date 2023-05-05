import { supabase } from '../../supabaseClient'

//认证模块API

//注册后创建用户信息表
export const SignUp = async (email, password) => {
    try {
        const { data: { user }, error } = await supabase.auth.signUp({ email, password })
        if (error) {
            throw error
        } else {
            return user
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}



