import React, {useState, useEffect} from "react";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// This component is responsible for removing products that have sold at least a month after being added
function DeleteProducts(){

    // states to hold results and confirm results are retrieved
    const [results, setResults] = useState([]);
    const [dataReturned, setDataReturned] = useState([]);

    // react hook form
    const { reset } = useForm();

    // navigate from router dom
    const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}

    // submit values for deleting
    function deleteProducts(values){
        console.log(JSON.stringify(values));
        
        fetch("http://localhost:3001/deleteMultipleProducts", {
          method: "POST",
          body: JSON.stringify(values),
          headers: { 'Content-type': "application/json"}
         }) 
      }

    // retrieve table with prod ID, and latest sale date
    useEffect(() => {
        fetch("http://localhost:3001/unpopularProducts", {
        method: "POST",
        headers: { 'Content-type': "application/json"}
        }).then(response => response.json()).then(data => {setDataReturned(true); setResults(data); reset(results)})
    },[])
    
    // Render results
    return (
        <div>
            <div id="header">
            <h1>GotoGrocery MRM</h1>
            </div>
            <h2>Multi-Product Delete</h2>
            <p>Products that did not sell for over a month appear here:</p>
            
        
            <hr style={{width:'25%'}}/>
        
        {

            // Should show all products where last sale date is > 1 month (28 days)
        }
            <h3>Results:</h3>
            {dataReturned === true && results[0]? 
            results.map((item, index) => {return <p key={index}> ProductID: {item.ProductID} - <span>Days since last sale: {item.dateDifference}</span></p>}) : <p>Nothing to display.</p>
            }
            
            <button type="submit" onClick={()=> deleteProducts(results)}>Delete All</button>
            <button onClick={navHome}>Home</button>
        </div>
    )
}

export default DeleteProducts;