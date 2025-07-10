import React from "react";
//import CheckBox from "../Components/CheckBox";
import { useEffect, useState } from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { ServerApi } from "../api/ServerApi";

// Import Styles
import './styles/greeting.css';
import './styles/common.css';

export default function GreetingsPage() {

 // Connect server class
 const serverApi = new ServerApi();

 //Состояние разметки
 const [isDisabled, setIsDisabled] = useState(true);
 const [isChecked, setIsChecked] = useState(false);
 //const [visibleStatus, setVisibleStatus] = useState("d-block");
 const [userFound, setUserFound] = useState(true);
 const [userFoundText, setUserFoundText] = useState('Ваша ссылка просрочена');
 const navigate = useNavigate();

 //Работа с Айпишниками
 const [currIp, setCurrIp] = useState('');
 const [ip, setIp] = useState('');

 //! Закрыть для локального тестирования
//const [operator_id, setOperatorId] = useState(searchParams.get("c"));
//const [user_id, setUserId] = useState(searchParams.get("u"));

 //? Открыть для локального тестирования
 const [operator_id, setOperatorId] = useState('1');
 const [user_id, setUserId] = useState('3071');


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

            
                const callArray = response.data.call;
                const payArray = response.data.pay;
                const siteArray = response.data.site;

            
                localStorage.setItem("phone", JSON.stringify(callArray));
                localStorage.setItem("pay", JSON.stringify(payArray));
                localStorage.setItem("site", JSON.stringify(siteArray));
            }
        });
    };

    async function getCountryByIP() {
        try {
            const response = await fetch('http://ip-api.com/json/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            if (data.status === 'fail') {
                // window.location.reload();
                setCurrIp('Произошла ошибка'); // или любое другое значение по умолчанию
            } else {
                setIp(data.query)
                setCurrIp(data.countryCode);
            }
        } catch (error) {
            console.error('Произошла ошибка при получении данных:', error);
            // window.location.reload();
            setCurrIp('Произошла ошибка'); // или любое другое значение по умолчанию
        }
    }

   //
    useEffect(() => {
        //console.log(operator_id, user_id);

        //Не переданы данные в ссылке
        if (!operator_id || !user_id) {
           // setVisibleStatus("d-none");
           setUserFound(false);
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

                           // document.getElementById("disable_link").classList.add("d-none");
                              setUserFound(true);
                        } else {
                           // document.getElementById("disable_link").classList.remove("d-none");
                           //   setUserFound(true);
                           // document.getElementById("disable_link").textContent = 'Пользователь не найден';
                              setUserFoundText('Пользователь не найден');
                        }
                    }
                });
            }
        } else {
          // setVisibleStatus("d-block");
             setUserFound(false);
            //Проверка разрешения на вход по ссылке. Проверяется временная метка. Действительна сутки
            const link_date = Date.now() / 1000;
            console.log(link_date);
            const body = {
                action: "getLinkActiveDate",
                data: {user_id: user_id, operator_id: operator_id, link_date: link_date,},
            };
            serverApi.sendPostRequest(body).then((response) => {
                if (response.status === 200) {
                    if (!response.data.success) {
                       setUserFound(true);
                      // document.getElementById("disable_link").classList.remove("d-none");
                      // setVisibleStatus("d-none");
                        localStorage.clear();
                    } else {
                        operatorInfo();
                    }
                }
            });
        }
        // localStorage.clear()
    }, [operator_id, user_id]);
    
       useEffect(() => {
        //! Пока прибито жестко
        setIp('');
        setCurrIp('RU');
       
         getCountryByIP();
        // const fetchData = async () => {
        //   try {
        //     const ipResponse = await axios.get('https://api.ipify.org?format=json');
        //     console.log(ipResponse?.data?.ip)
        //     getCountryByIP()
        //     // const ipResponse = await axios.get('http://ip-api.com/json');
        //     // const countryResponse = await axios.get(`https://ipapi.co/${ipResponse?.data?.ip}/json/`);
        //     // // console.log(ipResponse);
        //     // setIp(ipResponse?.data?.ip)
        //     // setCurrIp(countryResponse?.data?.country_code);
        //   } catch (error) {
        //     console.error('Произошла ошибка при получении данных:', error);
        //     // window.location.reload();
        //     setCurrIp('Поризошла ошибка'); // или любое другое значение по умолчанию
        //   }
        // };

        // fetchData();
    }, []);


    return(
        <div className="wrapper">
        <div className="container">
            <div className="row">
                <div className="col s12 center-align">
                   <h1>IDGOS <i className="icofont-bug"></i> </h1> 
                   <p><b>Добро пожаловать в IDGOS</b></p>
                   <p>Сервис для подписания документов через ГосУслуги</p>
                 {userFound && (  <p className="danger" id="disable_link"><b>{userFoundText}</b></p>) }
              
                  { currIp == 'RU' || currIp == 'UA' || currIp == 'BY' ?
                       (!userFound && <>    
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

                        </>) : (currIp == '' ? <img className="width30px" src="../img/VAyR.gif"/> :
                                (currIp == 'Поризошла ошибка' ?
                                        <p className={'text-center'}>
                                            Произошла ошибка , попробуйте перезагрузить страницу
                                        </p> :
                                        <div children={'center-align'}> 
                                            <p><b>Внимание!</b></p>
                                            <p>Нет возможности доступа.</p>
                                            <p>Ваш IP адрес принадлежит другой стране.</p>
                                            <p>Отключите VPN или вернитесь в матушку Россию, ведь здесь своих не бросают!</p>
                                            <p>IP адрес: {currIp}{' '}{ip}</p>
                                        </div>
                            ) )  }

                </div>  
            </div>
        </div>
       </div>
    )
}