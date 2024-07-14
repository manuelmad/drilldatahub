import './Header.css';

import Image from "next/image";

export default function Header() {
    return(
        <header className='header'>
            <div></div>
            <div className='logo-container'>
                <Image
                    src='/DDH.png'
                    width={200}
                    height={200}
                    alt='DDH logo'
                />
            </div>
            <div></div>
        </header>
    );
}