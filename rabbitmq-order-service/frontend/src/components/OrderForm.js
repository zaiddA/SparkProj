import React, { useState } from 'react';
// import axios from 'axios';
import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Chip, Stack, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const warehouseOptions = [
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Bangalore', value: 'Bangalore' },
];

// Reverse logistics cost calculation (static for now, easy to extend)
function calculateReverseLogisticsCost(order) {
  // In production, use order details to calculate cost
  return 100; // Rs. 100 static for prototype
}

function getEligibleCustomers(warehouse) {
  const mockData = {
    Delhi: [
      { name: 'Amit Sharma', distance: 3.2, likelihood: 85 },
      { name: 'Priya Singh', distance: 7.1, likelihood: 72 },
      { name: 'Rahul Verma', distance: 9.5, likelihood: 65 },
      { name: 'Sunita Yadav', distance: 2.5, likelihood: 92 },
      { name: 'Manoj Kumar', distance: 6.3, likelihood: 48 },
      { name: 'Kavita Joshi', distance: 8.0, likelihood: 27 },
      { name: 'Deepak Singh', distance: 4.7, likelihood: 54 },
      { name: 'Ritu Gupta', distance: 5.9, likelihood: 38 },
    ],
    Mumbai: [
      { name: 'Sneha Patil', distance: 2.8, likelihood: 80 },
      { name: 'Rohan Mehta', distance: 5.4, likelihood: 70 },
      { name: 'Anjali Desai', distance: 8.2, likelihood: 60 },
      { name: 'Vikas Shah', distance: 3.1, likelihood: 88 },
      { name: 'Meena Rao', distance: 7.5, likelihood: 44 },
      { name: 'Suresh Iyer', distance: 6.8, likelihood: 33 },
      { name: 'Pooja Nair', distance: 4.2, likelihood: 57 },
      { name: 'Aakash Jain', distance: 9.0, likelihood: 22 },
    ],
    Bangalore: [
      { name: 'Vikram Rao', distance: 4.1, likelihood: 78 },
      { name: 'Divya Nair', distance: 6.7, likelihood: 68 },
      { name: 'Arjun Shetty', distance: 9.0, likelihood: 62 },
      { name: 'Shreya Menon', distance: 2.9, likelihood: 95 },
      { name: 'Naveen Reddy', distance: 7.3, likelihood: 41 },
      { name: 'Lakshmi Prasad', distance: 5.5, likelihood: 36 },
      { name: 'Harsha Gowda', distance: 8.8, likelihood: 53 },
      { name: 'Ramesh Babu', distance: 3.7, likelihood: 29 },
    ],
  };
  return mockData[warehouse] || [];
}

// 1. Add Walmart blue and gray color constants
const WALMART_BLUE = '#0071dc';
const WALMART_GRAY_BG = '#f2f2f2';
const WALMART_GRAY_BORDER = '#e0e0e0';

const getLikelihoodColor = (likelihood) => {
  if (likelihood >= 80) return WALMART_BLUE; // Walmart blue for high likelihood
  if (likelihood >= 60) return '#388e3c'; // medium green
  if (likelihood >= 40) return '#f57c00'; // orange for medium
  if (likelihood >= 20) return '#f57c00'; // orange for low-medium
  return '#d32f2f'; // red for very low likelihood
};

