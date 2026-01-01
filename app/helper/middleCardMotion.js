import { motion } from 'framer-motion';

const cardVariants = {
    offscreen: {
        y: 50,
        opacity: 0,
    },
    onscreen: {
        y: 0,
        opacity: 1,
        transition: {
            type: 'tween',
            duration: 0.8,
            delay: 0.8,
        },
    },
};

const MiddleCardMotion = ({ children }) => {
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

export default MiddleCardMotion;
