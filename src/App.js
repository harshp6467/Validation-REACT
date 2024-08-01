import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./App.css";
import validation from "./validation";


const stateCityData = {
  Gujarat: [
    "Ahmedabad",
    "Vadodara",
    "Surat",
    "Navsari",
    "Rajkot",
    "Kutch",
    "Mahesana",
  ],
  Goa: ["South Goa", "North Goa", "West Goa", "Madgao", "Panji"],
  Maharastra: ["Nagpur", "Bombay", "Andheri", "Dadar", "Goregao", "Virar"],
  AndhraPradesh: [
    "Visakhapatnam",
    "Vijayawada",
    "Guntur",
    "Nellore",
    "Kurnool",
  ],
  Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  TamilNadu: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  UttarPradesh: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
  Rajasthan: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"],
  WestBengal: ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Karnal", "Rohtak"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  MadhyaPradesh: ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tinsukia"],
  HimachalPradesh: ["Shimla", "Dharamshala", "Manali", "Solan", "Mandi"],
  Uttarakhand: ["Dehradun", "Haridwar", "Rishikesh", "Nainital", "Almora"],
  JammuAndKashmir: ["Srinagar", "Jammu", "Leh", "Anantnag", "Baramulla"],
};

function App() {
  const [values, setValues] = useState({
    name: "",
    mobile: "",
    email: "",
    state: "",
    city: "",
    allInfoTrue: false,
  });
  const [errors, setErrors] = useState({});
  
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("mode") === "dark"
  );

  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("mode", darkMode ? "dark" : "light");
  }, [darkMode]);

  function toggleDarkMode() {
    setDarkMode((prevMode) => !prevMode);
    console.log("Darkmode", !darkMode);
  }

  function updateField(event) {
    const { name, value } = event.target;
    let cleanedValue = "";

    if (name === "mobile") {
      cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    } else if (name === "name") {
      cleanedValue = value.replace(/[^a-zA-Z]/g, "").slice(0, 27);
    } else {
      cleanedValue = value.trim();
    }

    setValues((prevValues) => ({
      ...prevValues,
      [name]: cleanedValue,
    }));
    validateField(name, cleanedValue);
  }

  function validateField(name, value) {
    let error = "";
    if (name === "name") {
      if (!value) {
        error = "Name is required";
      }
    } else if (name === "mobile") {
      if (!value) {
        error = "Mobile is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "10 digits are required";
      }
    } else if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Invalid email format";
      }
    } else if (name === "state") {
      if (!value) {
        error = "State is required";
      }
    } else if (name === "city") {
      if (values.state && !value) {
        error = "City is required";
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  }

  function handleSwitchChange(event) {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change this switch?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        setValues((prevValues) => ({
          ...prevValues,
          allInfoTrue: !prevValues.allInfoTrue,
        }));
        setErrors((prevErrors) => ({ ...prevErrors, allInfoTrue: "" }));
      }
    });
  }

  function handleStateChange(event) {
    const { value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      state: value,
      city: "",
    }));
    validateField("state", value);
  }

  function handleCityChange(event) {
    const { value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      city: value,
    }));
    validateField("city", value);
  }

  function handleValidation(event) {
    event.preventDefault();

    const validationErrors = validation(values);

    if (!values.allInfoTrue) {
      validationErrors.allInfoTrue = "You must agree to the terms";
    }
    if (!values.state) {
      validationErrors.state = "Please select a state";
    }
    if (values.state && !values.city) {
      validationErrors.city = "Please select a city";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      Swal.fire({
        title: "Thank you :)",
        text: "Your form has been submitted.",
        icon: "success",
        confirmButtonText: "Done",
      }).then(() => {
        setValues({
          name: "",
          mobile: "",
          email: "",
          state: "",
          city: "",
          allInfoTrue: false,
        });
      });
    }
  }

  return (
    <div className="app-container">
      <div className="toggle-switch">
        <input
          type="checkbox"
          id="mode-switch"
          checked={darkMode}
          onChange={toggleDarkMode}
        />
        <label htmlFor="mode-switch" className="switch-label">
          <span className="slider"></span>
        </label>
      </div>
      <div className="signup_form">
        <h1>FORM VALIDATION</h1>
        <div className="form">
          <form onSubmit={handleValidation}>
            <label htmlFor="name" className="mt-2">
              Firstname:
            </label>
            <input
              type="text"
              placeholder="Enter name"
              name="name"
              className={errors.name ? "input-error" : ""}
              onChange={updateField}
              value={values.name}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}

            <label htmlFor="mobile" className="mt-2">
              Mobile:
            </label>
            <input
              type="text"
              placeholder="Enter mobile"
              name="mobile"
              className={errors.mobile ? "input-error" : ""}
              onChange={updateField}
              value={values.mobile}
              inputMode="numeric"
              pattern="\d*"
            />
            {errors.mobile && <p className="error-message">{errors.mobile}</p>}

            <label htmlFor="email" className="mt-2">
              Email:
            </label>
            <input
              type="text"
              placeholder="Enter email"
              name="email"
              className={errors.email ? "input-error" : ""}
              onChange={updateField}
              value={values.email}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}

            <div className="dropdown-container mt-2">
              <label htmlFor="state">State:</label>
              <select
                name="state"
                className={errors.state ? "input-error" : ""}
                onChange={handleStateChange}
                value={values.state}
              >
                <option value="">Select State</option>
                {Object.keys(stateCityData).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && <p className="error-message">{errors.state}</p>}

              <label htmlFor="city">City:</label>
              <select
                name="city"
                className={errors.city ? "input-error" : ""}
                onChange={handleCityChange}
                value={values.city}
                disabled={!values.state}
              >
                <option value="">Select City</option>
                {values.state &&
                  stateCityData[values.state].map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
              </select>
              {errors.city && <p className="error-message">{errors.city}</p>}
            </div>

            <div className="switch-container mt-2">
              <label htmlFor="switch1">All Information is correct?</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={values.allInfoTrue}
                  onChange={handleSwitchChange}
                  id="switch1"
                />
                <span className="slider"></span>
              </label>
            </div>
            {errors.allInfoTrue && (
              <p className="error-message">{errors.allInfoTrue}</p>
            )}

            <div className="button-container">
              <button type="submit" className="submit-button">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
