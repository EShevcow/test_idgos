import {ServerApi} from "../api/ServerApi";
import axios from "axios";
import CryptoJS from "crypto-js";

//Можно(даже нужно) объединить с getEsiaData
export async function setEsiaData(esia_code, name) {
    window.history.pushState({}, document.title, window.location.pathname);
    return getEsiaData(esia_code, name).then((response) => {
        if (response) {
            localStorage.setItem("esiaAuth", true);
            localStorage.setItem(
                "esiaDataEncrypt",
                encrypt(JSON.stringify(response))
            );

            // console.log(response);
            return response.token_data;
        }
    });

//Получение данных ЕСИА по коду
}

export function getEsiaData(esia_code, name) {
    return new Promise(function (resolve, reject) {
        //fetch(`https://esia.idgos.ru:8788/response.php?code=${esia_code}`)
        fetch(`https://esia.idgos.ru:8788/response.php?code=${esia_code}&operator_name=${name}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.data) {
                    const esia_data = data.data;
                    resolve(esia_data);
                } else {
                    resolve(undefined);
                }
            });
    });
}

export function encrypt(txt) {
    const _key = "secret";
    return CryptoJS.AES.encrypt(txt, _key).toString();
}