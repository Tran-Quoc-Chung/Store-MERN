import React, { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import CustomInput from "../components/CustomInput";
import {useDispatch} from "react-redux"
import { resetPassword } from "../features/user/userSlice";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
const Resetpassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const getToken = location.pathname.split("/")[2];
  const [userpassword, setPassword] = useState('');
  const [matchPassword, setMatchPassword] = useState('');
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (userpassword !== matchPassword || userpassword === '' || matchPassword === '') {
      toast.error('Password and confirm password shold be valid. Try again!!')
    } else {
       dispatch(resetPassword({token:getToken,password:userpassword}))
    }

  }
  return (
    <>
      <Meta title={"Reset Password"} />
      <BreadCrumb title="Reset Password" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Reset Password</h3>
              <form action="" className="d-flex flex-column gap-15">
                <CustomInput
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e)=>{setPassword(e.target.value)}}
                />
                <CustomInput
                  type="password"
                  name="confpassword"
                  placeholder="Confirm Password"
                  onChange={(e)=>{setMatchPassword(e.target.value)}}
                />
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button className="button border-0" onClick={(e)=>handleResetPassword(e)}>Ok</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Resetpassword;
