import React from "react";
import Input from "../components/input";
import { withTranslation } from "react-i18next";
import { signup } from "../api/apiCalls";

// react tiene 2 tipos de componentes: de clase(class component) y funcionales(functional components)
// functional components son mas faciles de testear
/* const SignUpPage = () => {
  return <h1>Sign Up</h1>;
}; */
// class component tiene un metodo render que retorna un elemento de react
class SignUpPage extends React.Component {
  state = {
    disabled: true,
    username: "",
    email: "",
    password: "",
    confirmPass: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {
      username: "",
      email: "",
      password: "",
    },
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const errorCopy = { ...this.state.errors, [id]: "" };
    this.setState({
      [id]: value, // [name] es un nombre de propiedad computado
      errors: errorCopy,
    });
  };

  submit = async (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;

    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });

    try {
      await signup(body);
      this.setState({ signUpSuccess: true });
      this.setState({ apiProgress: false });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
        this.setState({ disabled: true });
        this.setState({ apiProgress: false });
      }
    }
  };

  render() {
    const { t } = this.props;
    let disabled = true;
    const { password, confirmPass, apiProgress, signUpSuccess, errors } =
      this.state;

    if (password && confirmPass) {
      disabled = password !== confirmPass;
    }

    let passwordConfirmHelp =
      password !== confirmPass ? "Password mismatch" : "";

    return (
      <div className="container" data-testid= "signup-page">
        {!signUpSuccess && (
          <form className="form-content" data-testid="form-sign-up">
            <h1>{t("SignUp")}</h1>
            <Input
              id="username"
              label={t("username")}
              type="text"
              onChange={this.onChange}
              help={errors.username}
            />

            <Input
              id="email"
              label={t("email")}
              type="email"
              onChange={this.onChange}
              help={errors.email}
            />

            <Input
              id="password"
              label={t("password")}
              type="password"
              onChange={this.onChange}
              help={errors.password}
            />

            <Input
              id="confirmPass"
              label={t("confirmPassword")}
              type="password"
              onChange={this.onChange}
              help={passwordConfirmHelp}
            />

            <button
              className={disabled || apiProgress ? "disabled" : "notDisabled"}
              disabled={disabled || apiProgress}
              onClick={this.submit}
            >
              {apiProgress && (
                <span role="status" aria-hidden="true">
                  {t("loading")}
                </span>
              )}
              {t("SignUp")}
            </button>
          </form>
        )}
        {signUpSuccess && (
          <div
            style={{
              margin: "10px auto",
              padding: "20px",
              border: "1px solid green ",
              backgroundColor: "lightgreen",
              borderRadius: "5px",
              color: "green",
            }}
          >
            Please check your e-mail to activate your account
          </div>
        )}
      </div>
    );
  }
}

const SignUpPageWithTranslation = withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
