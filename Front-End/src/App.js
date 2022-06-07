import React from 'react';
import './index.css';
import LandingPage from './OtherPages/LandingPage';
import MemberSearch from './MemberPortal/MemberManagement';
import MemberSignup from './MemberPortal/MemberSignup';
import ProductPortal from './ProductPortal/Form.js';
import ProductSearch from './ProductPortal/ProductManagement';
import Transaction from './TransactionPortal/transaction';
import ProductReport from './ProductPortal/ProductReport';
import TransactSearch from './TransactionPortal/TransactManagement';
import SalesTrends from './ProductPortal/SalesTrendsReport';
import DeleteProducts from './ProductPortal/deleteMultiple';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';

function App() {
    return (
      <Router>
        <Routes>
			<Route path='/' element={<LandingPage/>} />
            <Route path='/memberPortal' element={<MemberSignup/>} />
            <Route path='/memberManagement' element={<MemberSearch/>} />
            <Route path='/productPortal' element={<ProductPortal/>} />
			      <Route path='/productManagement' element={<ProductSearch/>} />
            <Route path='/transactPortal' element={<Transaction/>} />
			      <Route path='/productReport' element={<ProductReport/>} />
            <Route path='/transactManagement' element={<TransactSearch/>} />
            <Route path="/salesTrends" element={<SalesTrends/>}/>
            <Route path='/deleteMultiple' element={<DeleteProducts/>}/>
        </Routes>
      </Router>
    );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
export default App;
