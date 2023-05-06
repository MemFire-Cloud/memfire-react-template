import { supabase } from '../../supabaseClient'


//修改用户个人信息

export const UpdateProfile = async (info) => {
        const { error } = await supabase
            .auth.updateUser({
                data: info
            })
        if (error) {
            throw error.message || error.error_description
        } else {
            return 'success'
        }
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

//下载个人头像

export const UploadImage = async (filePath, file) => {
        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)
        if (uploadError) {
            throw uploadError
        } else {
            return 'success'
        }
}
