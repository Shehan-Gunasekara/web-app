const menuValidation = {
  menuName: {
    //pattern: /^[a-zA-Z0-9\s]+$/,
    message: "Any string is allowed!",
  },
  nameLength: {
    pattern: /^.{3,100}$/,
    message: "Name should be between 3 and 100 characters!",
  },
  menuPrice: {
    pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
    message: "Only positive values are allowed!",
  },
  descriptionLength: {
    pattern: /^.{10,300}$/,
    message: "Description should be between 10 and 300 characters!",
  },
  tableNumber: {
    pattern: /^[1-9]\d*$/,
    message: "Only positive integers are allowed!",
  },
  tableNoLength: {
    pattern: /^.{1,4}$/,
    message: "Number should be between 1 and 4 characters!",
    // pattern: /^[0-9]+$/,
    // message: "Only positive numbers are allowed!",
  },
};

export default menuValidation;
