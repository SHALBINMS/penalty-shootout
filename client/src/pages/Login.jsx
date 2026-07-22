import { useContext } from "react";
import { useState } from "react";
import AuthContext from "../context/AuthContext";
import api from "../services/api";
import "../styles/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const { email, password } = formData;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/users/login", formData);

      login(response.data.token);
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setErrorMessage(message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <span className="login-brand">Penalty Final</span>
        <h1 id="login-title">Welcome back</h1>
        <p>Sign in to keep track of your penalty shootout results.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          {errorMessage && (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          )}

          <button className="login-submit" type="submit" disabled={isLoading}>
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        {/* Account creation is handled by the existing API; this stays a safe UI placeholder. */}
        <p className="login-help">
          Need an account? <Link to="/register">Create one</Link>.
        </p>
      </section>
    </main>
  );
}

export default Login;
