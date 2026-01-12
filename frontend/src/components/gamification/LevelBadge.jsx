/**
 * LevelBadge Component
 * Display user's current level with icon and animations
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './LevelBadge.css';

const LevelBadge = ({
    level = 1,
    title = 'Beginner',
    icon = '🌟',
    size = 'medium',
    showGlow = false,
    onClick = null,
    compact = false
}) => {
    const [isLevelUp, setIsLevelUp] = useState(false);

    useEffect(() => {
        // Listen for level-up events
        const handleLevelUp = (event) => {
            if (event.detail.newLevel === level) {
                setIsLevelUp(true);
                setTimeout(() => setIsLevelUp(false), 2000);
            }
        };

        window.addEventListener('levelUp', handleLevelUp);
        return () => window.removeEventListener('levelUp', handleLevelUp);
    }, [level]);

    const sizeClasses = {
        small: 'level-badge-small',
        medium: 'level-badge-medium',
        large: 'level-badge-large'
    };

    return (
        <div
            className={`level-badge ${sizeClasses[size]} ${isLevelUp ? 'level-up-animation' : ''} ${showGlow ? 'level-badge-glow' : ''} ${compact ? 'level-badge-compact' : ''} ${onClick ? 'level-badge-clickable' : ''}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div className="level-badge-icon">
                {typeof icon === 'string' && icon.startsWith('http') ? (
                    <img src={icon} alt={title} />
                ) : (
                    <span>{icon}</span>
                )}
            </div>

            {!compact && (
                <div className="level-badge-info">
                    <div className="level-badge-number">Level {level}</div>
                    <div className="level-badge-title">{title}</div>
                </div>
            )}

            {compact && (
                <div className="level-badge-number-compact">{level}</div>
            )}

            {isLevelUp && (
                <div className="level-up-indicator">
                    <span className="level-up-text">Level Up!</span>
                    <span className="level-up-sparkle">✨</span>
                </div>
            )}
        </div>
    );
};

LevelBadge.propTypes = {
    level: PropTypes.number,
    title: PropTypes.string,
    icon: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    showGlow: PropTypes.bool,
    onClick: PropTypes.func,
    compact: PropTypes.bool
};

export default LevelBadge;
