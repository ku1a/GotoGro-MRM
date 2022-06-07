import React, {useState, useEffect} from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Report component
function Report(){

  const [results, setResults] = useState([]);
  const [dataReturned, setDataReturned] = useState([]);

  const { reset } = useForm();

  useEffect(() => {

    fetch("http://localhost:3001/returnAllProducts", {
      method: "POST",
      headers: { 'Content-type': "application/json"}
     }).then(response => response.json()).then(data => {setDataReturned(true) ;setResults(data); reset(results)})

  },[])
  
  
  const navigate = useNavigate()
  
  function navHome(){
	navigate('/');
  }
  
  
  var today = new Date();
  
  var prodOk = [];
  var prodWarn = [];
  var prodCrit = [];
  var prodNoStock = [];
  
  try{
	results.forEach(filterResult);
  } catch {}
  
  function filterResult(product){
	  if (product.Quantity <= 0){
		  prodNoStock.push(product);
		  
	  } else if (product.Quantity <= (product.Capacity / 4)){
		  prodCrit.push(product);
		  
	  } else if (product.Quantity <= product.Capacity){
		  prodWarn.push(product);
		  
	  } else {
		  prodOk.push(product);
	  }
  }  
  
  return (
    <div>
		<div id="header">
		<h1>GotoGrocery MRM</h1>
		</div>
		<h2>Product Requirement Report</h2>
	  
		<p style={{fontSize:'18px'}}>Current stock levels as of: <b>{today.toLocaleDateString()}</b></p>
	  
		<p>
			<span style={{color:'green'}}><b>OK</b></span> indicates an acceptable level of stock<br/>
			<span style={{color:'orange'}}><b>Warning</b></span> indicates stock levels are getting low<br/>
			<span style={{color:'red'}}><b>Critical</b></span> Indicates stock is extremely low<br/>
			<span style={{color:'brown'}}><b>Out Of Stock</b></span> indicates there is no stock available
		</p>
		
	  
		<hr style={{width:'25%'}}/>
	  
	  {
		  //Iterate through each list and return an element for each item
	  }
		<h3 style={{color:'green'}}>OK:</h3>
		{
			prodOk.map((item,index)=>{
				return <p key={index}>{item.Name}: <span style={{color:'green'}}>{item.Quantity}</span> left in stock, 
				shelf capacity: <span style={{color:'grey'}}>{item.Capacity}</span></p>
			})
		}
		{prodOk == 0 && <p>No products applicable</p>}
	  
	  	<h3 style={{color:'orange'}}>Warning:</h3>
		{
			prodWarn.map((item,index)=>{
				return <p key={index}>{item.Name}: <span style={{color:'orange'}}>{item.Quantity}</span> left in stock, 
				shelf capacity: <span style={{color:'grey'}}>{item.Capacity}</span></p>
			})
		}
		{prodWarn == 0 && <p>No products applicable</p>}
	  
	  	<h3 style={{color:'red'}}>Critical:</h3>
		{
			prodCrit.map((item,index)=>{
				return <p key={index}>{item.Name}: <span style={{color:'red'}}>{item.Quantity}</span> left in stock, 
				shelf capacity: <span style={{color:'grey'}}>{item.Capacity}</span></p>
			})
		}
		{prodCrit == 0 && <p>No products applicable</p>}
	  
	  	<h3 style={{color:'brown'}}>Out Of Stock:</h3>
		{
			prodNoStock.map((item,index)=>{
				return <p key={index}>{item.Name}: <span style={{color:'brown'}}>{item.Quantity}</span> left in stock, 
				shelf capacity: <span style={{color:'grey'}}>{item.Capacity}</span></p>
			})
		}
		{prodNoStock == 0 && <p>No products applicable</p>}
		
		<br/><br/>
		<button onClick={navHome}>Home</button>
		
    </div>
  )
}

export default Report;