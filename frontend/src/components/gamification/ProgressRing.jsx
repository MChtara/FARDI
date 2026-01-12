/**
 * ProgressRing Component
 * Circular progress indicator with smooth animations
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ProgressRing.css';

const ProgressRing = ({
    progress = 0,
    size = 120,
    strokeWidth = 8,
    color = '#8B5CF6',
    backgroundColor = '#E5E7EB',
    showPercentage = true,
    label = '',
    animated = true
}) => {
    const [displayProgress, setDisplayProgress] = useState(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (displayProgress / 100) * circumference;

    useEffect(() => {
        if (animated) {
            // Animate from 0 to target progress
            const duration = 1000; // 1 second
            const steps = 60;
            const increment = progress / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= progress) {
                    setDisplayProgress(progress);
                    clearInterval(timer);
                } else {
                    setDisplayProgress(current);
                }
            }, duration / steps);

            return () => clearInterval(timer);
        } else {
            setDisplayProgress(progress);
        }
    }, [progress, animated]);

    return (
        <div className="progress-ring-container" style={{ width: size, height: size }}>
            <svg
                className="progress-ring-svg"
                width={size}
                height={size}
            >
                {/* Background circle */}
                <circle
                    className="progress-ring-background"
                    stroke={backgroundColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />

                {/* Progress circle */}
                <circle
                    className="progress-ring-progress"
                    stroke={color}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        transition: animated ? 'stroke-dashoffset 0.5s ease' : 'none',
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%'
                    }}
                />
            </svg>

            {/* Center content */}
            <div className="progress-ring-content">
                {showPercentage && (
                    <div className="progress-ring-percentage">
                        {Math.round(displayProgress)}%
                    </div>
                )}
                {label && (
                    <div className="progress-ring-label">
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
};

ProgressRing.propTypes = {
    progress: PropTypes.number,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    showPercentage: PropTypes.bool,
    label: PropTypes.string,
    animated: PropTypes.bool
};

export default ProgressRing;
