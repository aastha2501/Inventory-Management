import React, { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import axios from "axios";

export default function Signup()
{
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
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

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is Required'
        } else if(values.confirmPassword != values.password) {
            errors.confirmPassword = "Confirm password should match password"
        }
        return errors;
    }
    const formik = useFormik({
     
        initialValues: {    
            password: '',
            email: '',
            confirmPassword: ''
        },
        onSubmit: values => {
            console.log(values);
            //axios call
            axios
            .post("https://localhost:7270/signup", values, )
            .then((response)=>{
                console.log(response);
                navigate("/login");
            }).catch((err) => {
                console.log(err);
                if(err.response.status == 401){
                    setErrorMsg("User already exists");
                }
            })

        }, 
        validate
    });
    return(
        <div className="homeWrapper">
        <div className="loginWrapper">
            <form onSubmit={formik.handleSubmit} className="form" >
                <h4>Signup</h4>
                {errorMsg && <p style={{color: "red"}}>{errorMsg}</p>}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" id="email" className="form-control"  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}/>
                    {formik.touched.email && formik.errors.email ? <div className='form-error'>{formik.errors.email}</div> : null}
                
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name="password" id="password" className="form-control"  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}/>
                    {formik.touched.password && formik.errors.password ? <div className='form-error'>{formik.errors.password}</div> : null}
             
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" className="form-control"  onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword}/>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className='form-error'>{formik.errors.confirmPassword}</div> : null}
             
                </div>
                <div className="mb-3"> 
                <button type="submit" className="btn btn-primary">Sign up</button>
                </div>
                <div style={{textAlign: "center"}}>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
        </div>
    )
}