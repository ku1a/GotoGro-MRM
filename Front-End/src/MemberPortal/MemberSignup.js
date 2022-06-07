import React from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import emailjs from "emailjs-com";
import { useNavigate } from 'react-router-dom';


// Assuming no errors are present, post information to server

function sendData(values) {
  console.log(JSON.stringify(values));
  
  fetch("http://localhost:3000/memberSignup", {
    method: "POST",
    body: JSON.stringify(values),
    headers: { 'Content-type': "application/json"}
   }) 
}


// Defines form and input fields, plus validation criteria for each. Would have liked this to a be a bit cleaner but 
// unfortunately this appeared to be the only option 
function MemberSignup() {
  const {register, handleSubmit, formState: {errors} } = useForm({
    criteriaMode: "all"
  });
  
	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}

  function sendEmail(e) {
    e.preventDefault();
      emailjs.sendForm('service_9omkv8r', 'template_g5lrso8', e.target , 'FeXeHnDgWlTjApXZi')
        .then((result) => {
            console.log(result.text);
            
        }, (error) => {
            console.log(error.text);
        });
    };
    
  const onSubmit = (values, e) => {sendData(values); sendEmail(e)};
  
  // Each input is provided and then followed by an ErrorMessage component
  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
      <div id="header">
        <h1>GoToGrocery</h1>
        </div>
        <div>
        <h2>Member Signup Portal</h2>
       </div>
          <label>First Name: </label>
          <input type="text" name="fname" {...register('firstname', {
              required: {value: true, message: "Missing First Name"},
              maxLength: {value: 10, message: "First Name cannot contain more than 10 characters"},
              pattern: {value: /^[A-Za-z]+$/, message: "First Name may only consist of letters"}
            })}/>
            <ErrorMessage 
              errors={errors}
              name="firstname"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>
            
         <br/><br/>
          <label>Last Name: </label>
          <input type="text" name="lname"
              {...register('lastname', {
                required: {value: true, message: "Missing Last Name"},
                maxLength: {value: 15, message: "Last Name cannot contain more than 15 characters"},
                pattern: {value: /^[A-Za-z]+$/, message: "Last Name may only consist of letters"}}
              )}/>
            <ErrorMessage 
                errors={errors}
                name="lastname"
                render={({messages}) => 
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p class="error" key={type}>Error! {message}</p>
                  ))}/>

          <br/><br/>
          <label>Email: </label>
          <input type="text" name="email"
              {...register('email', {
                required: { value: true, message: "Missing Email"},
                maxLength: {value: 40, message: "Email cannot be more than 40 characters"},
                pattern: {value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid Email format" }}
              )}/>
              <ErrorMessage 
                errors={errors}
                name="email"
                render={({messages}) => 
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p class="error" key={type}>Error! {message}</p>
                  ))}/>

          <br/><br/>
          <label>Date of Birth: </label>
          <input type="date" name="dob" placeholder='YYYY-MM-DD'
              {...register('dob', {
                required: {value: true, message: "Missing Date of Birth"},
                maxLength: {value: 10, message: "DOB Cannot be longer than 10 characters"},
                pattern: {value: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,message: "Invalid date format"}
              })}/> 
              <ErrorMessage 
                errors={errors}
                name="dob"
                render={({messages}) => 
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p class="error" key={type}>Error! {message}</p>
                  ))}/>

          <br></br><br/>
          <button>Submit</button> 

          <input type="reset" id="reset"/>
		  
		  <br/><br/>
		  <button onClick={navHome}>Home</button>
      </form>
    </div>
  );
}

export default MemberSignup;