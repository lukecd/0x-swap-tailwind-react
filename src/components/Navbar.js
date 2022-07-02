import '../index.css';


import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import {FaBars, FaTimes} from 'react-icons/fa';


/**
 * @returns Top navigation bar
 */
const Navbar = () => {
    const [nav, setNav] = useState(false);
    const handleClick = () => setNav(!nav);

    return (
        <div className='fixed w-full h-[90px] flex justify-end items-center text-[#15274c] z-10 bg-pink-700'>
   
            <div className='mr-5'>
                <ConnectButton showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar