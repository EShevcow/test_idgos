import axios from "axios";

class ServerApi{
    
     constructor() {
        this.esiaUrl = 'https://esia.idgos.ru/esia/index.php?redirectUrl=';
        this.serverUrl = 'https://esia.idgos.ru/server/router.php';
        this.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwibG9naW4iOiJtYWthcmtpbiIsImlhdCI6MTcxNTg0MjU1OSwiZXhwIjoxNzE3MDUyMTU5fQ.1gteigYgoJs--14cAj272SDhVsDXRcv0EK1RLGJ_J6Q';
    }

   async getOperatorInfo(operator_id) {
        const body = JSON.stringify({
            action: 'getOperatorInfo',
            data: {
                operator_id: operator_id,
            }
        })
        return await axios.post('https://esia.idgos.ru/server/router.php', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    };

     async sendPostRequest(body) {
        return await axios.post('https://esia.idgos.ru/server/router.php', JSON.stringify(body), {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    };

     //
    async encryptShortUrl(url) {
        const body = JSON.stringify({
            action: 'encryptShortUrl',
            data: {
                url: url,
            },
        });
        return await axios.post('https://esia.idgos.ru/server/router.php', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    };

     //
    async updateHistoryStep(keys) {
        const body = JSON.stringify({
            action: 'updateHistoryStep',
            data: {
                operator_id: localStorage.getItem('operator_id'),
                user_id: localStorage.getItem('user_id'),
                keys: keys,
            },
        });
        return await axios.post('https://esia.idgos.ru/server/router.php', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    };

    //
    async getUrl(name) {
       
        return await axios.post(`${this.esiaUrl}https://app.idgos.ru/esia&operator_name=${name}`, '');
    };

     //
    async setUserToken(user_id, operator_id, token, time_exp) {
        const body = JSON.stringify({
            action: 'setUserToken',
            data: {
                user_id: user_id,
                operator_id: operator_id,
                token: token,
                time_exp: time_exp,
            },
        });
        return await axios.post('https://esia.idgos.ru/server/router.php', body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
        });
    };
}

export {ServerApi};