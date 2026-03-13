import { useState } from "react";
import axios from "axios";

function SignupProvider(){

 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");
 const [phone,setPhone]=useState("");
 const [state,setState]=useState("");
 const [city,setCity]=useState("");
 const [services,setServices]=useState("");
 const [experience,setExperience]=useState("");

 const registerProvider = async ()=>{

  const query = `
  mutation{
   registerProvider(
    name:"${name}"
    email:"${email}"
    password:"${password}"
    phone:"${phone}"
    state:"${state}"
    city:"${city}"
    services:"${services}"
    experienceYears:${experience}
    description:"provider"
   ){
    id
    name
   }
  }
  `;

  await axios.post("http://localhost:4000/graphql",{query});

  alert("Provider Registered");
 };

 return(

  <div>

   <h2>Provider Signup</h2>

   <input placeholder="Name" onChange={(e)=>setName(e.target.value)} />

   <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />

   <input placeholder="Password" type="password"
   onChange={(e)=>setPassword(e.target.value)} />

   <input placeholder="Phone" onChange={(e)=>setPhone(e.target.value)} />

   <input placeholder="State" onChange={(e)=>setState(e.target.value)} />

   <input placeholder="City" onChange={(e)=>setCity(e.target.value)} />

   <input placeholder="Service"
   onChange={(e)=>setServices(e.target.value)} />

   <input placeholder="Experience Years"
   onChange={(e)=>setExperience(e.target.value)} />

   <button onClick={registerProvider}>
    Register
   </button>

  </div>

 );

}

export default SignupProvider;