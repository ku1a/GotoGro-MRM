import React, {useState } from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useNavigate } from 'react-router-dom';


function updateProduct(values){

    console.log(JSON.stringify(values));
    
    fetch("http://localhost:3001/ProductUpdate", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { 'Content-type': "application/json"}
     }) 
}

function deleteProduct(values){
  console.log(JSON.stringify(values));
  
  fetch("http://localhost:3001/ProductDelete", {
    method: "POST",
    body: JSON.stringify(values),
    headers: { 'Content-type': "application/json"}
   }) 
}

function ProductSearch() {
  
  const [results, setResults] = useState([]);
  const [dataReturned, setDataReturned] = useState([]);

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    criteriaMode: "all"
  });

  const onSubmit = values => {handleSearch(values)}

  const handleSearch = (e) => {

    fetch("http://localhost:3001/ProductSearch", {
      method: "POST",
      body: JSON.stringify(e),
      headers: { 'Content-type': "application/json"}
     }).then(response => response.json()).then(data => {setDataReturned(true) ;setResults(data); reset(results)})

  }
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  

  return (
    <div className="App">
       {results[0] ? <ProductUpdate values={results[0]}/> :
       <div>
            <div id="header">
               <h1>Product Management</h1>
               </div>
               <div>
               <h2>Search For a Product</h2>
           </div>
         <form onSubmit={handleSubmit(onSubmit)}>
             <br/>
             <label>Product Name: </label>
             <input type="text" name="name"
                 {...register("name", {
					required: "This field is required.",
					max: {value: 30, message: "Name can be no longer than 30 characters"},
					pattern: {value: /^[a-zA-Z0-9\s]+$/, message: "Only alphanumeric characters allowed."}
					}) }/>
                 <ErrorMessage 
                   errors={errors}
                   name="name"
                   render={({messages}) => 
                     messages &&
                     Object.entries(messages).map(([type, message]) => (
                       <p class="error" key={type}>Error! {message}</p>
                     ))}/>
             <br></br><br/>
             <button>Search</button> 
             
			<br/><br/>
		    <button onClick={navHome}>Home</button>
             
         </form>
         {dataReturned === true && !results[0] ? <h3 class="error">Could not find that product</h3> : false}
         </div>
       }
    </div>

  );
}

function ProductUpdate({values}){ 
  const [updated, setUpdatedBool] = useState([]);

  const {register, handleSubmit, formState: {errors}, reset } = useForm({
    criteriaMode: "all",defaultValues: values
  });
  const onSubmit = submitValues => {updateProduct(submitValues); reset({}); setUpdatedBool(true)}
  
  
  	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  
  
   return (
    <div className="App">
      <h1>Product Portal</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Product Name: </label>
        <input type='text' name = 'Name'
          {...register("Name", {
            required: "This field is required.",
            max: {value: 30, message: "Name can be no longer than 30 characters"},
            pattern: {value: /^[a-zA-Z0-9\s]+$/, message: "Only alphanumeric characters allowed."}
        }) }
        />
        <p class="error">{errors.productName?.message}</p>

        <label>Quantity: </label>
        <input type='number' name = 'Quantity'
          {...register("Quantity", {
            required: "This field is required.",
            min: { value: 1, message: "At least 1 product is required."},
            max: { value: 99, message: "Max quantity 99."},
            pattern: {value: /^[1-9][0-9]?$/, message: "Please specify a number."}
          }) }
        />
        <p class="error">{errors.quantity?.message}</p>
        
        <label htmlFor='Category'>Category: </label>
        <select name="Category"
          {...register("Category", {
            required: "This field is required.",
          })}>
          <option value="Food">Food</option>
          <option value="Cleaning">Cleaning Supplies</option>
          <option value="Health">Health Products</option>
          <option value="Stationary">Stationary</option>
        </select>
        <p class="error">{errors.category?.message}</p>
        
        <label>Date Introduced: </label>
        <input type='date' name = 'DateAdded'
          {...register("DateAdded", {
            required: "This field is required.",
            // regex for date?
          }) }
          placeholder='00/00/0000' />
        <p class="error">{errors.dateAdded?.message}</p>

        <label>Shelf Capacity: </label>
        <input type='number' name = 'Capacity'
          {...register("Capacity", {
            required: "This field is required.",
            min: {value: 5, message: "Minimum shelf capacity is 5."},
            max: {value: 20, message: "Max shelf capacity is 20."}
          }) }
        />
        <p class="error">{errors.shelfCapacity?.message}</p>

        <button type="submit">Update</button> 
        <button type="reset">Reset</button>
        <button type="button" onClick={() => deleteProduct(values)}>Delete</button>
		
		<br/><br/>
		<button onClick={navHome}>Home</button>
      </form>
    </div>)
}

export default ProductSearch;