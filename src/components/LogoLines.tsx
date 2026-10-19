import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface LogoLinesProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  animateDraw?: boolean;
  motionProps?: MotionProps;
}

export const LogoLines: React.FC<LogoLinesProps> = ({
  className = '',
  strokeColor = 'currentColor',
  strokeWidth = 2.5,
  animateDraw = false,
  motionProps,
  ...rest
}) => {
  // Line paths forming the architectural open-box / isometric M
  // Peak: (50, 18), left roof edge: (20, 38), right roof edge: (80, 38)
  // Left pillar: (20, 38) to (20, 82)
  // Right pillar: (80, 38) to (80, 82)
  // Center line: (50, 18) down to (50, 54)
  // Inner V wings: (20, 82) to (50, 54) to (80, 82)
  
  if (animateDraw) {
    const drawVariant = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const },
          opacity: { duration: 0.2 },
        },
      },
    };

    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden="true"
        {...rest}
      >
        {/* Outer roof & pillars */}
        <motion.path
          d="M 20 82 L 20 38 L 50 18 L 80 38 L 80 82"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariant}
          initial="hidden"
          animate="visible"
          {...motionProps}
        />
        {/* Center vertical backbone */}
        <motion.path
          d="M 50 18 L 50 54"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          variants={drawVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3, duration: 0.8 }}
        />
        {/* Inner V bottom fold */}
        <motion.path
          d="M 20 82 L 50 54 L 80 82"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawVariant}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, duration: 0.8 }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path
        d="M 20 82 L 20 38 L 50 18 L 80 38 L 80 82"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 50 18 L 50 54"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M 20 82 L 50 54 L 80 82"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
