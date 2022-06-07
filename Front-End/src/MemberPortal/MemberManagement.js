import React, {useState } from "react";
import './member.css';
import {useForm} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from 'react-router-dom';


function updateMember(values){

    console.log(JSON.stringify(values));
    
    fetch("http://localhost:3001/memberUpdate", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { 'Content-type': "application/json"}
     }) 
}

function deleteMember(values){
  console.log(JSON.stringify(values));
  
  fetch("http://localhost:3001/memberDelete", {
    method: "POST",
    body: JSON.stringify(values),
    headers: { 'Content-type': "application/json"}
   }) 
}

function MemberSearch() {
	
	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  
  const [results, setResults] = useState([]);
  const [dataReturned, setDataReturned] = useState([]);

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    criteriaMode: "all"
  });

  const onSubmit = values => {handleSearch(values)}

  const handleSearch = (e) => {

    fetch("http://localhost:3001/memberSearch", {
      method: "POST",
      body: JSON.stringify(e),
      headers: { 'Content-type': "application/json"}
     }).then(response => response.json()).then(data => {setDataReturned(true) ;setResults(data); reset(results)})

  }
  

  return (
    <div className="App">
       {results[0] ? <MemberUpdate values={results[0]}/> :
       <div>
            <div id="header">
               <h1>Member Management</h1>
              </div>
              <div>
               <h2>Search For a User</h2>
           </div>
         <form onSubmit={handleSubmit(onSubmit)}>
             <br/>
             <label>Email: </label>
             <input type="text" name="einmail"
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
             <br></br><br/>
             <button>Search</button> 
			 
			 <br/><br/>
			 <button onClick={navHome}>Home</button>
			 
             <br></br><br/>
             
         </form>
         {dataReturned === true && !results[0] ? <h3 class="error">Could not find that user</h3> : false}
         </div>
       }
    </div>

  );
}

function MemberUpdate({values}){ 
  const [updated, setUpdatedBool] = useState([]);

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    criteriaMode: "all",defaultValues: values
  });
  const onSubmit = submitValues => {updateMember(submitValues); reset({}); setUpdatedBool(true)}
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  
  
   return (
    <div className="App">
    <form onSubmit={handleSubmit(onSubmit)}>
    <div id="header">
        <h1>Member Management</h1>
        </div>
        <div>
        <h2>Edit Details</h2>
    </div>
        <label>First Name: </label>
        <input type="text" name="FirstName" {...register('FirstName', {
            required: {value: true, message: "Missing First Name"},
            maxLength: {value: 10, message: "First Name cannot contain more than 10 characters"},
            pattern: {value: /^[A-Za-z]+$/, message: "First Name may only consist of letters"}
          })}/>
          <ErrorMessage 
            errors={errors}
            name="FirstName"
            render={({messages}) => 
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p class="error" key={type}>Error! {message}</p>
              ))}/>
          
      <br/><br/>
        <label>Last Name: </label>
        <input type="text" name="LastName"
            {...register('LastName', {
              required: {value: true, message: "Missing Last Name"},
              maxLength: {value: 15, message: "Last Name cannot contain more than 15 characters"},
              pattern: {value: /^[A-Za-z]+$/, message: "Last Name may only consist of letters"}}
            )}/>
          <ErrorMessage 
              errors={errors}
              name="LastName"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>

        <br/><br/>
        <label>Email: </label>
        <input type="text" name="Email"
            {...register('Email', {
              required: { value: true, message: "Missing Email"},
              maxLength: {value: 40, message: "Email cannot be more than 40 characters"},
              pattern: {value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Invalid Email format" }}
            )}/>
            <ErrorMessage 
              errors={errors}
              name="Email"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>

        <br/><br/>
        <label>Date of Birth: </label>
        <input type="text" name="DOB" placeholder='YYYY-MM-DD'
            {...register('DOB', {
              required: {value: true, message: "Missing Date of Birth"},
              maxLength: {value: 10, message: "DOB Cannot be longer than 10 characters"},
              pattern: {value: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,message: "Invalid date format"}
            })}/> 
            <ErrorMessage 
              errors={errors}
              name="DOB"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>

        <br></br><br/>
        <button type="submit">Update</button> 
        <input type="reset" id="reset"/>
        <button type="button" onClick={() => deleteMember(values)}>Delete</button>
		
		<br/><br/>
		<button onClick={navHome}>Home</button>
        
    </form>
  </div>)
}

export default MemberSearch;