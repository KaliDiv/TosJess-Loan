import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { trackWhatsAppClick } from '../lib/tracking';

interface FloatingWhatsAppProps {
  config?: {
    phoneNumber: string;
    message: string;
    floatingEnabled: boolean;
  };
}

export function FloatingWhatsApp({ config }: FloatingWhatsAppProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (config && !config.floatingEnabled) return null;

  const handleClick = () => {
    trackWhatsAppClick('floating_button', {
      phone: config?.phoneNumber,
      message: config?.message
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex items-center bg-white/80 backdrop-blur-2xl p-3 rounded-full border border-white/60"
      style={{ boxShadow: '0 12px 40px rgba(37, 211, 102, 0.25)' }}
    >
      <div className="relative flex items-center justify-center w-12 h-12 bg-[#25D366] rounded-full shrink-0 shadow-inner">
        <MessageCircle className="w-6 h-6 text-white" />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#25D366]"
        />
      </div>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ width: 0, opacity: 0, marginLeft: 0 }}
            animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
            exit={{ width: 0, opacity: 0, marginLeft: 0 }}
            className="overflow-hidden whitespace-nowrap pr-4"
          >
            <span className="text-navy font-display font-bold text-sm tracking-tight">
              Chat with Us
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
