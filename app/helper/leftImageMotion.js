import { motion } from 'framer-motion';

const cardVariants
= {
    offscreen: {
        x: -50,
        opacity: 0,
    },
    onscreen: {
        x: 0,
        opacity: 1,
        transition: {
            type: 'tween',
            bounce: 0.4,
            duration: 0.8,
        },
    },
};

const LeftImageMotion = ({ children }) => {
    return (
        <motion.div
            initial='offscreen'
            whileInView='onscreen'
            viewport={{ once: true }}
            variants={cardVariants}
        >
            {children}
        </motion.div>
    );
};

export default LeftImageMotion;
