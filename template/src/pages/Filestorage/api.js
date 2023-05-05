import { supabase } from '../../supabaseClient'
import { formatTime } from '../../util'
//上传文件
export const UploadFile = async (files) => {
    try {
        const file = files
        // const fileExt = file.name.split('.').pop()
        // const fileName = `${Math.random()}.${fileExt}`
        // const filePath = `${fileName}`
        const { data, error } = await supabase
            .storage
            .from('files')
            .upload(file.name, file, {
                cacheControl: '3600',
            })
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//下载文件
export const DownloadFile = async (filename) => {
    try {
        const { data, error } = await supabase
            .storage.from('files')
            .download(filename)
        if (error) {
            throw error
        } else {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(data);
            link.download = filename;
            link.click();
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//删除文件
export const removeFile = async (filename) => {
    try {
        const { data, error } = await supabase
            .storage.from('files')
            .remove(filename)
        if (error) {
            throw error
        } else {
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//获取文件
export const ListFile = async () => {
    try {
        const { data, error } = await supabase
            .storage.from('files')
            .list()
        if (error) {
            throw error
        } else {
            if(data.length>0){
                data.map(item =>{
                    item.created_at = formatTime(item.created_at)
                    item.size = item.metadata.size;
                    delete item.metadata;
                })
            }
            return data
        }
    } catch (error) {
        throw error.message || error.error_description
    }
}
//或者不同类型文件
export const ListProfixFile = async (type) => {
    // debugger;

    try {
        const { data, error } = await supabase
            .storage.from('files')
            .list()
        if (error) {
            throw error
        } else {
            let res = []
            if(data.length>0){
                data.map((item,index) =>{
                    // .doc,.xml,.docx,
                    if(type === 'file'){
                        if(item.name.slice(item.name.lastIndexOf('.')+1) === 'doc' || item.name.slice(item.name.lastIndexOf('.')+1) === 'xml' || item.name.slice(item.name.lastIndexOf('.')+1) === 'docx'){
                            item.created_at = formatTime(item.created_at)
                            item.size = item.metadata.size;
                            delete item.metadata;
                            res.push(item)
                        }
                    }else if(type === 'img'){
                        if(item.name.slice(item.name.lastIndexOf('.')+1) === 'jpg' || item.name.slice(item.name.lastIndexOf('.')+1) === 'png'){
                            item.created_at = formatTime(item.created_at)
                            item.size = item.metadata.size;
                            delete item.metadata;
                            res.push(item)
                        }
                    }else if(item.name.slice(item.name.lastIndexOf('.')+1) === type){
                        item.created_at = formatTime(item.created_at)
                        item.size = item.metadata.size;
                        delete item.metadata;
                        res.push(item)
                    }

                })
            }
            return res
        }
    } catch (error) {
        throw error.message || error.error_description
    }



    // try {
    //     const { data, error } = await supabase
    //         .storage.from('files')
    //         .list(`.${type}`,{ prefix: type })
    //     if (error) {
    //         throw error
    //     } else {
    //         if(data.length>0){
    //             data.map(item =>{
    //                 item.created_at = formatTime(item.created_at)
    //                 item.size = item.metadata.size;
    //                 delete item.metadata;
    //             })
    //         }
    //         return data
    //     }
    // } catch (error) {
    //     throw error.message || error.error_description
    // }
}