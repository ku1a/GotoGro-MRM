import React from 'react';
import { useForm } from 'react-hook-form';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

//send data to dbms
function sendData(values) {
    fetch("http://localhost:3001/addTransaction", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {'Content-type': "application/json"}
    })
}

function Transaction(){
    // check whether results returned
    const [results, setResults] = useState([]);
    const [values, setValues] = useState([]);
    const [dataReturned, setDataReturned] = useState(false);
    
    // Form API Hook
    const {register, handleSubmit, formState: {errors} } = useForm({
        criteriaMode: "all"
    });
    
    // onSubmit - sends to console for debugging
    const onSubmit = values => {setValues(values); transactCheck(values)}

    // search for existing data
    function transactCheck(values) {
        fetch("http://localhost:3001/transactCheck", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {'Content-type': "application/json"}
        }).then(response => {
            setResults(response.statusText);
            console.log(response.statusText)

            if(response.statusText === "Success!")
                sendData(values);
        })
    }
	
	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}
	
    // render components
    return (
        <div>
            <div id='header'>
            <h1>Transaction Portal</h1>
            </div>
            <br></br>
            <form onSubmit={handleSubmit(onSubmit)}
            >

                <label>MemberID: </label>
                <input 
                    {...register("memberID", {
                        required: "This field is required.",
                        pattern: {value: /^[0-9\s]+$/, message: "Please enter the numberic ID of an existing member."}
                    }
                    )}
                    type='text'
                />
                <p class="error">{errors.memberID?.message}</p>
                
                <label>ProductID: </label>
                <input 
                    {...register("productID", {
                        required: "This field is required.",
                        pattern: {value: /^[0-9\s]+$/, message: "Please enter the numeric ID of an existing product."}
                    }
                    )}
                    type='text'
                />
                <p class="error">{errors.productID?.message}</p>

                {/* Quantity */}
                <label>Quantity of Product: </label>
                <input
                    {...register("quantity", 
                        {
                            required: "This field is required.",
                            min: { value: 1, message: "At least 1 product is required."},
                            max: { value: 99, message: "Max quantity 99."},
                            pattern: {value: /^[1-9][0-9]?$/, message: "Please specify a number."}
                        }
                    )}
                    type='number'
                />
                <p class="error">{errors.quantity?.message}</p>

                <label>Date of Purchase: </label>
                <input 
                    {...register("transactionDate",
                        {
                            required: "This field is required.",
                        }
                    )}
                type='date'/>
                <p class="error">{errors.dateAdded?.message}</p>
                
                <button type="submit" id='submit'>Submit</button> 
				        <button type="reset" id='reset'>Reset</button>
				
				        <br/><br/>
				        <button onClick={navHome}>Home</button>
            </form>
            
            {results === "Error! Member not found" ? <h3 class="error">{results}</h3> : false}
            {results === "Error! Product not found" ? <h3 class="error">{results}</h3> : false}
            {results ===  "Success!" ? <h3 class="error">Succesfully Added Transaction</h3> : false}
        </div>
    )
}

export default Transaction;