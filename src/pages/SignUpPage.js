import React from "react";

// react tiene 2 tipos de componentes: de clase(class component) y funcionales(functional components)
// functional components son mas faciles de testear
/* const SignUpPage = () => {
  return <h1>Sign Up</h1>;
}; */

// class component tiene un metodo render que retorna un elemento de react
class SignUpPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Sign Up</h1>
        <label htmlFor="username">User Name</label>
        <input type="text"id="username" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <label htmlFor="confirmPass">Confirm Password</label>
        <input type="password" id="confirmPass" />
        <button disabled >Sign Up</button>
      </div>
    );
  }
}

export default SignUpPage;
