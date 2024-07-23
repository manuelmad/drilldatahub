import './Header.css';

import Image from "next/image";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function Header({
    setMainViewDisplay,
    setLoggedOutViewDisplay,
    loginHeaderButton,
    logoutHeaderButton,
    setLoginHeaderButton,
    setLogoutHeaderButton
}) {
    const auth = getAuth();

    const logIn = ()=> {
        const auth = getAuth();
        const email = document.getElementById('user_email').value;
        const password = document.getElementById('user_password').value;
    
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Logged in
            if(userCredential) {
                const user = userCredential;
                console.log('Bienvenido '+ email);
                setMainViewDisplay({display:'block'});
                setLoggedOutViewDisplay({display:'none'});
                setLoginHeaderButton({display:'none'});
                setLogoutHeaderButton({display:'block'});
            } else {
                console.log('el usuario no está registrado');
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    const logOut = ()=> {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            // document.getElementById('user_password').value = '';
            console.log('Se ha cerrado sesión exitosamente');
            setMainViewDisplay({display:'none'});
            setLoggedOutViewDisplay({display:'block'});
            setLoginHeaderButton({display:'block'});
            setLogoutHeaderButton({display:'none'});
        }).catch((error) => {
            // An error happened.
            console.log('error on signOut: ', error);
        });
    }
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
            <div className='buttons__container'>
                <button id='login_btn_header' onClick={logIn} style={loginHeaderButton}>Log In</button><button id='logout_btn_header' onClick={logOut} style={logoutHeaderButton}>Log Out</button>
            </div>
        </header>
    );
}