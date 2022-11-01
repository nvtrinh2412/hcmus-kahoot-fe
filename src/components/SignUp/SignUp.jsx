import React, { useState, ReactElement } from "react";
import { RiErrorWarningFill } from "react-icons/ri";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, FieldValues } from "react-hook-form";
import axiosConfig from "../../services/axiosConfig";
import queryString from "query-string";
import { validateSignUpSchema } from "../../models/validateFormSchema";
import "./SignUp.scss";
import { Link } from "react-router-dom";

const SUCCESS_SIGN_UP_MESSAGE = "Success! Try to log in now!";
const SUCCESS_LOG_IN_MESSAGE = "Login successfully";
const ERROR_LOG_IN_MESSAGE = "Email or password is incorrect";
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

const SignUp = ({ isOpen, setOpen }) => {
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
    resolver: yupResolver(validateSignUpSchema),
  });
  const handleChangeForm = () => {
    reset();
    setIsError(false);
    setIsSuccess(false);
  };

  const handleSubmitForm = async (data) => {
    const targetUrl = "/auth/register";
    setLoading(true);
    const submitData = queryString.stringify(data);
    await axiosConfig
      .post(targetUrl, submitData)
      .then((res) => {
        if (res?.error) {
          setIsSuccess(false);
          setIsError(true);
          setErrorMessage(res.message);
        } else {
          setIsError(false);
          setIsSuccess(true);
          setSuccessMessage(SUCCESS_SIGN_UP_MESSAGE);
        }
      })
      .finally(() => setLoading(false));
  };
  return (
    <div className="signUp">
      <div className="signUp__container">
        <div
          className="signUp__close-tag"
          onClick={() => setOpen(!isOpen)}
          aria-hidden></div>
        <div className="signUp__logo">
          <img
            src={process.env.PUBLIC_URL + "/images/kahoot-logo.png"}
            alt="logo"
          />
        </div>
        <form
          className="signUp__form"
          onSubmit={handleSubmit((data) => handleSubmitForm(data))}>
          {FORM_SIGN_UP.data.map((item) => {
            const { type, title, placeholder } = item;
            const validateErrorMessage = errors[type]?.message;
            return (
              <div className="signUp__form-item">
                <label className="signUp__form-item-label" htmlFor={type}>
                  {title}
                </label>
                <input
                  className="signUp__form-item-input"
                  type={type === "password" ? "password" : "text"}
                  id={type}
                  placeholder={placeholder}
                  {...register(type, { required: true })}
                />
                {validateErrorMessage && (
                  <span className="signUp__form-item--error">
                    {validateErrorMessage}
                  </span>
                )}
              </div>
            );
          })}

          <div className="signUp__form-submit-result">
            {isError && (
              <>
                <RiErrorWarningFill className="signUp__form-submit-result-status--error" />
                <span className="signUp__form-submit-result-message--error">
                  {" "}
                  {errorMessage}
                </span>
              </>
            )}
            {isSuccess && (
              <>
                <IoCheckmarkDoneCircleSharp className="signUp__form-submit-result-status--success" />
                <span className="signUp__form-submit-result-message--success">
                  {" "}
                  {successMessage}
                </span>
              </>
            )}
          </div>

          <button className="signUp__form-button" type="submit">
            {loading ? "Please wait..." : FORM_SIGN_UP.button.title}
          </button>

          <div className="signUp__form-option">
            <span> {FORM_SIGN_UP.button.message}</span>
            <Link
              className="signUp__form-option-link"
              to="/auth/login"
              aria-hidden>
              {FORM_SIGN_UP.button.option}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
