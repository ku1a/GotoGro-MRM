import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// send data to dbms
function sendData(values) {
  fetch("http://localhost:3001/addProduct", {
    method: "POST",
    body: JSON.stringify(values),
    headers: {'Content-type': "application/json"}
  })
}

// form component
function Form(){
  // form API
  const {register, handleSubmit, formState: {errors} } = useForm({
    criteriaMode: "all"
  });

  const onSubmit = values => {sendData(values)};
  
  
	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
  

  return (
    <div>
      <div id='header'>
      <h1>Product Portal</h1>
      </div>
      <br></br>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Product Name: </label>
        <input 
          {...register("productName", {
            required: "This field is required.",
            max: {value: 30, message: "Name can be no longer than 30 characters"},
            pattern: {value: /^[a-zA-Z0-9\s]+$/, message: "Only alphanumeric characters allowed."}
        }) }
          type='text'
        />
        <p class="error">{errors.productName?.message}</p>

        <label>Quantity: </label>
        <input 
          {...register("quantity", {
            required: "This field is required.",
            min: { value: 1, message: "At least 1 product is required."},
            max: { value: 99, message: "Max quantity 99."},
            pattern: {value: /^[1-9][0-9]?$/, message: "Please specify a number."}
          }) }
          type='number'
        />
        <p class="error">{errors.quantity?.message}</p>
        
        <label htmlFor='category'>Category: </label>
        <select name="category"
          {...register("category", {
            required: "This field is required.",
          })}>
          <option value="Food">Food</option>
          <option value="Cleaning">Cleaning Supplies</option>
          <option value="Health">Health Products</option>
          <option value="Stationary">Stationary</option>
        </select>
        <p class="error">{errors.category?.message}</p>
        
        <label>Date Introduced: </label>
        <input 
          {...register("dateAdded", {
            required: "This field is required.",
            // regex for date?
          }) }
          type='date'
          placeholder='00/00/0000' />
        <p class="error">{errors.dateAdded?.message}</p>

        <label>Shelf Capacity: </label>
        <input 
          {...register("shelfCapacity", {
            required: "This field is required.",
            min: {value: 5, message: "Minimum shelf capacity is 5."},
            max: {value: 20, message: "Max shelf capacity is 20."}
          }) }
          type='number'
        />
        <p class="error">{errors.shelfCapacity?.message}</p>

        <button type="submit" id='submit'>Submit</button> 
        <button type="reset" id='reset'>Reset</button>
		
		<br/><br/>
		<button onClick={navHome}>Home</button>

      </form>
    </div>
  )
}

export default Form;