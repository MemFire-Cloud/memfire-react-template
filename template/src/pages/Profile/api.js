import { supabase } from '../../supabaseClient'

//认证模块API

//退出登录
export const SignOut = async () => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}


//监听用户认证信息变更，及时拦截路由

export const OnAuthStateChange = async () => {
    supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
            return session
        } else {
            return null
        }
    })
}

//获取用户个人信息

export const GetProfile = async (id) => {
    try {
        const { data, error } = await supabase
            .from('profile')
            .select("*").eq('id', id)
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}


//下载个人头像

export const DownloadImage = async (path) => {
    try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
            throw error
        } else {
            const url = URL.createObjectURL(data)
            return url
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
