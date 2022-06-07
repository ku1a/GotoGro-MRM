import { useNavigate } from 'react-router-dom';

// Landing page component
function Report(){ 
  
  const navigate = useNavigate()
  
  function navAddMember(){
	navigate('/memberPortal');
  }
  
  function navEditMember(){
	navigate('/memberManagement');
  }
  
  function navAddProd(){
	navigate('/productPortal');
  }
  
  function navEditProd(){
	navigate('/productManagement');
  }
  
  function navAddTransact(){
	navigate('/transactPortal');
  }
  
  function navEditTransact(){
	navigate('/transactManagement');
  }
  
  function navProdReport(){
	navigate('/ProductReport');
  }
  
  function navSaleReport(){
	navigate('/salesTrends');
  }

  function navDeleteProducts(){
	  navigate('/deleteMultiple');
  }
  
  return (
    <div>
		<div id='header'>
            <h1>Welcome to Goto Gro!</h1>
        </div>
		
        <br/>
		
		<h2>What would you like to do?</h2>
		
		<hr style={{width:'25%'}}/>
		
		<h3>Manage Members:</h3>
		<button onClick={navAddMember}>Add Members</button>
		<button onClick={navEditMember}>Edit / Delete Members</button>
		
		<hr style={{width:'25%'}}/>
		
		<h3>Manage Products:</h3>
		<button onClick={navAddProd}>Add Products</button>
		<button onClick={navEditProd}>Edit / Delete Products</button>
		<button onClick={navDeleteProducts}>Check Unpopular Products</button>
		
		<hr style={{width:'25%'}}/>
		
		<h3>Manage Transactions</h3>
		<button onClick={navAddTransact}>Create Transactions</button>
		<button onClick={navEditTransact}>Edit / Delete Transactions</button>
		
		<hr style={{width:'25%'}}/>
		
		<h3>Generate Reports:</h3>
		<button onClick={navProdReport}>Stock Report</button>
		<button onClick={navSaleReport}>Sales Trends</button>
    </div>
  )
}

export default Report;