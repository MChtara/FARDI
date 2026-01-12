/**
 * PowerUpShop Component
 * Shop interface for purchasing power-ups with XP
 */
import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress
} from '@mui/material';
import './PowerUpShop.css';

const PowerUpShop = () => {
    const [powerups, setPowerups] = useState([]);
    const [inventory, setInventory] = useState({});
    const [userXP, setUserXP] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedPowerup, setSelectedPowerup] = useState(null);
    const [purchaseDialog, setPurchaseDialog] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch available power-ups
            const powerupsRes = await fetch('/api/phase5/powerups', {
                credentials: 'include'
            });
            const powerupsData = await powerupsRes.json();

            // Fetch user inventory
            const inventoryRes = await fetch('/api/phase5/powerups/inventory', {
                credentials: 'include'
            });
            const inventoryData = await inventoryRes.json();

            // Fetch user XP
            const progressionRes = await fetch('/api/gamification/progression', {
                credentials: 'include'
            });
            const progressionData = await progressionRes.json();

            if (powerupsData.success) {
                setPowerups(powerupsData.powerups);
            }

            if (inventoryData.success) {
                setInventory(inventoryData.inventory);
            }

            if (progressionData.total_xp !== undefined) {
                setUserXP(progressionData.total_xp);
            }
        } catch (error) {
            console.error('Error fetching power-up data:', error);
            setMessage({ type: 'error', text: 'Failed to load power-ups' });
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async () => {
        if (!selectedPowerup) return;

        try {
            const response = await fetch('/api/phase5/powerups/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ powerup_type: selectedPowerup.id })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setUserXP(data.new_balance);
                setInventory(prev => ({
                    ...prev,
                    [selectedPowerup.id]: (prev[selectedPowerup.id] || 0) + 1
                }));
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Purchase failed' });
        } finally {
            setPurchaseDialog(false);
            setSelectedPowerup(null);
        }
    };

    const openPurchaseDialog = (powerup) => {
        setSelectedPowerup(powerup);
        setPurchaseDialog(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="powerup-shop">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Power-Up Shop
                </Typography>
                <Chip
                    label={`Your XP: ${userXP.toLocaleString()}`}
                    color="primary"
                    sx={{ fontSize: '1.1rem', px: 2, py: 3 }}
                />
            </Box>

            {message && (
                <Alert severity={message.type} sx={{ mb: 3 }} onClose={() => setMessage(null)}>
                    {message.text}
                </Alert>
            )}

            <Grid container spacing={3}>
                {powerups.map((powerup) => {
                    const owned = inventory[powerup.id] || 0;
                    const canAfford = userXP >= powerup.cost;

                    return (
                        <Grid item xs={12} sm={6} md={4} key={powerup.id}>
                            <Card className={`powerup-card ${!canAfford ? 'disabled' : ''}`}>
                                <CardContent>
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <Typography variant="h2" component="div">
                                            {powerup.icon}
                                        </Typography>
                                    </Box>

                                    <Typography variant="h6" gutterBottom>
                                        {powerup.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {powerup.description}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Chip
                                            label={`${powerup.cost} XP`}
                                            color={canAfford ? 'success' : 'default'}
                                            size="small"
                                        />
                                        {owned > 0 && (
                                            <Chip
                                                label={`Owned: ${owned}`}
                                                color="primary"
                                                size="small"
                                            />
                                        )}
                                    </Box>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        disabled={!canAfford}
                                        onClick={() => openPurchaseDialog(powerup)}
                                    >
                                        Purchase
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Purchase Confirmation Dialog */}
            <Dialog open={purchaseDialog} onClose={() => setPurchaseDialog(false)}>
                <DialogTitle>Confirm Purchase</DialogTitle>
                <DialogContent>
                    {selectedPowerup && (
                        <Box>
                            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                                {selectedPowerup.icon}
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                {selectedPowerup.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {selectedPowerup.description}
                            </Typography>
                            <Alert severity="info">
                                Cost: {selectedPowerup.cost} XP<br />
                                Your balance after purchase: {userXP - selectedPowerup.cost} XP
                            </Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPurchaseDialog(false)}>Cancel</Button>
                    <Button onClick={handlePurchase} variant="contained" color="primary">
                        Confirm Purchase
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PowerUpShop;
