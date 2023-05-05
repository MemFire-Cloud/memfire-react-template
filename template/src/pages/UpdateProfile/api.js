import { supabase } from '../../supabaseClient'

//获取用户个人信息

export const GetProfile = async (id) => {
    try {
        const { data: { user }, error } = await supabase
            .auth.getUser()
        if (error) {
            throw error
        } else {
            return user.user_metadata
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//修改用户个人信息

export const UpdateProfile = async (info) => {
    try {
        const { error } = await supabase.auth.updateUser({
            data: info
        })
        if (error) {
            throw error
        } else {
            return 'success'
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

//下载个人头像

export const UploadImage = async (filePath, file) => {
    try {

        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

        if (uploadError) {
            throw uploadError
        }else{
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}