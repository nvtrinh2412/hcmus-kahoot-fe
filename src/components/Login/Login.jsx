import React, { useState, ReactElement } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FieldValues } from "react-hook-form";
import axiosConfig from "../../services/axiosConfig";
import queryString from "query-string";
import logo from "./Kahoot-Logo.png";
import {
  validateLoginSchema,
  validateSignUpSchema,
} from "../../models/validateFormSchema";
import "./Login.scss";

const SUCCESS_SIGN_UP_MESSAGE = "Success! Try to log in now!";
const SUCCESS_LOG_IN_MESSAGE = "Login successfully";
const ERROR_LOG_IN_MESSAGE = "Email or password is incorrect";
const FORM_LOGIN = {
  data: [
    {
      type: "email",
      title: "Email",
      placeholder: "god.mentor@kms-technology.com",
    },
    {
      type: "password",
      title: "Password",
      placeholder: "",
    },
  ],
  button: {
    title: "Login",
    target: "/login",
    option: "Sign up",
    message: "Don’t have an account?",
  },
};
const FORM_SIGN_UP = {
  data: [
    {
      type: "firstName",
      title: "First name",
      placeholder: "Nguyen",
    },
    {
      type: "lastName",
      title: "Last name",
      placeholder: "Trinh",
    },
    {
      type: "email",
      title: "Email",
      placeholder: "god.mentor@kms-technology.com",
    },
    {
      type: "password",
      title: "Password",
      placeholder: "",
    },
  ],
  button: {
    title: "Sign up",
    target: "/registration",
    option: "Login",
    message: "Don’t have an account?",
  },
};

const Login = ({ isOpen, setOpen }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [detailForm, setDetailForm] = useState(FORM_LOGIN);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      isSignUp ? validateSignUpSchema : validateLoginSchema
    ),
  });
  const handleChangeForm = () => {
    reset();
    setIsError(false);
    setIsSuccess(false);
    setIsSignUp(!isSignUp);
    setDetailForm(isSignUp ? FORM_LOGIN : FORM_SIGN_UP);
  };

  const handleSubmitForm = async (data) => {
    const targetUrl = isSignUp ? "/auth/register" : "auth/login";
    setLoading(true);
    const submitData = isSignUp
      ? queryString.stringify(data)
      : new URLSearchParams(data);
    await axiosConfig
      .post(targetUrl, submitData)
      .then((res) => {
        if (res?.error) {
          setIsSuccess(false);
          setIsError(true);
          setErrorMessage(!isSignUp ? ERROR_LOG_IN_MESSAGE : res.message);
        } else {
          setIsError(false);
          setIsSuccess(true);
          setSuccessMessage(
            isSignUp ? SUCCESS_SIGN_UP_MESSAGE : SUCCESS_LOG_IN_MESSAGE
          );
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="login">
      <div className="login__container">
        <div
          className="login__close-tag"
          onClick={() => setOpen(!isOpen)}
          aria-hidden></div>
        <div className="login__logo">
          <img src={logo} alt="logo" />
        </div>
        <form
          className="login__form"
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}>
          {detailForm.data.map((item) => {
            const { type, title, placeholder } = item;
            const validateErrorMessage = errors[type]?.message;
            return (
              <div className="login__form-item">
                <label className="login__form-item-label" htmlFor={type}>
                  {title}
                </label>
                <input
                  className="login__form-item-input"
                  type={type === "password" ? "password" : "text"}
                  id={type}
                  placeholder={placeholder}
                  {...register(type, { required: true })}
                />
                {validateErrorMessage && (
                  <span className="login__form-item--error">
                    {validateErrorMessage}
                  </span>
                )}
              </div>
            );
          })}

          <div className="login__form-submit-result">
            {isError && (
              <>
                <RiErrorWarningFill className="login__form-submit-result-status--error" />
                <span className="login__form-submit-result-message--error">
                  {" "}
                  {errorMessage}
                </span>
              </>
            )}
            {isSuccess && (
              <>
                <IoCheckmarkDoneCircleSharp className="login__form-submit-result-status--success" />
                <span className="login__form-submit-result-message--success">
                  {" "}
                  {successMessage}
                </span>
              </>
            )}
          </div>

          <button className="login__form-button" type="submit">
            {loading ? "Please wait..." : detailForm.button.title}
          </button>

          <div className="login__form-option">
            <span> {detailForm.button.message}</span>
            <span
              className="login__form-option-link"
              onClick={() => handleChangeForm()}
              aria-hidden>
              {detailForm.button.option}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
