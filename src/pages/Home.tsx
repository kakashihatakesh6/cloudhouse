import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainChart from '../componenets/MainChart';
import DemoChartPage from '../componenets/DemoComponents/DemoChartPage';
import NewChartMain from '../componenets/NewComponents/NewChartMain';

const Home = () => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const chartOptions = [
    {
      id: 'main',
      title: 'Multi-Country Comparison',
      description: 'Compare COVID-19 metrics across multiple countries simultaneously',
      icon: '🌍',
      component: NewChartMain
    },
    {
      id: 'demo',
      title: 'Detailed Country Analysis',
      description: 'In-depth analysis of COVID-19 metrics for individual countries',
      icon: '📊',
      component: DemoChartPage
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AnimatePresence mode="wait">
        {!selectedChart ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
              COVID-19 Dashboard Visualizations
            </h1>
            <div className="grid md:grid-cols-2 gap-6">
              {chartOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => setSelectedChart(option.id)}
                >
                  <div className="p-6">
                    <div className="text-4xl mb-4">{option.icon}</div>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      {option.title}
                    </h2>
                    <p className="text-gray-600">
                      {option.description}
                    </p>
                  </div>
                  <div className="bg-blue-50 px-6 py-3">
                    <span className="text-blue-600 font-medium">Click to view →</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="max-w-7xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedChart(null)}
                className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                          rounded-lg flex items-center space-x-2 text-gray-700"
              >
                <span>←</span>
                <span>Back to Selection</span>
              </motion.button>
              
              {selectedChart === 'main' ? <NewChartMain /> : <DemoChartPage />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;