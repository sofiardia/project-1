import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/auth";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20V18H4V6Z" stroke="#737373" strokeWidth="2" />
      <path d="M4 7L12 13L20 7" stroke="#737373" strokeWidth="2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 11V8C7 5.79 8.79 4 11 4H13C15.21 4 17 5.79 17 8V11"
        stroke="#737373"
        strokeWidth="2"
      />
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="#737373"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const e = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!email) e.email = "Can't be empty";
    else if (!emailRegex.test(email)) e.email = "Invalid email";

    if (!pass) e.pass = "Can't be empty";
    else if (pass.length < 8) e.pass = "Min 8 characters";

    if (!confirm) e.confirm = "Can't be empty";
    else if (confirm !== pass) e.confirm = "Passwords don't match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ⚡ FIX: Added 'e' parameter to prevent page reloading
  const handleSubmit = async (e) => {
    if (e) e.preventDefault(); 
    
    if (!validate()) return;
    setIsLoading(true);

    try {
      const data = await registerUser(email, pass);
      console.log("Backend Response Data:", data);

      if (!data) {
        setErrors({ email: "Registration failed. No response from server." });
        return;
      }

      if (data.error || data.status === "error" || data.message?.includes("exists") || data.message?.includes("არსებობს")) {
        setErrors({ email: data.message || "Email already in use" });
        return;
      }

      alert("Account created successfully");
    } catch (err) {
      console.error("Registration Catch Error:", err);
      // Helpful hint if you see this in development
      setErrors({ email: "Server error. Ensure backend is running and CORS is enabled." });
    } finally {
      setIsLoading(false);
    }
  };

  const border = (field) =>
    errors[field] ? "1px solid #FF3939" : "1px solid #D9D9D9";

  return (
    <div style={styles.wrapper}>
      <style>{`
        @media (max-width: 768px) {
          .register-card {
            width: 100% !important;
            max-width: 100% !important;
            padding: 24px !important;
          }
          .brand-text {
            font-size: 24px !important;
          }
          .title-text {
            font-size: 26px !important;
          }
        }
        @media (max-width: 480px) {
          .register-card {
            padding: 20px !important;
          }
          .title-text {
            font-size: 22px !important;
          }
          .subtitle-text {
            font-size: 14px !important;
          }
        }
      `}</style>
      
      <div style={styles.logo}>
        <div style={styles.logoBox}>
          <i className="fa-solid fa-link" style={{ color: "#FFFFFF", fontSize: "16px" }}></i>
        </div>
        <span className="brand-text" style={styles.brand}>devlinks</span>
      </div>

      {/* ⚡ FIX: Wrapped inside an explicit form element with onSubmit */}
      <form className="register-card" style={styles.card} onSubmit={handleSubmit}>
        <h1 className="title-text" style={styles.title}>Create account</h1>
        <p className="subtitle-text" style={styles.subtitle}>
          Let’s get you started sharing your links!
        </p>

        {/* EMAIL FIELD */}
        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <div style={{ ...styles.inputBox, border: border("email") }}>
            <MailIcon />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="alex@email.com"
            />
          </div>
          {errors.email && <span style={styles.error}>{errors.email}</span>}
        </div>

        {/* PASSWORD FIELD */}
        <div style={styles.field}>
          <label style={styles.label}>Create password</label>
          <div style={{ ...styles.inputBox, border: border("pass") }}>
            <LockIcon />
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              style={styles.input}
              placeholder="At least 8 characters"
            />
          </div>
          {errors.pass && <span style={styles.error}>{errors.pass}</span>}
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <div style={styles.field}>
          <label style={styles.label}>Confirm password</label>
          <div style={{ ...styles.inputBox, border: border("confirm") }}>
            <LockIcon />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
              placeholder="At least 8 characters"
            />
          </div>
          {errors.confirm && <span style={styles.error}>{errors.confirm}</span>}
        </div>

        {/* ⚡ FIX: Type set to submit so it coordinates naturally with form capture */}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#FAFAFA",
    fontFamily: "Instrument Sans",
    padding: 20,
    boxSizing: "border-box"
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoBox: {
    width: 32,
    height: 32,
    background: "#633CFF",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 32,
    fontWeight: 700,
    color: "rgb(51, 51, 51)",
  },
  card: {
    width: "100%",
    maxWidth: 380,
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    boxSizing: "border-box"
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    margin: 0,
    color: "rgb(51, 51, 51)",
  },
  subtitle: {
    fontSize: 16,
    color: "#737373",
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column"
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    display: "block",
    color: "#333333"
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    background: "#fff",
    transition: "0.2s",
    width: "100%",
    boxSizing: "border-box"
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
    background: "transparent",
  },
  error: {
    display: "block",
    fontSize: 12,
    color: "#FF3939",
    marginTop: 6,
    textAlign: "left"
  },
  button: {
    width: "100%",
    padding: 12,
    backgroundColor: "#633CFF",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    marginTop: 10,
    fontWeight: 700,
    cursor: "pointer",
  },
  footer: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#737373",
  },
  link: {
    color: "#633CFF",
    textDecoration: "none",
    fontSize: 12,
  },
};