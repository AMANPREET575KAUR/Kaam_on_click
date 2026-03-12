import "../styles/auth.css";

function AuthCard({title,children}){

 return(

  <div className="auth-container">

   <div className="auth-card">

    <div className="auth-title">{title}</div>

    {children}

   </div>

  </div>

 );

}

export default AuthCard;