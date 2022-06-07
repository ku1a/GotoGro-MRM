import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import {CSVLink} from 'react-csv';
import { useNavigate } from 'react-router-dom';

function SalesTrends() {
	
	const navigate = useNavigate()

    const {register, handleSubmit, formState: {errors} } = useForm( {
        criteriaMode: "all"
    });

    const onSubmit = (values) => fetchData(values);

    // Storage variables - contains data
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);

    // Constraint variables - used for validation and preventing infinite loops
    const [dataReturned, setDataReturned] = useState(false);
    const [status, setStatus] = useState(true);
    const [categoryCheck, setCategoryCheck] = useState(false);

    const fetchData = (values) => {
        if(dateCheck(values.date1, values.date2)) {
            
            fetch("http://localhost:3001/getSalesTrends", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {'Content-type' : "application/json"}
            }).then(response => response.json()).then(data => {console.log(data); setResults(data); console.log(data); setDataReturned(true)})
        }
    }

    // Grabs categories from database after rendering
    useEffect(() => {

        // Quick check to prevent infinte loop
        if(!categoryCheck) { 
            fetch("http://localhost:3001/getCategories", {
                method: "POST",
                headers: {'Content-type' : "application.json"}
            }).then(response => response.json()).then(data => {setCategories(data); setCategoryCheck(true)}) 
        }
    })

	function navHome(){
		navigate('/');
	}

    function loadCategories() {

        // Create new Set 
        var filteredCategories = new Set();

        // For each value in Categories, add to set (automatically filters duplicate values)
        for(var i = 0; i < categories.length; i++) 
            filteredCategories.add(Object.values(categories[i])[0])

        // For each filtered set element, take values and create HTML option elements
        var data = [];  
        for(let [value] of filteredCategories.entries())
            data.push(<option value={value}>{value}</option>)
        
        // Return elements in array
        return data;
    }

    function dateCheck(date1, date2) {

        // Convert to JS Date objects for comparison purposes
        var startDate = new Date(date1);
        var endDate = new Date(date2);

        // Generate new Date Object (with today's date) for further comparison
        var today = new Date();
      
        // If the start date is older than the end date, and the end date is not past today, return true
        if(startDate < endDate && endDate <= today) 
            return true;
        else {
            setStatus(false);
            return false;
        }
    }

    return (
        <div className="App">
            {dataReturned === true && results[0] !== "empty" ? <DisplayResults values={results}/> : 
            <div>
                <h1>GoToGrocery MRM</h1>
                <h2>Generate Sales Trends Report</h2>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <label for="category">Product Category: </label>
                    <select type="select" name="category"{...register("Category")}>
                        <option value="all">All</option>
                        {loadCategories()}
                    </select>
                    <br/><br/>
                    <label for="date1">Start Date: </label>
                    <input type="date" id="date1" 
                    {...register('date1', 
                        {required: {value: true, message: "Missing Start Date"}})
                    }/>
                        <ErrorMessage 
                            errors={errors}
                            name="date1"
                            render={({messages}) => 
                            messages &&
                            Object.entries(messages).map(([type, message]) => (
                                <p class="error" key={type}>Error! {message}</p>
                        ))}/>
                    <br/><br/>
                    <label for="date2">End Date: </label>
                    <input type="date" id="date2" 
                    {...register('date2', 
                        {required: {value: true, message: "Missing End Date"}})
                    }/>
                        <ErrorMessage 
                                errors={errors}
                                name="date2"
                                render={({messages}) => 
                                messages &&
                                Object.entries(messages).map(([type, message]) => (
                                    <p class="error" key={type}>Error! {message}</p>
                            ))}/>
                    <br/><br/>
                    <button>Submit</button>
                    <button type="reset">Reset</button>
					
					<br/><br/>
					<button onClick={navHome}>Home</button>
					
                </form>
                {status === false ? <h3 class="error">Selected Dates are Invalid</h3> : false}
                {results[0] === "empty" ? <h3 class="error">No transactions within these dates were found</h3> : false}
            </div>
            }
        </div> 
    );
}

function DisplayResults(data) {
	
	const navigate = useNavigate()
  
	function navHome(){
		navigate('/');
	}

    function sortFunction(a, b) {

        // If values are equal, exit
        if(a[3] === b[3])
            return 0;

        // Else, if one is greater than the over, move
        else {
            return(a[3] > b[3]) ? -1 : 1;
        }
    }

    var values = data.values[0];
    var dates = data.values[1];

    var filter = new Set();
    
    // For each imported value
    for(var i = 0; i < values.length; i++) 
        // Sets automatically check for duplicate values - ensuring that each ProductID is only recorded once
        filter.add(values[i].ProductID)
    
    // Push each element of the filtered set into an array
    var temp = [];
    for(let productID of filter) temp.push(productID);

    // Generate two-dimensional array using filtered values
    var records = [];

    // For each value in temp, and in turn for each value in values
    for(var i = 0; i < temp.length; i++) {
        for (var j = 0; j < values.length; j++) {
            // If a matching ID is found
            if(temp[i] === values[j].ProductID) {

                // If current records entry is undefined, assign current value's product quantity
                if(records[i] === undefined)
                     records[i] = [temp[i], values[j].Name, values[j].Category, values[j].ProductQuantity] 
                    
                // Else, a quantity must already be present - add new one to value
                else
                    records[i][3] += values[j].ProductQuantity;              
            }
        }  
    }
    
    // Sort values by quantity sold
    records.sort(sortFunction)

    return ( <div className="App">
                <h1>GoToGrocery MRM</h1>
                <h2>Generate Sales Trends Report</h2>
                <p>Top-Selling Products Between: {dates[0]} AND {dates[1]}</p>

                <table>
                <tr id="headers"> 
                    <td>Product ID</td>
                    <td>Product Name</td>
                    <td>Product Category</td>
                    <td>Total Quantity Sold</td>
                </tr>
                {   
                    records.map((items, index) => {
                        return (
                            <tr>
                                <td>{records[index][0]}</td>
                                <td>{records[index][1]}</td>
                                <td>{records[index][2]}</td>
                                <td>{records[index][3]}</td>
                            </tr>
                        )
                    })
                }
                </table>
                <br></br>
				<button> <CSVLink data={records} headers={["ProductID", "Product Name", "Product Category", "Total Quantity Sold"]} filename={"salesTrends.csv"} enclosingCharacter="">Download Results</CSVLink></button>
            
				<br/><br/>
				<button onClick={navHome}>Home</button>
			</div>
        )
}

export default SalesTrends;