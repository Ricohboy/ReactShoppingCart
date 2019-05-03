import React from 'react';

import {Button} from 'react-bootstrap'

import firebase, { auth } from '../../Firebase';

import google from './btn_google_signin_dark_pressed_web.png';

class LogIn extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = async (authMethod) => {
        if (authMethod === "google"){
            //todo: signin with google
            const authProvider = new firebase.auth.GoogleAuthProvider();
            try{
                await auth.signInWithPopup(authProvider)
            } catch (error) {
                console.error(error)
            };
        } else if (authMethod === "anon"){
            //sign in with anon
            await auth.signInAnonymously();
        }
    }

    render() {
        return (
            <div className="authorization">
                <img src={google} alt="Sign In with Google" id="Google" className="auth"
                    onClick={(e)=>{this.handleClick('google')}}    
                />
                <br/>
                <Button className="auth" id="anon"
                    onClick={(e)=>{this.handleClick('anon')}}
                >
                    Sign In Anonomously (Can Not Recall Order)
                </Button>
            </div>
        )
    }
}

export default LogIn;