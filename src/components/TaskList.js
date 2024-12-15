import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CreateTask from './CreateTask';

const StatusCircle = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} mr-2`}></div>
      <span>{status}</span>
    </div>
  );
};

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks');
      setTasks(response.data); // Pastikan data yang diterima sesuai dengan format
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (updatedTask) => {
    axios.put(`http://127.0.0.1:8000/api/tasks/${updatedTask.id}`, updatedTask)
      .then((response) => {
        setTasks((prevTasks) => prevTasks.map(task => task.id === updatedTask.id ? response.data : task));
        setIsEditModalOpen(false);
        console.log('Task updated:', response.data);
      })
      .catch((error) => {
        console.error('Error updating task:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/tasks/${id}`)
      .then((response) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
      });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task List</h1>
          <CreateTask onCreate={handleCreateTask} />
        </div>
        
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tugas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mata Kuliah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.nama_tugas}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{task.mata_kuliah}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{task.kelas}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusCircle status={task.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleEdit(task)} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(task.id)} 
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No tasks found. Create a new task!
          </div>
        )}
      </div>

      {/* Modal Edit Task */}
      {isEditModalOpen && taskToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleEditSave(taskToEdit);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Task Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={taskToEdit.nama_tugas}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, nama_tugas: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={taskToEdit.mata_kuliah}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, mata_kuliah: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  type="text"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={taskToEdit.kelas}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, kelas: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                  value={taskToEdit.status}
                  onChange={(e) => setTaskToEdit({ ...taskToEdit, status: e.target.value })}
                >
                  <option value="completed">Completed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
