import React, {useState} from "react";
import { useFormik } from "formik";
import axios from "axios";
import jwt from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
      const validate = values => {
        let errors = {}
        if (!values.password) {
            errors.password = 'Password is Required'
        }   

        if (!values.email) {
            errors.email = "Email is Required"
        } else if (!"^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$") {
            errors.email = "Invalid email format"
        }
        return errors;
    }
    const formik = useFormik({
     
        initialValues: {    
            password: '',
            email: '',
        },
        onSubmit: values => {
            console.log(values);
            //axios call
            setLoading(true);
            axios
            .post("https://localhost:7270/login", values)
            .then((response)=>{
                setLoading(false);
                console.log(response);
                console.log(response.data.token);

                const claims = jwt(response.data.token.result);

                localStorage.setItem('token', JSON.stringify(response.data.token.result));
                

                console.log(claims);
                const role = claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                console.log(role);
               
                const userId = claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
                console.log(userId);
                if(role == "Admin") {
                    navigate("/admin")
                } else if(role == "User") {
                    navigate(`/dashboard`);
                }
            }).catch((err) => {
                
                if(err.response.status == 400) {
                    setError("Invalid Credentials");     
                } else if(err.response.status == 401) {
                    setError("Email not registered");
                }
               
            })


        }, 
        validate
    });
    return(
      <div className="homeWrapper">
        <div className="loginWrapper">
            <form onSubmit={formik.handleSubmit} className="form" >
                <h4>Login</h4>
                {error ? <div style={{color: "red"}}>{error}</div> : <div></div>}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" id="email" className="form-control"  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}/> 
                    {formik.touched.email && formik.errors.email ? <div className='form-error'>{formik.errors.email}</div> : null}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name="password" id="password" className="form-control" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}/>
                    {formik.touched.password && formik.errors.password ? <div className='form-error'>{formik.errors.password}</div> : null}
                </div>
                <div className="mb-3 text-center"> 
                <button type="submit" className="btn btn-light">{loading ? <>Loading..</> : <>Login</>}</button>
                </div>
                <div style={{textAlign: "center"}}>
                    <p>Don't have an account? <Link to="/signup">Signup</Link></p>
                </div>
            </form>
        </div>
        </div>
     
    )
}