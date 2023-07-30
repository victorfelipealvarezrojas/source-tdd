import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { activate } from "../api/apiCalls";

const AccountActivationPage = (props) => {
  const {token} = useParams();
  const [result, setResult] = useState();


  useEffect(() => {
    activate(token).then(() => {
      setResult("success");
    }).catch(() => {
      setResult("failure");
    });
  }, [token]);

  return (
    <div data-testid="activation-page">
      {result === "success" && (
        <h3
          style={{
            width: "400px",
            margin: "0 auto",
            marginTop: "20px",
            padding: "20px",
            border: "1px solid green ",
            backgroundColor: "#80ced6",
            borderRadius: "5px",
            color: "white",
            textAlign: "center",
          }}
        >
          Account is activated
        </h3>
      )}
      {result === "failure" && (
        <h3
          style={{
            width: "400px",
            margin: "0 auto",
            marginTop: "20px",
            padding: "20px",
            border: "1px solid green ",
            backgroundColor: "#80ced6",
            borderRadius: "5px",
            color: "white",
            textAlign: "center",
          }}
        >
          Activation failure
        </h3>
      )}
    </div>
  );
};

export default AccountActivationPage;
