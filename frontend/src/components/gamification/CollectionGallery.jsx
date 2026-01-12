/**
 * CollectionGallery Component
 * Display user's collectible collection with rarity system
 */
import { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    LinearProgress,
    Tabs,
    Tab,
    Tooltip,
    CircularProgress
} from '@mui/material';
import './CollectionGallery.css';

const RARITY_COLORS = {
    common: '#95A5A6',
    uncommon: '#27AE60',
    rare: '#3498DB',
    epic: '#9B59B6',
    legendary: '#F39C12'
};

const CollectionGallery = () => {
    const [collection, setCollection] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filterRarity, setFilterRarity] = useState('all');

    useEffect(() => {
        fetchCollection();
    }, []);

    const fetchCollection = async () => {
        try {
            const response = await fetch('/api/phase5/collectibles/collection', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setCollection(data.collection);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching collection:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCollection = filterRarity === 'all'
        ? collection
        : collection.filter(item => item.rarity === filterRarity);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="collection-gallery">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Collectible Gallery
                </Typography>

                {stats && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="body1" gutterBottom>
                            Collection Progress: {stats.owned} / {stats.total} ({stats.completion_percentage}%)
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={stats.completion_percentage}
                            sx={{ height: 10, borderRadius: 5 }}
                        />
                    </Box>
                )}
            </Box>

            {/* Rarity Filter Tabs */}
            <Tabs
                value={filterRarity}
                onChange={(e, newValue) => setFilterRarity(newValue)}
                sx={{ mb: 3 }}
            >
                <Tab label="All" value="all" />
                <Tab label="Common" value="common" />
                <Tab label="Uncommon" value="uncommon" />
                <Tab label="Rare" value="rare" />
                <Tab label="Epic" value="epic" />
                <Tab label="Legendary" value="legendary" />
            </Tabs>

            {/* Collection Grid */}
            <Grid container spacing={2}>
                {filteredCollection.map((item) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                        <Tooltip
                            title={
                                <Box>
                                    <Typography variant="subtitle2">{item.name}</Typography>
                                    <Typography variant="caption">{item.description}</Typography>
                                    {item.owned && (
                                        <Typography variant="caption" display="block">
                                            Quantity: {item.quantity}
                                        </Typography>
                                    )}
                                </Box>
                            }
                            arrow
                        >
                            <Card
                                className={`collectible-card ${item.owned ? 'owned' : 'locked'}`}
                                sx={{
                                    borderColor: item.color,
                                    borderWidth: 2,
                                    borderStyle: 'solid'
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                    <Box
                                        className={`collectible-icon ${!item.owned ? 'grayscale' : ''}`}
                                        sx={{ fontSize: '3rem', mb: 1 }}
                                    >
                                        {item.owned ? '🎁' : '🔒'}
                                    </Box>

                                    <Typography variant="caption" display="block" noWrap>
                                        {item.name}
                                    </Typography>

                                    <Chip
                                        label={item.rarity}
                                        size="small"
                                        sx={{
                                            backgroundColor: item.color,
                                            color: 'white',
                                            fontSize: '0.65rem',
                                            height: 20,
                                            mt: 0.5
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>

            {filteredCollection.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                        No collectibles found in this category
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default CollectionGallery;
