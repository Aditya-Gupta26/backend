import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import * as yup from "yup";
//import "./HomePage.css";
import { logIn } from "./requests";
import { Redirect } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required")
});
function HomePage() {
  const [redirect, setRedirect] = useState(false);
  const handleSubmit = async evt => {
    const isValid = await schema.validate(evt);
    if (!isValid) {
      return;
    }
    try {
      const response = await logIn(evt);
      localStorage.setItem("token", response.data.token);
      setRedirect(true);
    } catch (ex) {
      alert("Invalid username or password");
    }
  };
  if (redirect) {
    return <Redirect to="/repos" />;
  }
  return (
    <>
      <Navbar bg="primary" expand="lg" variant="dark">
        <Navbar.Brand href="#home">GitHub App</Navbar.Brand>
      </Navbar>
      <div className="page">
        <h1 className="text-center">Log In</h1>
        <Formik validationSchema={schema} onSubmit={handleSubmit}>
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values={'username':"", 'password':""},
            touched={'username':"", 'password':""},
            isInvalid,
            errors={'username':"", 'password':""}
          }) => (
            // <Form noValidate onSubmit={handleSubmit}>
              
            //     <Form.Group as={Col} md="12" controlId="username">
            //       <Form.Label>Username</Form.Label>
            //       <Form.Control
            //         type="text"
            //         name="username"
            //         placeholder="Username"
            //         value={values.username || ""}
            //         onChange={handleChange}
            //         isInvalid={touched.username && errors.username}
            //       />
            //       <Form.Control.Feedback type="invalid">
            //         {errors.username}
            //       </Form.Control.Feedback>
            //     </Form.Group>
            //     <Form.Group as={Col} md="12" controlId="password">
            //       <Form.Label>Password</Form.Label>
            //       <Form.Control
            //         type="password"
            //         name="password"
            //         placeholder="Password"
            //         value={values.password || ""}
            //         onChange={handleChange}
            //         isInvalid={touched.password && errors.password}
            //       />
            //       <Form.Control.Feedback type="invalid">
            //         {errors.password}
            //       </Form.Control.Feedback>
            //     </Form.Group>
              
            //   <Button type="submit" style={{ marginRight: "10px" }}>
            //     Log In
            //   </Button>
            //   <Link
            //     className="btn btn-primary"
            //     to="/signup"
            //     style={{ marginRight: "10px", color: "white" }}
            //   >
            //     Sign Up
            //   </Link>
            // </Form>

            <form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
          )}
        </Formik>
      </div>
    </>
  );
}
export default HomePage;