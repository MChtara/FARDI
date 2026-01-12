/**
 * ConfettiCannon Component
 * Canvas-based confetti animation for celebrations
 */
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './ConfettiCannon.css';

const ConfettiCannon = ({ autoTrigger = false, duration = 3000 }) => {
    const canvasRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Listen for confetti trigger events
        const handleTrigger = (event) => {
            const options = event.detail || {};
            triggerConfetti(options);
        };

        window.addEventListener('triggerConfetti', handleTrigger);

        if (autoTrigger) {
            triggerConfetti();
        }

        return () => {
            window.removeEventListener('triggerConfetti', handleTrigger);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [autoTrigger]);

    const triggerConfetti = (options = {}) => {
        const {
            particleCount = 100,
            spread = 70,
            origin = { x: 0.5, y: 0.5 },
            colors = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#EC4899', '#14B8A6']
        } = options;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        setIsActive(true);

        // Create particles
        const particles = [];
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.random() * spread - spread / 2) * (Math.PI / 180);
            const velocity = Math.random() * 10 + 5;

            particles.push({
                x: canvas.width * origin.x,
                y: canvas.height * origin.y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - Math.random() * 5,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 4,
                rotation: Math.random() * 360,
                rotationSpeed: Math.random() * 10 - 5,
                gravity: 0.5,
                opacity: 1
            });
        }

        particlesRef.current = particles;

        // Animation loop
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;

            if (elapsed > duration) {
                setIsActive(false);
                particlesRef.current = [];
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle, index) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += particle.gravity;
                particle.rotation += particle.rotationSpeed;

                // Fade out near the end
                if (elapsed > duration * 0.7) {
                    particle.opacity = 1 - (elapsed - duration * 0.7) / (duration * 0.3);
                }

                // Draw particle
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate((particle.rotation * Math.PI) / 180);
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particle.color;

                // Draw rectangle (confetti piece)
                ctx.fillRect(
                    -particle.size / 2,
                    -particle.size / 4,
                    particle.size,
                    particle.size / 2
                );

                ctx.restore();

                // Remove particles that are off-screen
                if (particle.y > canvas.height + 100) {
                    particlesRef.current.splice(index, 1);
                }
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();
    };

    return (
        <canvas
            ref={canvasRef}
            className={`confetti-canvas ${isActive ? 'active' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999
            }}
        />
    );
};

ConfettiCannon.propTypes = {
    autoTrigger: PropTypes.bool,
    duration: PropTypes.number
};

export default ConfettiCannon;
