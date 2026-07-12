import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const loginUser = async (email, pass) => {
  const res = await fetch("/api/auth/login",  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password: pass }),
  });

  return await res.json();
};
  const handleLogin = async () => {
    const e = {};

    if (!email) e.email = "Can't be empty";
    if (!pass) e.pass = "Can't be empty";

    setErrors(e);
    if (Object.keys(e).length > 0) return;

    try {
      const data = await loginUser(email, pass);

      if (data.message === "Invalid credentials") {
        setErrors({ pass: "Wrong email or password" });
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);

        // 🧹 clear old saved UI data (IMPORTANT)
        localStorage.removeItem("devlinks");
        localStorage.removeItem("devprofile");

        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const errorBorder = (field) =>
    errors[field] ? "1px solid #FF3939" : "1px solid #D9D9D9";

  return (
    <div style={styles.wrapper}>
      <style>{`
        @media (max-width: 768px) {
          .login-card {
            width: 100% !important;
            max-width: 100% !important;
            padding: 24px !important;
          }
          .brand-text { font-size: 24px !important; }
          .title-text { font-size: 26px !important; }
          .wrapper-mobile { padding: 16px !important; }
        }
        @media (max-width: 480px) {
          .login-card { padding: 20px !important; }
          .title-text { font-size: 22px !important; }
          .subtitle-text { font-size: 14px !important; }
        }
      `}</style>

   
      <div style={styles.logo}>
        <div style={styles.logoBox}>
          <i className="fa-solid fa-link" style={{ color: "#FFFFFF", fontSize: "16px" }}></i>
        </div>
        <span className="brand-text" style={styles.brand}>devlinks</span>
      </div>

      
      <div className="login-card" style={styles.card}>
        <h1 className="title-text" style={styles.title}>Login</h1>
        <p className="subtitle-text" style={styles.subtitle}>
          Add your details below to get back into the app
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Email address</label>
          <div style={{ ...styles.inputBox, border: errorBorder("email") }}>
            <i className="fa-regular fa-envelope" style={{ color: "#737373" }}></i>
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@email.com"
            />
            {errors.email && (
              <span style={styles.inlineError}>{errors.email}</span>
            )}
          </div>
        </div>

 
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={{ ...styles.inputBox, border: errorBorder("pass") }}>
            <i className="fa-solid fa-lock" style={{ color: "#737373" }}></i>
            <input
              type="password"
              style={styles.input}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your password"
            />
            {errors.pass && (
              <span style={styles.inlineError}>{errors.pass}</span>
            )}
          </div>
        </div>

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        <p style={styles.footer}>
          Don’t have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create account
          </Link>
        </p>
      </div>
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
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    display: "block",
  },
  inputBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #D9D9D9",
    background: "#fff",
    position: "relative",
  },
  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: 14,
    background: "transparent",
  },
  inlineError: {
    position: "absolute",
    right: 12,
    color: "#FF3939",
    fontSize: 12,
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