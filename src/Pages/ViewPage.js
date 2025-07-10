import React from "react";
import { ServerApi } from "../api/ServerApi";
import { useState } from "react";
import refreshIcon from "../libs/img/refresh.svg";

import "./styles/view.css";
import "./styles/common.css";

export default function ViewPage(){

    const operator_name = localStorage.getItem('operator_name');
    const operator_id = localStorage.getItem("operator_id");
    const serverApi = new ServerApi();

    const [esiaUrl, setEsiaUrl] = useState(false);
    const decodedOpertorName = operator_name.replace(/&quot;/g, '"');

    const nextStep = () => {
        const name = (operator_id === '1' || operator_id === '4' || operator_id === '85' || operator_id === '104') ? 'IDGOS' : 'INTRONEX';
        setEsiaUrl(true);

        const keys = ['step_2'];
        serverApi.updateHistoryStep(keys).then((response) => {
            console.log(response);
        });

         //Формирование ссылки ЕСИА и перенаправление на форму авторизации
        serverApi.getUrl(name).then((response) => {
            //console.log(response.data.url);
            window.location.replace(response.data.url);
        });
    };

   return(
  <div className="wrapper">
    
     <div className="container">
        <div className="row">
            <div className="col s12 center-align">
               <h1>IDGOS <i className="icofont-bug"></i></h1>  
               <p>Уважаемый Абонент, Вы находитесь в Сервисе для <br/> заключения договора на Услуги связи с Компанией {decodedOpertorName}</p>
               <p><b>Подписание договора на услуги будет в три этапа, на раз два три</b></p>

                 <table className="centered striped">
                    <thead>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                      <td>Авторизация (Госуслуги)</td>
                      <td>Ознакомление с договором</td>
                      <td>Подписание через СМС</td>
                    </tr>
                    </tbody>
                </table> 
                <p>   
                 Нажимая продолжить Вы даёте согласие на обработку <br/> Персональных данных {decodedOpertorName}, а
                 также его <br/> коммерческому представителю ООО «Синтегра»
                </p>
            </div>
        </div>
     </div>
    <div className="fixed-bottom">
     <button className="waves-effect waves-light btn-large" onClick={nextStep} disabled={esiaUrl}>
     {esiaUrl && ( <span className={'loader-cont'}>
        <img className="objRotate" id={'balance-loading'} src={refreshIcon} alt={'refreshIcon'} width="15px"/>
        <span>Перенаправление на Госуслуги</span>
      </span>) }
      {!esiaUrl && (<span>Продолжить</span>)}
       
     </button>
    </div>
  </div>
    
   ) 
}