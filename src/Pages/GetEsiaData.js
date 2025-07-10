import React from "react";
import {useSearchParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import { ServerApi } from "../api/ServerApi";
import { setEsiaData } from "../functions/function";

import './styles/esia.css';

export default function GetEsiaData() 
{
    const operator_id = localStorage.getItem("operator_id");

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const esiaError = searchParams.get("error");
    const esiaCode = searchParams.get("code");
    const serverApi = new ServerApi();

    useEffect(()=> {
        if(esiaCode){
             const name = (operator_id === '1' || operator_id === '4' || operator_id === '85' || operator_id === '104') ? 'IDGOS' : 'INTRONEX';

               setEsiaData(esiaCode, name).then((response) => {
                const esia_token_expire = response.timestamp.exp;
                const esia_token = response.token;

                let expires = new Date(Number(esia_token_expire) * 1000);
                const operator_id = localStorage.getItem("operator_id");
                const user_id = localStorage.getItem("user_id"); 

                 //
                serverApi.setUserToken(user_id, operator_id, esia_token, esia_token_expire).then((response) => {
                    if (response) {
                        // const operator_id = localStorage.getItem('operator_id');
                        const user_id = localStorage.getItem('user_id');

                        const body = {
                            action: 'checkNoSignedDocs',
                            data: {
                                user_id: user_id,
                                operator_id: operator_id,
                            },
                        };

                        //
                        serverApi.sendPostRequest(body).then((response) => {
                            //console.log(response);
                            if (response.status === 200) {
                                if (response.data.documents.length == 0) navigate('/signed');
                            }
                        });
                    }
                    navigate("/doc");
                });
            });
        }
        if(esiaError){
            alert('К сожалению, возникла проблема при попытке загрузить данные. Пожалуйста, попробуйте повторно перейти по ссылке, которую мы отправили вам ранее на телефон.');
            navigate('/');
        }
    },[]);

    return (
       <div className="wrapper">
         <div className="container">
            <div className="row">
                <div className="col s12 center-align">
                    <h4 className="">Получение данных</h4>
                    <div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </div>
            </div>
         </div>
       </div>
    )
}