import React, { useState } from 'react';
import './Join.css';
import icon from '../../images/icon.png';
import { Link } from 'react-router-dom';


let user;

const sendUser = () => {    // on click function will call
    user = document.getElementById('Input').value;  // input take & store in user variable 
    document.getElementById('Input').value = "";    // after sending user on next page input field will empty
}

const Join = () => {

    const [name , setName ] = useState(""); // useState is use to prevent going on next page without filling input field


    return (
        <div className='Page'>
            <div className='Container'>
                <img src={icon} alt="icon" />
                <h1>Chat ...</h1>
                <input onChange={(e) => setName(e.target.value)} type="text" id="Input" placeholder='Enter Your Name' />
                <Link onClick={(e) => !name ? e.preventDefault() : null } to='/chat'>   
                    <button onClick={sendUser} className='Button'>Start Chat</button>
                </Link>
            </div>
        </div>
    )
}

export default Join;
export {user};              // send use on next page;