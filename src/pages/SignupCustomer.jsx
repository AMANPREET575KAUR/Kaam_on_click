import { useState } from "react";
import axios from "axios";

function SignupCustomer(){

 const [name,setName] = useState("");
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const [phone,setPhone] = useState("");
 const [state,setState] = useState("");

 const handleSignup = async ()=>{

  const query = `
  mutation{
   registerCustomer(
    name:"${name}"
    email:"${email}"
    password:"${password}"
    phone:"${phone}"
    state:"${state}"
   ){
    id
    name
   }
  }
  `;

  await axios.post("http://localhost:4000/graphql",{query});

  alert("Customer registered!");
 };

 return(

  <div>

   <h2>Customer Signup</h2>

   <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />

   <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

   <input placeholder="Password" type="password"
   onChange={(e)=>setPassword(e.target.value)} />

   <input placeholder="Phone" onChange={(e)=>setPhone(e.target.value)} />

   <input placeholder="State" onChange={(e)=>setState(e.target.value)} />

   <button onClick={handleSignup}>
    Register
   </button>

  </div>

 );

}

export default SignupCustomer;