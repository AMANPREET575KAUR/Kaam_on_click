import { useState } from "react";
import axios from "axios";
import config from "../config";
import AuthLayout from "../layout/AuthLayout";
import { motion } from "framer-motion";

function ForgotPassword() {

  const [email,setEmail] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [message,setMessage] = useState("");

  const handleReset = async () => {

    if(!email || !newPassword || !confirmPassword){
      setMessage("Please fill all fields");
      return;
    }

    if(newPassword !== confirmPassword){
      setMessage("Passwords do not match");
      return;
    }

    try{

      const query = `
      mutation ResetPassword($email:String!,$newPassword:String!){
        resetPassword(email:$email,newPassword:$newPassword)
      }
      `;

      const res = await axios.post(
        config.API_URL,
        {
          query,
          variables:{
            email,
            newPassword
          }
        }
      );

      setMessage("Password updated successfully");

    }
    catch(err){

      setMessage("User not found");

    }

  };

  return(

<AuthLayout>

<div className="max-w-md mx-auto">

<motion.h2
initial={{opacity:0,y:-20}}
animate={{opacity:1,y:0}}
className="text-3xl font-bold mb-6">

Reset Password

</motion.h2>

<input
type="email"
placeholder="Enter Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border p-3 rounded-xl mb-3"
/>

<input
type="password"
placeholder="New Password"
value={newPassword}
onChange={(e)=>setNewPassword(e.target.value)}
className="w-full border p-3 rounded-xl mb-3"
/>

<input
type="password"
placeholder="Confirm Password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="w-full border p-3 rounded-xl mb-4"
/>

<button
onClick={handleReset}
className="w-full bg-black text-white p-3 rounded-xl">

Update Password

</button>

<p className="mt-4 text-sm text-green-600">

{message}

</p>

</div>

</AuthLayout>

  );

}

export default ForgotPassword;