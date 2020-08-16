import React, { useState, useContext } from 'react';
import Input from '../../Common/components/form-elements/input/input';
import '../../admin/pages/authentication.scss';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../Common/util/validators/validators';
import { useForm } from '../../Common/custom-hooks/form-hook';
import Button from '../../Common/components/form-elements/button';
import Card from '../../Common/components/UIElements/card/card';
import { AuthContext } from '../../Common/context/auth-context';
import ErrorModal from '../../Common/components/UIElements/model/error-model';
import LoadingSpinner from '../../Common/components/UIElements/loading-spinner/loading-spinner';

const UserAuth = () => {
    const auth = useContext(AuthContext); //useContext is a special one, which will help us to pass some data obj without using props. we can use it like session.

    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }

        setIsLoginMode((prevMode) => !prevMode);
    };

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const submitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        if (isLoginMode) {
            try {
                /* fetch is not handles the error throwing from backend as 404, 500, etc.
           because they are also a valid response.
           so we have to handle them manually.
        */

                const response = await fetch(
                    'https://quiet-hollows-79620.herokuapp.com/api/user/login',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            //json to js
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        })
                    }
                );
                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message); // this will execute the catch block.
                }
                console.log(responseData);
                setIsLoading(false);
                auth.login(
                    responseData.userId,
                    responseData.token,
                    responseData.role
                ); //we called the login function of the auth-context. actullly its a empty function, but we have declared its values in app.js, we included the userid too.
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                setError(err.message || 'something went wrong!!!');
            }
        } else {
            //SIGN UP
            try {
                /* fetch is not handles the error throwing from backend as 404, 500, etc.
           because they are also a valid response.
           so we have to handle them manually.
        */
                const response = await fetch(
                    'https://quiet-hollows-79620.herokuapp.com/api/user/signup',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        })
                    }
                );
                const responseData = await response.json();
                if (!response.ok) {
                    console.log('whhhayyyy');
                    throw new Error(responseData.message); // this will execute the catch block.
                }
                console.log(responseData);
                setIsLoading(false);
                auth.login(
                    responseData.userId,
                    responseData.token,
                    responseData.role
                ); //we called the login function of the auth-context. actullly its a empty function, but we have declared its values in app.js
            } catch (err) {
                console.log(err);
                setIsLoading(false);
                setError(err.message || 'something went wrong!!!');
            }
        }
    };

    const errorModalCloser = () => {
        setError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorModalCloser}></ErrorModal>
            <Card className='authentication'>
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <h1>User Login</h1>
                <h2>Login Required</h2>
                <hr></hr>
                <form onSubmit={submitHandler}>
                    {!isLoginMode && (
                        <Input
                            onInput={inputHandler}
                            id='name'
                            element='input'
                            type='text'
                            label='Your Name'
                            errorText='Please enter a valid Name'
                            validators={[VALIDATOR_REQUIRE()]}
                        ></Input>
                    )}
                    <Input
                        onInput={inputHandler}
                        id='email'
                        element='input'
                        type='email'
                        label='Email'
                        errorText='Please enter a valid email'
                        validators={[VALIDATOR_EMAIL()]}
                    ></Input>
                    <Input
                        onInput={inputHandler}
                        id='password'
                        element='input'
                        type='password'
                        label='Password'
                        errorText='Minnimum length is 3 characters.'
                        validators={[VALIDATOR_MINLENGTH(3)]}
                    ></Input>
                    <Button type='submit' disabled={!formState.isValid}>
                        {isLoginMode ? 'LogIn' : 'SignUp'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    {isLoginMode ? 'Switch to SignUp' : 'Switch to Login'}
                </Button>
            </Card>

            <Card>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='admin-title'>
                            For Convenience of the Evaluators
                        </h1>
                    </div>
                    <div className='col-md-6' style={{ textAlign: 'center' }}>
                        <h2>Admin Login: </h2>
                        <p>https://st-frontend-live.herokuapp.com/auth</p>
                    </div>
                    <div className='col-md-6' style={{ textAlign: 'center' }}>
                        <h2>Manager Login:</h2>
                        <p>
                            https://st-frontend-live.herokuapp.com/auth-manager
                        </p>
                    </div>
                    <div
                        className='col-md-12'
                        style={{ textAlign: 'center', marginTop: '10px' }}
                    >
                        <h3>
                            **Also we have activated the signup route of the
                            admin for testing purposes.**
                        </h3>
                        <h4>
                            Heroku put the app status to sleep when no activity
                            for certain time. For that reason sometimes backend
                            server need to refresh. use this link to refresh
                            backend :
                            <a href='https://quiet-hollows-79620.herokuapp.com/api/categories/'>
                                {' '}
                                https://quiet-hollows-79620.herokuapp.com/api/categories/
                            </a>
                        </h4>
                    </div>
                </div>
            </Card>
        </React.Fragment>
    );
};
export default UserAuth;
