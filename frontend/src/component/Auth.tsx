import { useForm } from "react-hook-form";
import { User } from "../models/user";
import { LoginCredentials } from "../network/todo_api";
import * as NotesApi from "../network/todo_api";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import TextInputField from "./form/TextInputField";

import { useState } from 'react';
import { UnauthorizedError } from "../errors/http_errors";
import styleUtils from "../style/utils.module.css";
import { Link } from 'react-router-dom';


interface LoginModalProps {
    onDismiss: () => void,
    onLoginSuccessful: (user: User) => void,
}

const LoginModal = ({ onDismiss, onLoginSuccessful }: LoginModalProps) => {

    const [errorText, setErrorText] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginCredentials>();

    async function onSubmit(credentials: LoginCredentials) {
        try {
            const user = await NotesApi.login(credentials);
            onLoginSuccessful(user);
            window.location.href = "http://localhost:3000/home";
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                setErrorText(error.message);
            } else {
                alert(error);
            }
            console.error(error);
        }
    }

    return (
        <Modal show
            style={{
                background: "skyblue",

            }}
        >
            <Modal.Header
                className={`${styleUtils.test1}`} >
                <Modal.Title>
                    Project Compass
                </Modal.Title>
            </Modal.Header>

            <Modal.Body
                style={{
                    background: "antiquewhite",
                    width: '500px', height: '400px'
                }}
            >
                {errorText &&
                    <Alert variant="danger">
                        {errorText}
                    </Alert>
                }
                <Form onSubmit={handleSubmit(onSubmit)}
                >
                    <TextInputField
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.username}
                    />
                    <TextInputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Password"
                        register={register}
                        registerOptions={{ required: "Required" }}
                        error={errors.password}
                    />
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={styleUtils.width100}
                    >
                        Log In
                    </Button>
                    <div>
                        <p></p>
                    </div>
                    <Link to="/signup">
                        <Button
                            className={styleUtils.width100}
                        >
                            Sign Up
                        </Button>
                    </Link >


                </Form>

            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;