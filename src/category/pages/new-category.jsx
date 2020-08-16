import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom'; // to redirect the user to new location
import Input from '../../Common/components/form-elements/input/input';
import ImageHandler from '../../Common/components/form-elements/image-handler/image-handler';
import { VALIDATOR_REQUIRE } from '../../Common/util/validators/validators';
import Button from '../../Common/components/form-elements/button';
import { useForm } from '../../Common/custom-hooks/form-hook';
import { useHttpClient } from '../../Common/custom-hooks/http-hook';

import ErrorModal from '../../Common/components/UIElements/model/error-model';
import LoadingSpinner from '../../Common/components/UIElements/loading-spinner/loading-spinner';
import { AuthContext } from '../../Common/context/auth-context';
import './new-category.scss';
import axios from 'axios';

const NewCategory = () => {
    const auth = useContext(AuthContext);
    const history = useHistory(); // to redirect the user to new location.

    const { isLoading, error, sendRequest, errorPopupCloser } = useHttpClient();

    const [formState, inputHandler] = useForm(
        /* Object destructuring - according to (custom)form-hook -> useForm function, it return the formState and inputHandle. so using destructuring we can catch their values easily.  */
        {
            name: {
                value: '',
                isValid: false
            },
            image: {
                value: null,
                isValid: false
            }
        },
        false
    );

    const categorySubmitHandler = async (event) => {
        event.preventDefault();
        console.log(formState.inputs);
        /* 
    In here, we have to pass a image too, but images has a binary data type
    so we can't pass binary data using JSON.
    therefore, we have to use FormData, which is a browser API.
    */
        try {
            const formData = new FormData();
            formData.append('name', formState.inputs.name.value); //fist parameter is the key, we will catch this requst in backend using this key.
            formData.append('image', formState.inputs.image.value);
            axios({
                method: 'POST',
                url:
                    'https://quiet-hollows-79620.herokuapp.com/api/categories/',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(function (response) {
                    //handle success
                    console.log(response);
                })
                .catch(function (response) {
                    //handle error
                    console.log(response);
                });
            // await sendRequest(
            //     'https://quiet-hollows-79620.herokuapp.com/api/categories/',
            //     'POST',
            //     formData,
            //     { Authorization: 'Bearer ' + auth.token }
            // );
            console.log(formState.inputs);
            history.push('/'); //redirecting user to main page
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorPopupCloser}></ErrorModal>
            <h1 className='admin-title'>New Category</h1>
            <form className='place-form' onSubmit={categorySubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <Input
                    onInput={inputHandler}
                    id='name'
                    element='input'
                    type='text'
                    label='Name'
                    errorText='Name should not be empty!!'
                    validators={[VALIDATOR_REQUIRE()]}
                ></Input>
                <ImageHandler
                    id='image'
                    center
                    onInput={inputHandler}
                ></ImageHandler>

                <Button type='submit' disabled={!formState.isValid}>
                    Add Category
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewCategory;
