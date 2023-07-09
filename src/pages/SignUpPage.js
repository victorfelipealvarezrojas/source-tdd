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
        <input type="text" placeholder="username" />
        <input type="text" placeholder="email" />
      </div>
    );
  }
}

export default SignUpPage;
