import React, { useState } from 'react';
import axios from 'axios';
import { Plus, CheckCircle, Clock, Loader2, X } from 'lucide-react';

const CreateTask = ({ onCreate }) => {
  const [namaTugas, setNamaTugas] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [kelas, setKelas] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/tasks', {
        nama_tugas: namaTugas,
        mata_kuliah: mataKuliah,
        kelas: kelas,
        description,
        status,
      });
      onCreate(response.data);
      setNamaTugas('');
      setMataKuliah('');
      setKelas('');
      setDescription('');
      setStatus('pending');
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-gray-500' },
    { value: 'in_progress', label: 'Progress', icon: Loader2, color: 'text-yellow-500' },
    { value: 'completed', label: 'Done', icon: CheckCircle, color: 'text-green-500' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
      >
        <Plus className="mr-1 h-4 w-4" />
        Create Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-4 relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Task</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-md mb-3 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="nama_tugas" className="block text-xs text-gray-700 mb-1">
                  Nama Tugas
                </label>
                <input
                  id="nama_tugas"
                  type="text"
                  value={namaTugas}
                  onChange={(e) => setNamaTugas(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter task name"
                />
                <p className="text-xs text-gray-500 mt-0.5 text-right">
                  {namaTugas.length}/100
                </p>
              </div>

              <div>
                <label htmlFor="mata_kuliah" className="block text-xs text-gray-700 mb-1">
                  Mata Kuliah
                </label>
                <input
                  id="mata_kuliah"
                  type="text"
                  value={mataKuliah}
                  onChange={(e) => setMataKuliah(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter subject name"
                />
                <p className="text-xs text-gray-500 mt-0.5 text-right">
                  {mataKuliah.length}/100
                </p>
              </div>

              <div>
                <label htmlFor="kelas" className="block text-xs text-gray-700 mb-1">
                  Kelas
                </label>
                <input
                  id="kelas"
                  type="text"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  required
                  maxLength={50}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter class"
                />
                <p className="text-xs text-gray-500 mt-0.5 text-right">
                  {kelas.length}/50
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-xs text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Enter task description"
                />
                <p className="text-xs text-gray-500 mt-0.5 text-right">
                  {description.length}/500
                </p>
              </div>

              <div>
                <label htmlFor="status" className="block text-xs text-gray-700 mb-1">
                  Status
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {statusOptions.map((opt) => (
                    <label 
                      key={opt.value} 
                      className={`
                        flex items-center justify-center p-1.5 rounded-md cursor-pointer text-xs
                        ${status === opt.value 
                          ? 'bg-indigo-100 border-2 border-indigo-500' 
                          : 'bg-gray-100 border-2 border-transparent'}
                        hover:bg-indigo-50 transition-colors
                      `}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        checked={status === opt.value}
                        onChange={() => setStatus(opt.value)}
                        className="hidden"
                      />
                      <opt.icon className={`mr-1 h-4 w-4 ${opt.color}`} />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;