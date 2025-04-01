import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";

// Components
import Button from "../Buttons/button.jsx";
import TextLink from "../Buttons/textLink.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [validError, setValidError] = useState(null);
  const [otp, setOtp] = useState(false);
  const [password, setPassword] = useState(false);
  const [btnText, setBtnText] = useState("Continue");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const apiResponse = async (data, dir) => {
    const res = await fetch(`http://localhost:8080/api/${dir}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),  // Send JSON instead of plain text 
    });

    return await res.text();
  }

  // Cookies.remove("user");
  const submitSignUp = async (data) => {

    if (btnText !== "Confirm" || btnText === "Resend") {
      if (!otp || btnText === "Resend") { // Email submission step

        setBtnText("Sending...");
        setValidError(null);

        const result = await apiResponse({ mail: data.email }, "mail");
        if (result === "Student already log in") {
          setBtnText("Continue");
          alert(result)
        }else if (result === "Student with this mail does not exit") {
          setBtnText("Continue")
          return setValidError("Your Edu mail isn't found");
        } else {
          setOtp(true);
          setBtnText("Resend");
          setValidError(null);
        }
          //   setOtp(true);
          // setBtnText("Resend");
          // setValidError(null);
      } else { // OTP submission step
        const OTPResult = await apiResponse({ mail: data.email, otp: data.otp }, "otp");

        if (OTPResult === "Invalid OTP") {
           setPassword(true);
          setOtp(false);
          setBtnText("Confirm");
          setValidError(null);
          return setValidError("Your OTP code doesn't match");
          
        } else {
          setPassword(true);
          setOtp(false);
          setBtnText("Confirm");
          setValidError(null);
        }
          // setPassword(true);
          // setOtp(false);
          // setBtnText("Confirm");
          // setValidError(null);
      }
    } else { // Password submission step
      if (data.confirm !== data.password) {
        return setValidError("Doesn't match your password!");
      } else {
        await apiResponse({ mail: data.email, password: data.password }, "password");
        navigate("/")
      }
    }
  };

  return (
    <section className="loginSignup-section">
      <div className="signup-text-container">
        <h1>Need fresh activities?</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit(submitSignUp)}>
          <div className="form-row">
            <h4>We will send a code to your email. Please fill your email.</h4>
          </div>

          {/* ----- Email ------ */}
          <div className="form-row">
            <label htmlFor="">Email</label>
            <input
              type="email"
              placeholder="your@uit.edu.mm"
              {...register("email", { required: true, onChange: () => setValidError(null) })}
              disabled={otp}
            />
            {errors.email && (
              <div className="alert alert-error">
                <span>Please enter your email</span>
              </div>
            )}
            {validError && !errors.email && validError === "Your Edu mail isn't found" && (
              <div className="alert alert-error">
                <span>{validError}</span>
              </div>
            )}
          </div>

          {/* ----- OTP ------ */}
          {otp && (
            <div className="form-row">
              <label htmlFor="">OTP</label>
              <input
                type="text"
                placeholder="your code"
                {...register(
                  "otp",
                  {
                    onChange: (e) => (
                      e.target.value === "" ? setBtnText("Resend") : setBtnText("Continue")
                    )
                  }
                )}
              />
              {validError && !errors.otp && validError === "Your OTP code doesn't match" && (
                <div className="alert alert-error">
                  <span>{validError}</span>
                </div>
              )}
            </div>
          )}


          {/* ----- Pasword ------ */}
          {password && (
            <>
              <div className="form-row">
                <label htmlFor="">Password</label>
                <input
                  type="password"
                  placeholder="your little secret :D"
                  {...register("password", {
                    required: true,
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message: "Password must be 8+ characters with an uppercase, lowercase, number, and special character."
                    },
                    onChange: () => setValidError(null)
                  })}
                />
                {errors.password && (
                  <div className="alert alert-error">
                    <span>
                      {errors.password.type === "required"
                        ? "Please enter your password" :
                        errors.password.message
                      }
                    </span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <label htmlFor="">Confirm Password</label>
                <input
                  type="password"
                  placeholder="your password"
                  {...register("confirm", { required: true, onChange: () => setValidError(null) })}
                />
                {errors.confirm && (
                  <div className="alert alert-error">
                    <span>Please confirm your password</span>
                  </div>
                )}
                {validError && !errors.confirm && validError === "Doesn't match your password!" && (
                  <div className="alert alert-error">
                    <span>{validError}</span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-btn-row">
            <Button btnType={"normal"} btnText={btnText} btnSize={"M"} active={btnText === "Sending..." && true} />
            <TextLink btnType={"button"} btnText={"GO TO LOGIN !"} onClick={() => navigate("/")} />
          </div>
        </form>
      </div>
    </section>
  );
}
