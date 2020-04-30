import React, { useState, useEffect, useContext } from 'react';
import './styles.scss';
import { motion } from "framer-motion"
import { ReactComponent as SVGicon } from '../../assets/accusoft.svg';
import AuthContext from '../../contexts/AuthContext';


const SignUpForm = (props) => {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ populatedCreds, setPopulatedCreds ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const { signup } = useContext(AuthContext);

    const handleOnSubmit = (event) => {
        event.preventDefault()
    }

    const handleOnChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleOnChangePassword = (event) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        (username !== "" && password !== "" )? setPopulatedCreds(true) : setPopulatedCreds(false);
    }, [username, password]);

    const fakeUsernameValidation = () => {
        setIsLoading(true);
            signup({
                username: username,
                password: password
            })
            .then(()=> setIsLoading(false))
            .then(()=> props.history.push("/protected"))
            .catch(err => {
                setIsLoading(false);
                setPopulatedCreds(false);
            });
    };

    return (
        <div className="container signin-card">
            { !isLoading ? (
                <div>
                    <div className="row">
                        <SVGicon className="mx-auto svg-icon" />
                    </div>
                    <div className="row">
                        <div className="signin-title">Sign Up to MERN Template</div>
                    </div>
                    <div className="row">
                        <form className="signin-form" onSubmit={handleOnSubmit} >
                            <div className="row">
                                <input 
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    className="signin-input"
                                    autoComplete="off"
                                    onChange={handleOnChangeUsername}
                                />
                                <input 
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    className="signin-input"
                                    autoComplete="off"
                                    onChange={handleOnChangePassword}
                                />
                            </div>
                            <div className="row">
                                <motion.button
                                    className={'continue-button ' + 
                                        ((username !== "" && password !== "") ? (
                                            populatedCreds ? 'isPopulated' : 'isNotPopulated'
                                            ) : "" )}
                                    onClick={fakeUsernameValidation}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Sign Up
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>) : (
                <div>  
                    <div className="loading-text">Please wait ...</div>
                    <div className="nb-spinner" />
                </div>
                )
            }
        </div>

    );
}
 
export default SignUpForm;