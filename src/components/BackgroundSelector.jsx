import { useState } from 'react';
import { Sparkles, Grid3x3, Boxes, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Background variant selector - allows users to choose their preferred 3D background
 * Can be placed in a settings panel or navbar
 */
const BackgroundSelector = ({ onVariantChange, currentVariant = 'neural' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const variants = [
    {
      id: 'neural',
      name: 'Neural Network',
      icon: Sparkles,
      description: 'Animated neural network with data flow'
    },
    {
      id: 'dataflow',
      name: 'Data Flow',
      icon: Layers,
      description: 'Flowing particles with animated grid'
    },
    {
      id: 'grid',
      name: 'Grid Only',
      icon: Grid3x3,
      description: 'Minimalist animated grid'
    },
    {
      id: 'full',
      name: 'Full Effect',
      icon: Boxes,
      description: 'All effects combined (intensive)'
    }
  ];

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all"
        aria-label="Change background style"
      >
        <Sparkles size={20} className="text-cyan-400" />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 p-4 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl z-50"
            >
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Background Style
              </h3>

              <div className="space-y-2">
                {variants.map((variant) => {
                  const Icon = variant.icon;
                  const isActive = currentVariant === variant.id;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        onVariantChange(variant.id);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all
                        ${isActive
                          ? 'bg-cyan-500/20 border border-cyan-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          size={18}
                          className={isActive ? 'text-cyan-400' : 'text-gray-400'}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isActive ? 'text-cyan-400' : 'text-gray-900 dark:text-white'}`}>
                              {variant.name}
                            </span>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {variant.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Performance Note */}
              <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  <span className="font-semibold">Tip:</span> Choose 'Grid Only' for better performance on slower devices.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSelector;
