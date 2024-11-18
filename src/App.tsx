import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat, X, Heart } from 'lucide-react';

function App() {
  const [currentCat, setCurrentCat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  const fetchNewCat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search');
      const [data] = await response.json();
      setCurrentCat(data.url);
    } catch (error) {
      console.error('Error fetching cat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewCat();
  }, []);

  const handleSwipe = async (liked: boolean) => {
    setDirection(liked ? 'right' : 'left');
    // Wait for animation to complete
    setTimeout(() => {
      setDirection(null);
      fetchNewCat();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <Cat className="w-8 h-8 text-amber-600 mr-2" />
          <h1 className="text-3xl font-bold text-amber-900">MeowMatch</h1>
        </div>

        {/* Card Container */}
        <div className="relative aspect-[3/4] w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <AnimatePresence>
            {!isLoading && currentCat && (
              <motion.div
                key={currentCat}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{
                  x: direction === 'left' ? -200 : direction === 'right' ? 200 : 0,
                  opacity: 0,
                  transition: { duration: 0.3 }
                }}
                className="absolute inset-0"
              >
                <img
                  src={currentCat}
                  alt="Cat"
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-50">
              <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => handleSwipe(false)}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors duration-200"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          <button
            onClick={() => handleSwipe(true)}
            className="p-4 bg-white rounded-full shadow-lg hover:bg-green-50 transition-colors duration-200"
          >
            <Heart className="w-8 h-8 text-green-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;