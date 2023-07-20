import React, {useState} from 'react';
import Login from '../Account/Login';
import AdminHome from './AdminHome';
import Signup from '../Account/Signup';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className='homeWrapper'>
        {
            isLoggedIn ? <Signup/> : <Login/>
        }
    </div>
  )
}
