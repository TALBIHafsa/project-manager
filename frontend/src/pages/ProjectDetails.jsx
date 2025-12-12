import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';

const ProjectDetails = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
    const [search, setSearch] = useState(''); 
    const [editingTaskId, setEditingTaskId] = useState(null)
    const fetchData = async () => {
        try {
            const [projectRes, tasksRes] = await Promise.all([
                api.get(`/projects/${id}`),
                api.get(`/projects/${id}/tasks`)
            ]);
            setProject(projectRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleSaveTask = async (e) => {
        e.preventDefault();
        try {
            if (editingTaskId) {
                // UPDATE MODE (PUT)
                await api.put(`/tasks/${editingTaskId}`, newTask);
            } else {
                // CREATE MODE (POST)
                await api.post(`/projects/${id}/tasks`, newTask);
            }
            
            setNewTask({ title: '', description: '', dueDate: '' });
            setShowForm(false);
            setEditingTaskId(null); 
            
            fetchData(); 
            
        } catch (error) {
            const message = error.response?.data?.message || 
                            error.response?.data?.dueDate || 
                            "Failed to save task";
            alert(message);
        }
    };
    const handleEditClick = (task) => {
        setEditingTaskId(task.id);
        setNewTask({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate || ''
        });
        setShowForm(true); 
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTaskId(null);
        setNewTask({ title: '', description: '', dueDate: '' });
    };

    const handleToggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        const isCurrentlyCompleted = task.isCompleted ?? task.completed ?? false;

        const newTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: !isCurrentlyCompleted, isCompleted: !isCurrentlyCompleted } : t
        );
        setTasks(newTasks);

        try {
            if (!isCurrentlyCompleted) await api.patch(`/tasks/${taskId}/complete`);
            else await api.patch(`/tasks/${taskId}/incomplete`);
            fetchData();
         } catch (e) { fetchData(); }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete task");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Project...</div>;
    if (!project) return <div className="p-10 text-center">Project not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-4xl px-4 py-8">
                <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 inline-block">← Back to Dashboard</Link>

                {/* Project Header  */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow">
                     <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                     <div className="mt-6 h-4 w-full rounded-full bg-gray-100">
                        <div className="h-4 rounded-full bg-blue-600 transition-all duration-500" style={{ width: `${project.progressPercentage}%` }}></div>
                     </div>
                </div>

                {/* Controls */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                     <div className="relative flex-1 max-w-md">
                        <input 
                            type="text" 
                            placeholder="Search tasks..." 
                            className="w-full rounded border border-gray-300 py-2 px-4"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                     </div>
                     <button
                        onClick={() => {
                            if (showForm) handleCloseForm();
                            else setShowForm(true);
                        }}
                        className={`rounded px-4 py-2 text-sm font-bold text-white ${showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {showForm ? 'Close Form' : '+ Add Task'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="mb-6 rounded-lg bg-white p-6 shadow border-l-4 border-blue-500">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">
                            {editingTaskId ? 'Edit Task' : 'Create New Task'}
                        </h3>
                        <form onSubmit={handleSaveTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text" required
                                    className="mt-1 w-full rounded border p-2"
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text" required
                                        className="mt-1 w-full rounded border p-2"
                                        value={newTask.description}
                                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input
                                        type="date" required
                                        min={today}
                                        className="mt-1 w-full rounded border p-2"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={handleCloseForm} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                                    {editingTaskId ? 'Update Task' : 'Save Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="mb-4 flex space-x-2 border-b border-gray-200 pb-2">
                    {['all', 'pending', 'completed'].map(t => (
                        <button key={t} onClick={() => setFilter(t)} className={`capitalize px-4 py-2 ${filter===t ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>{t}</button>
                    ))}
                </div>

                {/* Task List */}
                <div className="space-y-3">
                    {tasks.length === 0 ? <p className="text-center py-8 text-gray-500">No tasks yet.</p> : 
                        tasks.filter(task => {
                            const isFinished = task.isCompleted ?? task.completed ?? false;
                            const matchesStatus = filter === 'all' ? true : filter === 'completed' ? isFinished : !isFinished;
                            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
                            return matchesStatus && matchesSearch;
                        }).map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                                onEdit={handleEditClick} 
                            />
                        ))
                    }
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;