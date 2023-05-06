import { supabase } from '../../supabaseClient'

//认证模块API

//退出登录
export const SignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error.message || error.error_description.message || error.error_description
        } else {
            return 'success'
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



//下载个人头像

export const DownloadImage = async (path) => {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
            throw error.message || error.error_description
        } else {
            const url = URL.createObjectURL(data)
            return url
        }
}
