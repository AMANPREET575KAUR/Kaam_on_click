import { useState } from "react";
import axios from "axios";

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
    "http://localhost:4000/graphql",
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