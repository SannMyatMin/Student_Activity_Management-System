import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

// Components
import Button from "../Buttons/button.jsx";
import TextLink from "../Buttons/textLink.jsx";


export default function Login() {
  const navigate = useNavigate();
  const [validError, setValidError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // if already login, navigate to profile
  useEffect(() => {
    if (Cookies.get("user")) {
      navigate("/profile")
    }
    if (Cookies.get("admin")) {
      navigate("/adminDashBoard/student")
    }
  }, [navigate])

  const loginApi = async (data, dir) => {
    const res = await fetch(`http://localhost:8080/${dir}`, {
      method: "POST",
      headers: {
        "Content-type": "Application/json",
      },
      body: JSON.stringify(data)
    });

    return await res.text();
  }

  // -------for student login validation  ------- //
  const studentLoginValidate = async (data) => {
    const studentLogin = await loginApi({ mail: data.email, password: data.password }, "api/login");  // for student login api

    // for mail validation 
    if (studentLogin === "Student with this mail not exist") {
      return setValidError("EMAIL DOESN'T MATCH");
    } else {
      setValidError(null);
    }

    // for password validation
    if (studentLogin === "Incorrect password") {
      return setValidError("INCORRECT PASSWORD");
    } else {
      setValidError(null);
      const resultObj = JSON.parse(studentLogin);
      const userData = { name: resultObj.name, mail: resultObj.mail, roles: resultObj.roles };    // to extract user data (name, mail) from response text data
      const image = resultObj.image;    // to extract image from response text data

      const isShopOwner = resultObj.roles && resultObj.roles.includes("Owner");
      const isClubFounder = resultObj.roles && resultObj.roles.includes("Founder");



      if (isShopOwner) {
        let keyword = "Owner of";
        let shopname = resultObj.roles.includes(keyword) ? resultObj.roles.split(keyword)[1].split(",")[0].trim() : "";
      
        Cookies.set("shopTitle", shopname, { expires: 1, path: "/" });
    
      }

       if (isClubFounder) {
        let keyword = "Founder of";
        let start = resultObj.roles.indexOf(keyword);
        
        if (start !== -1) {
          let clubName = resultObj.roles.substring(start + keyword.length + 1).split(",")[0].trim();
          
          Cookies.set("clubOwner", clubName, { expires: 1, path: "/" });
        }
      }
      
      Cookies.set("user", JSON.stringify(userData), { expires: 1, path: "/" })
      navigate("/profile")
    }
  }


  // -------for admin login validation  ------- //
  const adminLoginValidate = async (data) => {
    const adminLogin = await loginApi({ mail: data.email, password: data.password }, "admin/login");  // for student login api

    // for mail validation 
    if (adminLogin === "Admin not found") {
      return setValidError("EMAIL DOESN'T MATCH");
    } else {
      setValidError(null);
    }

    // for password validation
    if (adminLogin === "Invalid password") {
      return setValidError("INCORRECT PASSWORD");
    } else {
      setValidError(null);

      const resultObj = JSON.parse(adminLogin);
      const adminData = { name: resultObj.name, mail: resultObj.mail };    // to extract user data (name, mail) from response text data
      const image = resultObj.image;    // to extract image from response text data

      localStorage.setItem("pf_Image", image);
      Cookies.set("admin", JSON.stringify(adminData), { expires: 1, path: "/" })
      navigate("/adminDashBoard/student")
    }
  }

  // ------- handle login submit------- //
  const submitLogin = async (data) => {
    if (data.email.includes("@uit.edu.mm")) {
      studentLoginValidate(data);
    }
    else if (data.email.includes("@gmail.com")) {
      adminLoginValidate(data);
    }
  };

  return (
    <section className="loginSignup-section">
      <div className="login-text-container">
        <h1>SIMPLIFY your CAMPUS LIFE LOGIN, EXPLORE!</h1>
      </div>
      <div className="form-container">
        <form onSubmit={handleSubmit(submitLogin)}>
          <div className="form-row">
            <label htmlFor="">Email</label>
            <input
              type="email"
              placeholder="your@uit.edu.mm"
              {...register("email", { required: true, onChange: () => setValidError(null) })}
            />
            {errors.email && (
              <div className="alert alert-error">
                <span>EMAIL IS REQUIRED</span>
              </div>
            )}
            {validError && !errors.email && validError === "EMAIL DOESN'T MATCH" && (
              <div className="alert alert-error">
                <span>{validError}</span>
              </div>
            )}
          </div>

          <div className="form-row">
            <label htmlFor="">Password</label>
            <input
              type="password"
              placeholder="your little secret :D"
              {...register("password", { required: true, onChange: () => setValidError(null) })}
            />
            {errors.password && (
              <div className="alert alert-error">
                <span>PASSWORD IS REQUIRED</span>
              </div>
            )}
            {validError && !errors.password && validError === "INCORRECT PASSWORD" && (
              <div className="alert alert-error">
                <span>{validError}</span>
              </div>
            )}
          </div>

          <div className="form-btn-row">
            <Button btnType={"normal"} btnText={"continue"} btnSize={"M"} />
            <TextLink btnType={"button"} btnText={"NEW ACCOUNT?"} onClick={() => navigate("/signup")} />
          </div>
        </form>
      </div>
    </section>
  );
}
