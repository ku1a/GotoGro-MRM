import React, {useState } from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from 'react-router-dom';

function TransactSearch() {

  const [results, setResults] = useState([]);
  const [dataReturned, setDataReturned] = useState([]);

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    criteriaMode: "all"
  });

  const onSubmit = values => {handleSearch(values)}

  const handleSearch = (e) => {
    fetch("http://localhost:3001/transactSearch", {
      method: "POST",
      body: JSON.stringify(e),
      headers: { 'Content-type': "application/json"}
    }).then(response => response.json()).then(data => {setDataReturned(true); setResults(data); reset(results)})
  }
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  

  return (
    <div className="App">
      {results[0] ? <TransactSelect values={results}/> :
      <div>
            <div id="header">
              <h1>Transaction Management</h1>
              </div>
              <div>
              <h2>Search For a Transaction</h2>
          </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <br/>
            <label>Member ID: </label>
            <input type="text" name="memberID"
                {...register('memberID', {
                    required: "This field is required.",
                    pattern: {value: /^[0-9\s]+$/, message: "Please enter the numberic ID of an existing member."}}
                )}/>
                <ErrorMessage 
                  errors={errors}
                  name="transactID"
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
        {dataReturned === true && results ? <h3 class="error">Error - no transactions match the supplied Member ID</h3> : false}
        </div>
      }
    </div>
  );
}

function TransactSelect({values}) {

  const [result, setResult] = useState([]);
  const {register, handleSubmit} = useForm({criteriaMode: "all"});
  const onSubmit = newValues => {matchResult(newValues)}

  // Extract each transaction's id and date for select options
  function loadDates() {
    var data = []; 
    for(var i in values) {
      data.push(<option value={values[i].TransactionID}>{values[i].TransactionDate}</option>);
    }
    return data;
  }

  // For god's sake do not touch this, I spent too much time trying to make it work
  function matchResult(newValues) {
    for(var i in values) {
      if(JSON.stringify(values[i].TransactionID) === JSON.stringify(newValues.TransactionID).replaceAll('"','')) {
        setResult(values[i]);
      }
    }
  }
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  

  return ( 
    <div className="App">
      {result.length !== 0 ? <TransactUpdate values={result}/> :
      <div>
        <h1>Transaction Management</h1>
          <h2>Select Transaction</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <select type="select" name="dates" {...register("TransactionID")}>
                {loadDates()}
              </select> 
              <br/><br/>
              <button>Submit</button>
			  
			  <br/><br/>
			  <button onClick={navHome}>Home</button>
			  
            </form>
        </div> }
      </div>
  )  
}

function TransactUpdate(values) {

  // Lovely constants
  const [source, setSource] = useState(values);
  const [dataReturned, setDataReturned] = useState([]);
  const {register, handleSubmit, formState: {errors}} = useForm({
    criteriaMode: "all",defaultValues: values
  });
  const onSubmit = submitValues => {updateTransact(submitValues)}

  // Send update to back-end
  function updateTransact(values){
    fetch("http://localhost:3001/transactUpdate", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { 'Content-type': "application/json"}
     }).then(response => {console.log(response.statusText); setDataReturned(response.statusText) })
  }

  // Delete Transaction, send command to back-end
  function deleteTransact() {
    console.log("delete!");
    console.log(source);
    fetch("http://localhost:3001/transactDelete", {
      method: "POST",
      body: JSON.stringify(source),
      headers: { 'Content-type' : "application/json"}
    })
  }
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  

  return (
    <div className="App">
    <form onSubmit={handleSubmit(onSubmit)}>
    <div>
        <h1>Transaction Management</h1>
        <h2>Edit Details</h2>
    </div>
        <label>MemberID: </label>
        <input type="text" name="memberID" placeholder={values.values.MemberID} 
        {...register('memberID', {
            required: "This field is required.",
            pattern: {value: /^[0-9\s]+$/, message: "Please enter the numeric ID of an existing member."}
          })}/>
          <ErrorMessage 
            errors={errors}
            name="memberID"
            render={({messages}) => 
              messages &&
              Object.entries(messages).map(([type, message]) => (
                <p class="error" key={type}>Error! {message}</p>
              ))}/>
          
        <br/><br/>
          <label>ProductID: </label>
          <input type="text" name="productID" placeholder={values.values.ProductID}
              {...register('productID', {
                  required: "This field is required.",
                  pattern: {value: /^[0-9\s]+$/, message: "Please enter the numeric ID of an existing product."}}
              )}/>
            <ErrorMessage 
                errors={errors}
                name="productID"
                render={({messages}) => 
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p class="error" key={type}>Error! {message}</p>
                  ))}/>

        <br/><br/>
        <label>Quantity of Product: </label>
        <input type="text" name="quantity" placeholder={values.values.ProductQuantity}
            {...register('quantity', {
                required: "This field is required.",
                min: { value: 1, message: "At least 1 product is required."},
                max: { value: 99, message: "Max quantity 99."},
                pattern: {value: /^[1-9][0-9]?$/, message: "Please specify a number."}}
            )}/>
            <ErrorMessage 
              errors={errors}
              name="quantity"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>

        <br/><br/>
        <label>Date of Purchase: </label>
        <input type="date" name="transactionDate" 
            {...register('transactionDate', {
              required: {value: true, message: "This field is required"},
            })}/> 
            <ErrorMessage 
              errors={errors}
              name="transactionDate"
              render={({messages}) => 
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p class="error" key={type}>Error! {message}</p>
                ))}/>

        <br></br><br/>
        <button type="submit">Update</button> 
        <button type="reset">Reset</button>
        <button type="button" onClick={() => deleteTransact(values)}>Delete</button>
		
		<br/><br/>
		<button onClick={navHome}>Home</button>
    </form>

    {dataReturned === "Error! Product not found" ?  <h3 class="error">{dataReturned}</h3> : false}
    {dataReturned === "Error! Member not found" ? <h3 class="error">{dataReturned}</h3> : false}
    {dataReturned === "Error! Check connection to server" ? <h3 class="error">{dataReturned}</h3> : false}
    {dataReturned === "Update was succesful" ? <h3 class="error">{dataReturned}</h3> : false}

  </div>);
}

export default TransactSearch;