'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

// Fade in animation
export const FadeIn = ({
    children,
    delay = 0,
    duration = 0.5,
    className = ''
}: {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger children animation
export const StaggerContainer = ({
    children,
    staggerDelay = 0.1,
    className = ''
}: {
    children: ReactNode;
    staggerDelay?: number;
    className?: string;
}) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Stagger item
export const StaggerItem = ({
    children,
    className = ''
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: 'easeOut' }
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Scale on hover
export const ScaleOnHover = ({
    children,
    scale = 1.02,
    className = ''
}: {
    children: ReactNode;
    scale?: number;
    className?: string;
}) => {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Slide in from side
export const SlideIn = ({
    children,
    direction = 'left',
    delay = 0,
    className = ''
}: {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
    className?: string;
}) => {
    const directions = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: -50 },
        down: { x: 0, y: 50 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Page transition wrapper
export const PageTransition = ({
    children,
    className = ''
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Parallax scroll effect (for landing pages)
export const ParallaxSection = ({
    children,
    offset = 50,
    className = ''
}: {
    children: ReactNode;
    offset?: number;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ y: offset }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Floating animation (for decorative elements)
export const FloatingElement = ({
    children,
    duration = 3,
    distance = 10,
    className = ''
}: {
    children: ReactNode;
    duration?: number;
    distance?: number;
    className?: string;
}) => {
    return (
        <motion.div
            animate={{
                y: [-distance, distance, -distance],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

// Animated counter
export const AnimatedNumber = ({
    value,
    duration = 1,
    className = ''
}: {
    value: number;
    duration?: number;
    className?: string;
}) => {
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={className}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={value}
            >
                {value}
            </motion.span>
        </motion.span>
    );
};

// Button with ripple effect
export const AnimatedButton = ({
    children,
    onClick,
    className = '',
    disabled = false,
}: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </motion.button>
    );
};
