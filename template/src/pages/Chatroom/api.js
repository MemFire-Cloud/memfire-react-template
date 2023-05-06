import { supabase } from '../../supabaseClient'


//更新聊天室
export const GetInitialMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select()
        if (error) {
            throw error.message || error.error_description
        } else {
            if (data.length > 0) {
                const responses = [];
                for (const item of data) {
                    item.imgUrl = await DownloadImage(item.avatar);
                    responses.push(item);
                }
            }
            return data
        }
    }

//发送聊天信息
export const SendMessages = async (msg) => {
        const { error } = await supabase
            .from('messages')
            .insert(msg)
        if (error) {
            throw error.message || error.error_description
        } else {
            return 'success'
        }
}

//中断所有realtime
export const RemoveAllChannels = async () => {
    supabase.removeAllChannels()
}


//下载个人头像

const DownloadImage = async (path) => {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
            throw error.message || error.error_description
        } else {
            const url = URL.createObjectURL(data)
            return url
        }
}
