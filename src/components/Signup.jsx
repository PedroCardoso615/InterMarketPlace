import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
        await createUserWithEmailAndPassword(auth, email, password);
        } catch(err) {
            console.log(err);
        }
    };

    return(
        <div>
            <input 
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
            />
            <input  
            placeholder="Password..."
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={signIn}>Sign In</button>
        </div>
    );
}