const OrderForm = () => {
  const [form, setForm] = useState({
    customer: '',
    warehouse: '',
  });
  const [itemInput, setItemInput] = useState({ name: '', price: '' });
  const [items, setItems] = useState([]);
  const [reverseCost, setReverseCost] = useState(null);
  const [eligibleCustomers, setEligibleCustomers] = useState([]);
  const [error, setError] = useState('');

  const totalOrderValue = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setReverseCost(null);
    setEligibleCustomers([]);
  };

  const handleItemInputChange = (e) => {
    setItemInput({ ...itemInput, [e.target.name]: e.target.value });
    setReverseCost(null);
    setEligibleCustomers([]);
  };

  const handleAddItem = () => {
    if (itemInput.name.trim() !== '' && itemInput.price !== '' && !isNaN(itemInput.price)) {
      setItems([...items, { name: itemInput.name.trim(), price: parseFloat(itemInput.price) }]);
      setItemInput({ name: '', price: '' });
      setError('');
      setReverseCost(null);
      setEligibleCustomers([]);
    } else {
      setError('Please enter both item name and a valid price.');
    }
  };

  const handleRemoveItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
    setReverseCost(null);
    setEligibleCustomers([]);
  };

  const validateForm = () => {
    if (!form.customer || !form.warehouse || items.length === 0) {
      setError('Please fill all fields and add at least one item.');
      return false;
    }
    setError('');
    return true;
  };

  const submitOrder = async () => {
    if (!validateForm()) return;
    const payload = {
      customer: form.customer,
      items: items,
      orderValue: totalOrderValue,
      warehouse: form.warehouse,
    };
    console.log('Simulated Cancelled Order:', payload);
    const cost = calculateReverseLogisticsCost(payload);
    setReverseCost(cost);
    const customers = getEligibleCustomers(form.warehouse);
    setEligibleCustomers(customers);
    // alert('Cancelled order simulated! Check console for details.');
  };

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      p: { xs: 3, md: 6 },
      bgcolor: WALMART_GRAY_BG,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'center', mb: 1 }}>
          <LocalShippingIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h4" fontWeight={600} color="primary">
            Simulate Cancelled Order
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary">
          Enter order details to simulate a cancelled order and view reallocation options
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      )}

      {/* Main Content */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 4,
        maxWidth: 1400,
        mx: 'auto',
        width: '100%',
      }}>
        {/* Left Column - Order Form */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Order Details
          </Typography>
          
          <Stack spacing={3}>
            <TextField 
              label="Customer Name" 
              name="customer" 
              value={form.customer} 
              onChange={handleChange} 
              fullWidth 
              variant="outlined"
              sx={{ bgcolor: 'white', fontSize: '1.1rem', '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: 2 } } }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Warehouse Location</InputLabel>
              <Select 
                name="warehouse" 
                value={form.warehouse} 
                label="Warehouse Location" 
                onChange={handleChange}
                sx={{ bgcolor: 'white', fontSize: '1.1rem', '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: 2 } } }}
              >
                {warehouseOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Cancelled Items
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-end">
              <TextField 
                label="Item Name" 
                name="name" 
                value={itemInput.name} 
                onChange={handleItemInputChange} 
                size="small" 
                sx={{ bgcolor: 'white', flex: 1, fontSize: '1.1rem', '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: 2 } } }}
              />
              <TextField 
                label="Price (Rs.)" 
                name="price" 
                value={itemInput.price} 
                onChange={handleItemInputChange} 
                size="small" 
                type="number" 
                sx={{ bgcolor: 'white', minWidth: 120, fontSize: '1.1rem', '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: 2 } } }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddItem} 
                startIcon={<AddIcon />}
                sx={{ minWidth: 120, bgcolor: WALMART_BLUE, color: 'white', fontWeight: 700, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', '&:hover': { bgcolor: '#005cb2' } }}
              >
                Add Item
              </Button>
            </Stack>

            {items.length > 0 && (
              <TableContainer component={Paper} sx={{ mt: 2, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Price (Rs.)</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={idx} sx={{ '&:hover': { bgcolor: WALMART_GRAY_BG } }}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell align="center">
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveItem(idx)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {items.length === 0 && (
              <Box sx={{ 
                p: 3, 
                textAlign: 'center', 
                bgcolor: 'white', 
                borderRadius: 1,
                border: '1px dashed #ddd'
              }}>
                <Typography color="text.secondary">No items added yet</Typography>
              </Box>
            )}

            <Box sx={{ 
              p: 2, 
              bgcolor: 'white', 
              borderRadius: 1, 
              border: '1px solid #e0e0e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Order Value:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ₹{totalOrderValue}
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="success" 
              onClick={submitOrder} 
              size="large"
              sx={{ 
                py: 1.5, 
                fontSize: '1.1rem',
                fontWeight: 600,
                bgcolor: WALMART_BLUE,
                color: 'white',
                fontWeight: 700,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                '&:hover': { bgcolor: '#005cb2' }
              }}
            >
              Simulate Cancelled Order
            </Button>
          </Stack>
        </Box>

        {/* Right Column - Results */}
        <Box>
          {reverseCost !== null && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Reverse Logistics Cost
              </Typography>
              <Alert 
                severity="info" 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: 16, 
                  bgcolor: '#e3f2fd', 
                  color: '#0d3559',
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }
                }}
              >
                <span>Reverse logistics cost to return this item:</span>
                <Typography component="span" sx={{ fontWeight: 700, fontSize: 18 }}>
                  ₹{reverseCost}
                </Typography>
              </Alert>
            </Box>
          )}

          {eligibleCustomers.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Eligible Customers for Reallocation
              </Typography>
              <TableContainer component={Paper} sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Distance (km)</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Acceptance (%)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {eligibleCustomers
                      .slice()
                      .sort((a, b) => b.likelihood - a.likelihood)
                      .slice(0, 7)
                      .map((c, idx) => (
                        <TableRow key={idx} sx={{ '&:hover': { bgcolor: WALMART_GRAY_BG } }}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.distance}</TableCell>
                          <TableCell>
                            <Box sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 2,
                              bgcolor: getLikelihoodColor(c.likelihood),
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '0.875rem',
                              minWidth: 60,
                              justifyContent: 'center',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            }}>
                              {c.likelihood}%
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {reverseCost === null && eligibleCustomers.length === 0 && (
            <Box sx={{ 
              p: 4, 
              textAlign: 'center', 
              bgcolor: 'white', 
              borderRadius: 1,
              border: '1px dashed #ddd'
            }}>
              <Typography color="text.secondary" variant="body1">
                Submit an order to see reverse logistics cost and eligible customers
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderForm; 