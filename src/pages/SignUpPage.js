import React from "react";

// react tiene 2 tipos de componentes: de clase(class component) y funcionales(functional components)
// functional components son mas faciles de testear
/* const SignUpPage = () => {
  return <h1>Sign Up</h1>;
}; */


// class component tiene un metodo render que retorna un elemento de react
class SignUpPage extends React.Component {
  render() {
    return <h1>Sign Up</h1>;
  }
}

export default SignUpPage;
