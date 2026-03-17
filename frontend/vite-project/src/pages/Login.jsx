import { useState } from "react";
import axios from "axios";
import config from "../config";

function Login() {

 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");

 const handleLogin = async () => {

  const query = `
  mutation {
    login(email:"${email}", password:"${password}") {
      token
      user {
        id
        name
        role
      }
    }
  }
  `;

  const res = await axios.post(
    config.API_URL,
    { query }
  );

  const data = res.data.data.login;

  localStorage.setItem("token", data.token);

  alert("Login successful");
 };

 return (
  <div>

   <h2>Login</h2>

   <input
    placeholder="Email"
    onChange={(e)=>setEmail(e.target.value)}
   />

   <input
    placeholder="Password"
    type="password"
    onChange={(e)=>setPassword(e.target.value)}
   />

   <button onClick={handleLogin}>
     Login
   </button>

  </div>
 );
}

export default Login;
