import React from 'react';

import firebase, { auth } from '../../Firebase';

class LogIn extends React.Component{
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = async (e) => {
        const authMethod = e.target.id;
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
            <div className="authorization" onClick={(e)=>this.handleClick(e)}>
                <div className="authButton" id="google">
                    Sign In with Google
                </div>
                <div className="authButton" id="anon">
                    Sign In Anonomously (Can Not Recall Order)
                </div>
            </div>
        )
    }
}

export default LogIn;