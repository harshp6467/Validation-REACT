function validation(values) {
  let errors = {};

  if (!values.name) {
    errors.name = "Name is required";
  }

  if (!values.mobile) {
    errors.mobile = "Mobile number is required";
  }

  if (!values.email) {
    errors.email = "Email is required";
  }

  if (!values.state) {
    errors.state = "State is required";
  }

  if (values.state && !values.city) {
    errors.city = "City is required";
  }

  return errors;
}
export default validation;
