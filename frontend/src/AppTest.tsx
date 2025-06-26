import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegisterMinimal } from './pages/RegisterMinimal';

function AppTest() {
  console.log('AppTest: Rendering app');
  
  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
        <Routes>
          <Route path="/register" element={<RegisterMinimal />} />
          <Route path="*" element={
            <div style={{ 
              minHeight: '100vh', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              Test App - Go to <a href="/register">/register</a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default AppTest;
