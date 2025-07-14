import React, { useState } from 'react';
import './App.css';
import OrderForm from './components/OrderForm';
import SavingsDashboard from './components/SavingsDashboard';
import { Box, Tabs, Tab, AppBar, Toolbar, Typography } from '@mui/material';
import { LocalShipping, Savings } from '@mui/icons-material';

function App() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <div className="App">
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            Order Relocation System
          </Typography>
          <Tabs value={currentTab} onChange={handleTabChange} sx={{ 
            '& .MuiTab-root': { 
              minHeight: 64,
              textTransform: 'none',
              fontWeight: 600
            }
          }}>
            <Tab 
              icon={<LocalShipping />} 
              label="Simulate Order" 
              iconPosition="start"
            />
            <Tab 
              icon={<Savings />} 
              label="Savings Dashboard" 
              iconPosition="start"
            />
          </Tabs>
        </Toolbar>
      </AppBar>
      
      <Box sx={{ mt: 0 }}>
        {currentTab === 0 && <OrderForm />}
        {currentTab === 1 && <SavingsDashboard />}
      </Box>
    </div>
  );
}

export default App;
