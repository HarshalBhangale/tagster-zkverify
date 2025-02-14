import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaFileAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useZkVerify } from '../hooks/useZkVerify';

interface VerificationResult {
  statementHash: string;
  status: string;
}

interface Dataset {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadDate: string;
  completionDate?: string;
  tags: string[];
  reward: string;
  deadline: string;
  verificationHash?: string;
}

const DatasetUploadScreen = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'image',
    size: '',
    tags: '',
    reward: '',
    deadline: '',
    file: null as File | null,
  });

  const { verifyProof, isVerifying, verificationError, verificationSuccess } = useZkVerify();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const targetAddress = '0x71F1101Bf020353Be958A85432DDC1c0DDCBFc58';
    
    toast.info('Initiating dataset verification...', {
      position: "top-right",
      autoClose: 2000,
    });

    const newDataset: Dataset = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      description: formData.description,
      category: formData.category,
      size: formData.size,
      status: 'pending',
      uploadDate: new Date().toISOString(),
      tags: formData.tags.split(',').map(tag => tag.trim()),
      reward: formData.reward,
      deadline: formData.deadline,
    };

    setDatasets(prev => [newDataset, ...prev]);
    setIsFormOpen(false);

    try {
      // Simulate proof generation (in real app, this would be actual proof generation)
      const mockProof = {
        proof: {
          pi_a: ["123", "456", "789"],
          pi_b: [["123", "456"], ["789", "012"]],
          pi_c: ["123", "456"],
          protocol: "groth16",
          curve: "bn128"
        },
        correctLabel: 1
      };

      // Update status to processing
      setDatasets(prev => 
        prev.map(d => d.id === newDataset.id ? { ...d, status: 'processing' } : d)
      );
      toast.info('Processing dataset verification...', { autoClose: 2000 });

      // Verify the proof
      const result = await verifyProof(mockProof, 1) as VerificationResult;

      // Update dataset with verification result
      setDatasets(prev => 
        prev.map(d => d.id === newDataset.id ? {
          ...d,
          status: verificationSuccess ? 'completed' : 'failed',
          completionDate: new Date().toISOString(),
          verificationHash: result?.statementHash
        } : d)
      );

      if (verificationSuccess) {
        toast.success('Dataset verification completed successfully!', { autoClose: 3000 });
      } else if (verificationError) {
        toast.error(`Verification failed: ${verificationError}`, { autoClose: 4000 });
      }

    } catch (error) {
      setDatasets(prev => 
        prev.map(d => d.id === newDataset.id ? { ...d, status: 'failed' } : d)
      );
      toast.error('Dataset verification failed. Please try again.', { autoClose: 3000 });
    }

    // Reset form
    setFormData({
      name: '',
      description: '',
      category: 'image',
      size: '',
      tags: '',
      reward: '',
      deadline: '',
      file: null,
    });
  };

  const getStatusColor = (status: Dataset['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'processing': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: Dataset['status']) => {
    switch (status) {
      case 'pending': return <FaFileAlt className="animate-pulse" />;
      case 'processing': return <FaSpinner className="animate-spin" />;
      case 'completed': return <FaCheckCircle />;
      case 'failed': return <FaTimesCircle />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b1e] to-[#2d2e32] text-white p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Dataset Management Portal
        </h1>
        <p className="text-gray-400 mb-8">
          Upload and verify your datasets using zero-knowledge proofs
        </p>

        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 rounded-xl flex items-center space-x-2 mb-12 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
        >
          <FaCloudUploadAlt className="text-xl" />
          <span>Upload New Dataset</span>
        </motion.button>

        {/* Datasets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map(dataset => (
            <motion.div
              key={dataset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2c2d30] rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-700/50"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{dataset.name}</h3>
                <span className={`${getStatusColor(dataset.status)} flex items-center space-x-2`}>
                  {getStatusIcon(dataset.status)}
                  <span className="text-sm capitalize">{dataset.status}</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{dataset.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-gray-200">{dataset.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-gray-200">{dataset.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Upload Date:</span>
                  <span className="text-gray-200">
                    {new Date(dataset.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reward:</span>
                  <span className="text-gray-200">{dataset.reward}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {dataset.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-700/30 rounded-full text-xs text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Add verification hash if available */}
              {dataset.verificationHash && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400">Verification Hash:</p>
                  <p className="text-xs text-gray-300 break-all">{dataset.verificationHash}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#2c2d30] rounded-2xl p-8 w-full max-w-md border border-gray-700/50"
            >
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Upload Dataset
              </h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Dataset Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="text">Text</option>
                    <option value="audio">Audio</option>
                    <option value="video">Video</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Dataset Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={e => setFormData(prev => ({ ...prev, size: e.target.value }))}
                    placeholder="e.g., 2.5GB"
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="e.g., medical, research, classification"
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Reward Amount (ETH)</label>
                  <input
                    type="text"
                    value={formData.reward}
                    onChange={e => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                    placeholder="e.g., 0.5 ETH"
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={e => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Dataset File</label>
                  <input
                    type="file"
                    onChange={e => setFormData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                    className="w-full bg-[#1a1b1e] border border-gray-700 rounded-xl px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex space-x-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 py-3 rounded-xl font-medium"
                  >
                    Upload Dataset
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 bg-gray-700 py-3 rounded-xl font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DatasetUploadScreen; 