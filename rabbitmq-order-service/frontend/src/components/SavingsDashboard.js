import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tooltip,
  Divider,
  Alert,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  LocalShipping,
  Savings,
  AttachMoney,
  Timeline,
  Refresh,
  Info,
  CheckCircle,
  Warning
} from '@mui/icons-material';

// Mock data for the dashboard - aligned with OrderForm.js data
const mockSavingsData = {
  totalSavings: 156400,
  monthlySavings: 28400,
  weeklySavings: 6800,
  dailySavings: 950,
  ordersRelocated: 847,
  ordersCancelled: 63,
  relocationRate: 93.1,
  avgSavingsPerOrder: 100, // Based on reverse logistics cost from OrderForm
  costAvoided: 84700,
  fuelSaved: 1240,
  carbonReduced: 6.8,
  warehouseEfficiency: 89.2
};

const mockMonthlyData = [
  { month: 'Jan', savings: 22400, orders: 142, efficiency: 85 },
  { month: 'Feb', savings: 19800, orders: 128, efficiency: 82 },
  { month: 'Mar', savings: 25600, orders: 156, efficiency: 88 },
  { month: 'Apr', savings: 28400, orders: 167, efficiency: 91 },
  { month: 'May', savings: 26800, orders: 158, efficiency: 89 },
  { month: 'Jun', savings: 28400, orders: 167, efficiency: 87 }
];

const mockTopWarehouses = [
  { name: 'Delhi', savings: 45600, orders: 234, efficiency: 94 },
  { name: 'Mumbai', savings: 38900, orders: 198, efficiency: 89 },
  { name: 'Bangalore', savings: 32400, orders: 167, efficiency: 85 }
];

const mockRecentRelocations = [
  { id: 'ORD-001', customer: 'Amit Sharma', value: 2500, savings: 100, status: 'Completed' },
  { id: 'ORD-002', customer: 'Priya Singh', value: 1800, savings: 100, status: 'In Progress' },
  { id: 'ORD-003', customer: 'Rahul Verma', value: 3200, savings: 100, status: 'Completed' },
  { id: 'ORD-004', customer: 'Sunita Yadav', value: 1500, savings: 100, status: 'Pending' },
  { id: 'ORD-005', customer: 'Manoj Kumar', value: 2800, savings: 100, status: 'Completed' },
  { id: 'ORD-006', customer: 'Sneha Patil', value: 2100, savings: 100, status: 'Completed' },
  { id: 'ORD-007', customer: 'Vikram Rao', value: 3400, savings: 100, status: 'In Progress' },
  { id: 'ORD-008', customer: 'Shreya Menon', value: 1900, savings: 100, status: 'Completed' }
];

// 1. Add Walmart blue and gray color constants
const WALMART_BLUE = '#0071dc';
const WALMART_GRAY_BG = '#f2f2f2';
const WALMART_GRAY_BORDER = '#e0e0e0';

const SavingsDashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleRefresh = () => {
    setLastUpdated(new Date());
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'info';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend = null }) => (
    <Card sx={{ height: '100%', bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main`, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Stack>
        {trend && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
              {Math.abs(trend)}% from last month
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      p: { xs: 2, md: 4 },
      bgcolor: WALMART_GRAY_BG,
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Savings sx={{ fontSize: 32, color: WALMART_BLUE }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                Order Relocation Savings Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Track your cost savings and efficiency gains from order relocation
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} sx={{ bgcolor: 'white', boxShadow: 1 }}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
        
        <Alert severity="info" sx={{ 
          bgcolor: '#e3f2fd', 
          color: '#0d3559',
          '& .MuiAlert-icon': { color: WALMART_BLUE }
        }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Info />
            <Typography variant="body2">
              Last updated: {lastUpdated.toLocaleString()}
            </Typography>
          </Stack>
        </Alert>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Savings"
            value={formatCurrency(mockSavingsData.totalSavings)}
            subtitle="Since implementation"
            icon={<AttachMoney />}
            color="success"
            trend={12.5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Savings"
            value={formatCurrency(mockSavingsData.monthlySavings)}
            subtitle="This month"
            icon={<Timeline />}
            color="primary"
            trend={8.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Orders Relocated"
            value={mockSavingsData.ordersRelocated.toLocaleString()}
            subtitle={`${mockSavingsData.relocationRate}% success rate`}
            icon={<LocalShipping />}
            color="info"
            trend={15.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Savings/Order"
            value={formatCurrency(mockSavingsData.avgSavingsPerOrder)}
            subtitle="Per relocated order"
            icon={<Savings />}
            color="warning"
            trend={-2.1}
          />
        </Grid>
      </Grid>

      {/* Detailed Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Monthly Performance Trend
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Month</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Savings</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Orders</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Efficiency</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockMonthlyData.map((row, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: WALMART_GRAY_BG } }}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(row.savings)}
                      </TableCell>
                      <TableCell>{row.orders}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${row.efficiency}%`} 
                          size="small" 
                          color={row.efficiency >= 85 ? 'success' : row.efficiency >= 75 ? 'warning' : 'error'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ width: 200 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={row.efficiency} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: row.efficiency >= 85 ? 'success.main' : row.efficiency >= 75 ? 'warning.main' : 'error.main'
                            }
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Top Performing Warehouses
            </Typography>
            <Stack spacing={2}>
              {mockTopWarehouses.map((warehouse, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {warehouse.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {formatCurrency(warehouse.savings)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      {warehouse.orders} orders
                    </Typography>
                    <Chip 
                      label={`${warehouse.efficiency}%`} 
                      size="small" 
                      color={warehouse.efficiency >= 85 ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </Stack>
                  {index < mockTopWarehouses.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Relocations and Environmental Impact */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Order Relocations
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Order Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Savings</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockRecentRelocations.map((order, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: WALMART_GRAY_BG } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{formatCurrency(order.value)}</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(order.savings)}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={order.status} 
                          size="small" 
                          color={getStatusColor(order.status)}
                          icon={order.status === 'Completed' ? <CheckCircle /> : <Warning />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Environmental Impact
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2">Fuel Saved</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {mockSavingsData.fuelSaved} liters
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0' }} 
                  />
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="body2">Carbon Reduced</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {mockSavingsData.carbonReduced} tons CO₂
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={68} 
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#e0e0e0' }} 
                  />
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `1px solid ${WALMART_GRAY_BORDER}` }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Cost Avoidance
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {formatCurrency(mockSavingsData.costAvoided)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total cost avoided through relocation
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {mockSavingsData.warehouseEfficiency}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Warehouse efficiency improvement
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SavingsDashboard; 