import {useLocation} from 'react-router-dom';
import React from 'react';
import './check.css';

//
export default function CheckBox({label, checked, onChange}) {
    const {pathname} = useLocation();

    return (
        <label className="custom-checkbox" style={{padding: pathname == '/doc' ? '20px' : ''}}>
            <input type="checkbox" checked={checked} onChange={onChange}/>
            <span className="custom-checkbox__checkmark"/>
            {label &&
                <span className='custom-checkbox_label'>Я согласен с
                    <a href='https://idgos.ru/index.php?route=information/information&information_id=3'
                       className='target-link' target="_blank"> политикой конфиденциальности</a>
                </span>
            }
        </label>
    );
};