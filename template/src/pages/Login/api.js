import { supabase } from '../../supabaseClient'

//认证模块API


//登录
export const UserLogin = async (email, password) => {
    try {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            throw error
        } else {
            return user
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}


