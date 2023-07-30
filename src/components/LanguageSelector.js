import React from "react";
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {

  const { i18n } = useTranslation();

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

  return (
    <div className="img-container">
      <img
        src="https://www.countryflagicons.com/FLAT/64/GB.png"
        onClick={() => changeLanguage("en")}
        title="English"
        alt="English flag"
      />

      <img
        src="https://www.countryflagicons.com/FLAT/64/DE.png"
        title="Spanish"
        onClick={() => changeLanguage("es")}
        alt="Spanish flag"
      />
    </div>
  );
};


export default LanguageSelector;