import './Header.css';

import Image from "next/image";

export default function Header() {
    return(
        <header className='header'>
            <div className='personal-logo-container'>
                <Image
                    src='/personal-logo.png'
                    width={312}
                    height={107}
                    alt='DDH logo'
                />
            </div>
            <div className='logo-container'>
                <Image
                    src='/DDH.png'
                    width={200}
                    height={200}
                    alt='DDH logo'
                />
            </div>
            <div className='login-btn__container'>
                <button id='login_btn'>Log In</button>
            </div>
        </header>
    );
}