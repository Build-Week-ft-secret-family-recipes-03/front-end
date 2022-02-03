import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialValues = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
};

const initialErrors = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
};

const validationSchema = yup.object().shape({
    first_name: yup
        .string()
        .trim()
        .required("First name is required")
        .min(3, "Name has to be at least three characters"),
    last_name: yup
        .string()
        .trim()
        .required("Last name is required")
        .min(3, "Name has to be at least three characters"),
    username: yup
        .string()
        .trim()
        .required("Username is required")
        .min(3, "Username has to be at least three characters"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password has to be at least six characters"),
});

export default function Register() {
  const [user, setUser] = useState(initialValues);
  const [errors, setErrors] = useState({ initialErrors });
  const [disabled, setDisabled] = useState(false);

  const { push } = useNavigate();

  const validation = (name, value) => {
    yup
      .reach(validationSchema, name)
      .validate(value)
      .then(() => setErrors({ ...initialErrors, [name]: "" }))
      .catch((err) => setErrors({ ...initialErrors, [name]: err.errors[0] }));
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    validation(name, value);
    setUser({ ...user, [name]: value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        'https://ft-secret-family-recipes.herokuapp.com/auth/register',
        user
      )
      .then((resp) => {
        console.log('register auth resp -->', resp);
        setUser(initialValues);
        // push("/login");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    validationSchema.isValid(user).then((valid) => setDisabled(!valid));
  }, [user]);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="register-form">
        <div className="form-group">
          <h1>User Registration</h1>

          <div className="form-group">

                <label>First Name: </label>
                <input
                    type="text"
                    name="first_name"

                    value={user.name}



                    onChange={onChange}
                    id='user-input'
                />
                <br/>
                <label>Last Name: </label>
                <input
                    type="text"
                    name="last_name"

                    value={user.name}



                    onChange={onChange}
                    id='user-input'
                />
                <br/>
                <label>Username: </label>
                    <input
                    type="text"
                    name="username"
                    value={user.name}
                    onChange={onChange}
                    id='user-input'
                    />
                <br/>
                <label>Password: </label>
                    <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={onChange}
                    id='pass-input'
                    />

                <br/>
          </div>
        </div>
        <div className="errors">
          <div>{errors.username}</div>
          <div>{errors.password}</div>
        </div>

        <button disabled={disabled} className='register-button'>Register</button>
      </form>
    </div>
  );
}