export const GLOBAL_TYPES = {
    AUTH: "AUTH",
    ALERT: "ALERT",
    THEME: 'THEME',
    STATUS: 'STATUS',
    MODAL: 'MODAL',
    SOCKET: 'SOCKET',
    ONLINE: 'ONLINE',
    OFFLINE: 'OFFLINE',
    CALL: 'CALL',
    PEER: 'PEER',
    FORGOT: 'FORGOT_PASS',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}

export const EditData = (data, id, post) => {
    const newData = data.map(item => 
        (item._id === id ? post : item)
    )
    return newData;
}

export const DeleteData = (data, id) => {
    const newData = data.filter(item => (item._id ? item._id : item) !== id)
    return newData;
}

export const AddData = (data,post) => {
    const newData = data.push(post)
    return newData;
}