'use client';
import './loggedOutView.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Header from '../Header/Header';

export default function LoggedOutView({
    setMainViewDisplay,
    setLoggedOutViewDisplay,
    loggedOutViewDisplay,
    setLoginHeaderButton,
    setLogoutHeaderButton
}) {

    const logIn = ()=> {
        const auth = getAuth();
        const email = document.getElementById('user_email').value;
        const password = document.getElementById('user_password').value;

        if(email === '' || password === '') {
            alert('Por favor, ingrese correo electrónico y contraseña.');
            return;
        }
    
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
                //console.log('el usuario no está registrado');
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log('errorCode', errorCode);
            console.log('errorMessage', errorMessage);
            if(errorCode == 'auth/invalid-email') {
                alert('Correo electrónico inválido.');
            } else if(errorCode === 'auth/invalid-credential') {
                alert('Contraseña incorrecta.');
            }
        });
    }

    const showPassword = () => {
        const open_eye = document.querySelector('.bi-eye');
        open_eye.style.display = 'none';

        const closed_eye = document.querySelector('.bi-eye-slash');
        closed_eye.style.display = 'inline';

        const input_password = document.querySelector('#user_password');
        input_password.type = 'text';
    }

    const hidePassword = () => {
        const open_eye = document.querySelector('.bi-eye');
        open_eye.style.display = 'inline';

        const closed_eye = document.querySelector('.bi-eye-slash');
        closed_eye.style.display = 'none';

        const input_password = document.querySelector('#user_password');
        input_password.type = 'password';
    }

    const focusOnNextInput = (event) => {
        if (event.keyCode == 13) {
            document.querySelector('#user_password').focus();
        }
    }

    const focusOnLogInButton = (event) => {
        if (event.keyCode == 13) {
            document.querySelector('#login_btn').focus();
        }
    }

    return (
        <>
        {/* <Header></Header> */}
        <main style={loggedOutViewDisplay}>
            <section className="logged-out-container">
                <article>
                    <div className="company-logo-container">
                        <h1>DrillDataHub</h1>
                    </div>
                    <div className="user-login-container">
                        <p><label htmlFor="user_email">E-mail:</label></p>
                        <p>
                            <input type="email" id="user_email" placeholder="micorreoejemplo@gmail.com" autoFocus  onKeyDown={focusOnNextInput}></input>
                        </p>
                        <p><label htmlFor="user_password">Password:</label></p>
                        <p className="input-password-container">
                            <input type="password" id="user_password" onKeyDown={focusOnLogInButton}></input>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16" onClick={showPassword}>
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16" onClick={hidePassword}>
                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
                            </svg>
                        </p>
                        <p className="login-btn-container">
                            <button id="login_btn" onClick={logIn}>Log In</button>
                        </p>
                    </div>
                </article>
            </section>
        </main>
        </>
    );
}