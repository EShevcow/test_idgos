import React from "react";
//import CheckBox from "../Components/CheckBox";
import { useEffect, useState } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { ServerApi } from "../api/ServerApi";


import './styles/greeting.css';

export default function GreetingsPage() {
    const serverApi = new ServerApi();

 const [isDisabled, setIsDisabled] = useState(true);
 const [isChecked, setIsChecked] = useState(false);
 const [visibleStatus, setVisibleStatus] = useState("d-block");
 const navigate = useNavigate();

 //! Закрыть для локального тестирования
//const [operator_id, setOperatorId] = useState(searchParams.get("c"));
//const [user_id, setUserId] = useState(searchParams.get("u"));

 //? Открыть для локального тестирования
 const [operator_id, setOperatorId] = useState('1');
 const [user_id, setUserId] = useState('3027');



  // check box, галочка активна или нет "Я согласен с политикой конфиденциальности"
 const handleCheckboxChange = () => {
    setIsChecked((prevState) => !prevState);
    setIsDisabled(!isDisabled);
 };

 // Клик кнопки продолжить "Продолжить"
 const handleButtonClick = () => {
        if (!isDisabled) {
            navigate("/view");
        }
    };

 //
    const operatorInfo = () => {
        localStorage.setItem("operator_id", operator_id);
        localStorage.setItem("user_id", user_id);

        //Название компании
        serverApi.getOperatorInfo(operator_id).then((response) => {
            //console.log(response);
            if (response.status == 200) {
                localStorage.setItem("operator_name", response.data.name);

                //! Было ранее
                // localStorage.setItem("phone", response.data.phone);
                // localStorage.setItem("site", response.data.site);

                const callArray = response.data.call;
                const payArray = response.data.pay;
                const siteArray = response.data.site;
                // Преобразуем массив в строку и сохраняем в localStorage
                localStorage.setItem("phone", JSON.stringify(callArray));
                localStorage.setItem("pay", JSON.stringify(payArray));
                localStorage.setItem("site", JSON.stringify(siteArray));
            }
        });
    };

   //
    useEffect(() => {
        //console.log(operator_id, user_id);

        //Не переданы данные в ссылке
        if (!operator_id || !user_id) {
            setVisibleStatus("d-none");
            // Разбор "короткого url"
            let currentURL = window.location.href;
            currentURL = currentURL.replace('http://localhost:3000', 'https://app.idgos.ru');
            if (currentURL.includes('/s/')) {
                serverApi.encryptShortUrl(currentURL).then((response) => {
                    //console.log(response);

                    if (response.status === 200) {
                        if (response.data.success) {
                            let q = response.data.data.original_url.replace('https://app.idgos.ru/?', '');
                            let q_arr = q.split('&');

                            setOperatorId(q_arr[1].replace('c=', ''));
                            setUserId(q_arr[0].replace('u=', ''));

                            document.getElementById("disable_link").classList.add("d-none");
                        } else {
                            document.getElementById("disable_link").classList.remove("d-none");
                            document.getElementById("disable_link").textContent = 'Пользователь не найден';
                        }
                    }
                });
            }
        } else {
            setVisibleStatus("d-block");
            //Проверка разрешения на вход по ссылке. Проверяется временная метка. Действительна сутки
            const link_date = Date.now() / 1000;
            const body = {
                action: "getLinkActiveDate",
                data: {user_id: user_id, operator_id: operator_id, link_date: link_date,},
            };
            serverApi.sendPostRequest(body).then((response) => {
                if (response.status === 200) {
                    if (!response.data.success) {
                        document.getElementById("disable_link").classList.remove("d-none");
                        setVisibleStatus("d-none");
                        localStorage.clear();
                    } else {
                        operatorInfo();
                    }
                }
            });
        }
        // localStorage.clear()
    }, [operator_id, user_id]);

    return(
        <div className="wrapper">
        <div className="container">
            <div className="row">
                <div className="col s12 center-align">
                   <h1>IDGOS <i class="icofont-bug"></i> </h1> 
                   <p><b>Добро пожаловать в IDGOS</b></p>
                   <p>Сервис для подписания документов через ГосУслуги</p>

                   <p className="danger d-none" id="disable_link"><b>Ваша ссылка просрочена</b></p>
                      <div className={visibleStatus}>          
                      <p>
                        <label>
                          <input type="checkbox"  checked={isChecked} onChange={handleCheckboxChange}/>
                          <span>Я согласен с <a href="https://idgos.ru/index.php?route=information/information&information_id=3" target="_blank">политикой конфиденциальности</a></span>
                        </label>
                     </p>

                     <a className="waves-effect waves-light btn btn-large"
                      onClick={handleButtonClick}
                      disabled={isDisabled} 
                      >Продолжить</a>

                      </div>

                </div>  
            </div>
        </div>
       </div>
    )
}