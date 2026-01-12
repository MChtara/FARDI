/**
 * GamificationHeader Component
 * Compact header showing XP, streak, and level
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LevelBadge from './LevelBadge';
import './GamificationHeader.css';

const GamificationHeader = ({ compact = false }) => {
    const [gamificationData, setGamificationData] = useState({
        xp: 0,
        level: 1,
        levelTitle: 'Beginner',
        streak: 0,
        totalXP: 0,
        levelProgress: 0
    });
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchGamificationData();

        // Listen for XP gain events
        const handleXPGain = (event) => {
            setGamificationData(prev => ({
                ...prev,
                xp: prev.xp + event.detail.xp,
                totalXP: prev.totalXP + event.detail.xp
            }));
        };

        // Listen for level up events
        const handleLevelUp = (event) => {
            setGamificationData(prev => ({
                ...prev,
                level: event.detail.newLevel,
                totalXP: event.detail.totalXp
            }));
        };

        window.addEventListener('xpGained', handleXPGain);
        window.addEventListener('levelUp', handleLevelUp);

        return () => {
            window.removeEventListener('xpGained', handleXPGain);
            window.removeEventListener('levelUp', handleLevelUp);
        };
    }, []);

    const fetchGamificationData = async () => {
        try {
            const response = await fetch('/api/gamification/dashboard', {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setGamificationData({
                    xp: data.daily_xp || 0,
                    level: data.progression?.current_level || 1,
                    levelTitle: data.progression?.level_info?.title || 'Beginner',
                    streak: data.streak?.current_streak || 0,
                    totalXP: data.progression?.total_xp || 0,
                    levelProgress: data.progression?.progress_percentage || 0
                });
            }
        } catch (error) {
            console.error('Error fetching gamification data:', error);
        }
    };

    if (compact) {
        return (
            <div className="gamification-header compact">
                <div className="header-item xp-display">
                    <span className="header-icon">⭐</span>
                    <span className="header-value">{gamificationData.xp}</span>
                </div>

                {gamificationData.streak > 0 && (
                    <div className="header-item streak-display">
                        <span className="header-icon flame">🔥</span>
                        <span className="header-value">{gamificationData.streak}</span>
                    </div>
                )}

                <LevelBadge
                    level={gamificationData.level}
                    title={gamificationData.levelTitle}
                    compact={true}
                    size="small"
                />
            </div>
        );
    }

    return (
        <div className="gamification-header">
            <div
                className="header-stats"
                onClick={() => setShowDetails(!showDetails)}
                role="button"
                tabIndex={0}
            >
                {/* XP Display */}
                <div className="header-item xp-display">
                    <div className="header-icon-wrapper">
                        <span className="header-icon">⭐</span>
                    </div>
                    <div className="header-info">
                        <div className="header-label">XP Today</div>
                        <div className="header-value">{gamificationData.xp}</div>
                    </div>
                </div>

                {/* Streak Display */}
                <div className="header-item streak-display">
                    <div className="header-icon-wrapper flame-wrapper">
                        <span className="header-icon flame">🔥</span>
                    </div>
                    <div className="header-info">
                        <div className="header-label">Streak</div>
                        <div className="header-value">{gamificationData.streak} days</div>
                    </div>
                </div>

                {/* Level Badge */}
                <LevelBadge
                    level={gamificationData.level}
                    title={gamificationData.levelTitle}
                    size="medium"
                    onClick={() => setShowDetails(!showDetails)}
                />
            </div>

            {/* Details Dropdown */}
            {showDetails && (
                <div className="header-details">
                    <div className="detail-row">
                        <span className="detail-label">Total XP:</span>
                        <span className="detail-value">{gamificationData.totalXP.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Level Progress:</span>
                        <span className="detail-value">{Math.round(gamificationData.levelProgress)}%</span>
                    </div>
                    <div className="detail-progress-bar">
                        <div
                            className="detail-progress-fill"
                            style={{ width: `${gamificationData.levelProgress}%` }}
                        />
                    </div>
                    <button
                        className="view-dashboard-btn"
                        onClick={() => window.location.href = '/app/gamification'}
                    >
                        View Full Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

GamificationHeader.propTypes = {
    compact: PropTypes.bool
};

export default GamificationHeader;
