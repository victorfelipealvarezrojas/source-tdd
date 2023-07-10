import React from "react";
import axios from "axios";
// react tiene 2 tipos de componentes: de clase(class component) y funcionales(functional components)
// functional components son mas faciles de testear
/* const SignUpPage = () => {
  return <h1>Sign Up</h1>;
}; */
// class component tiene un metodo render que retorna un elemento de react
class SignUpPage extends React.Component {
  state = {
    disabled: true,
  };

  onChange = (event) => {
    const { id, value } = event.target;
    this.setState({
      [id]: value, // [name] es un nombre de propiedad computado
    });
  };

  submit = (event) => {
    event.preventDefault();
    const { username, email, password } = this.state;
    const user = {
      username,
      email,
      password,
    };
    // axios.post("http://localhost:8080/api/1.0/users", user); //http://localhost:8080/api/1.0/users

    fetch("http://localhost:8080/api/1.0/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  };

  render() {
    let disabled = true;
    const { password, confirmPass } = this.state;
    if (password && confirmPass) {
      disabled = password !== confirmPass;
    }
    return (
      <div>
        <form>
          <h1>Sign Up</h1>
          <label htmlFor="username">User Name</label>
          <input type="text" id="username" onChange={this.onChange} />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={this.onChange} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={this.onChange} />

          <label htmlFor="confirmPass">Confirm Password</label>
          <input type="password" id="confirmPass" onChange={this.onChange} />

          <button disabled={disabled} onClick={this.submit}>
            Sign Up
          </button>
        </form>
      </div>
    );
  }
}

export default SignUpPage;
