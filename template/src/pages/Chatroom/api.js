import { supabase } from '../../supabaseClient'


//更新聊天室
export const GetInitialMessages = async () => {
    try {
        const { data, error } = await supabase
            .from('messages')
            .select(`id,message,profile (id,avatar,user_name)`)
        if (error) {
            throw error
        } else {
            if (data.length > 0) {
                const responses = [];
                for (const item of data) {
                    item.imgUrl = await DownloadImage(item.profile.avatar);
                    responses.push(item);
                }
            }
            return data

        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//发送聊天信息
export const SendMessages = async (msg) => {
    try {
        const { error } = await supabase
            .from('messages')
            .insert(msg)
        if (error) {
            throw error
        } else {
            return 'success'
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}

//中断所有realtime
export const RemoveAllChannels = async () => {
    supabase.removeAllChannels()
}

//获取用户信息
export const GetProfile = async (id) => {
    try {
        const { data, error } = await supabase
            .from('profile')
            .select("*").eq('id', id)
        if (error) {
            throw error
        } else {
            return data[0]
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}


//下载个人头像

const DownloadImage = async (path) => {
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
