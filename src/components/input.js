const Input = (props) => {
  const { id, label, onChange, help, type } = props;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} onChange={onChange} />
      {help && <span>{help}</span>}
    </div>
  );
};

export default Input;
