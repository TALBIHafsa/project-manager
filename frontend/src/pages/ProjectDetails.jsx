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
    
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

    
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
            // navigate('/dashboard'); // Optional: Redirect if not found
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${id}/tasks`, newTask);
            setNewTask({ title: '', description: '', dueDate: '' });
            setShowForm(false);
            fetchData(); 
        } catch (error) {
            // "Indicate" the error to the user
            const message = error.response?.data?.message || // specific backend error
                            error.response?.data?.dueDate || // validation field error
                            "Failed to create task";
            alert(message);
        }
    };

    const handleToggleTask = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        const isCurrentlyCompleted = task.isCompleted ?? task.completed ?? false; // <--- FIX HERE

        const newTasks = tasks.map(t => 
            t.id === taskId ? { ...t, completed: !isCurrentlyCompleted, isCompleted: !isCurrentlyCompleted } : t
        );
        setTasks(newTasks);

        try {
            if (!isCurrentlyCompleted) {
                // Was incomplete -> Mark Complete
                await api.patch(`/tasks/${taskId}/complete`);
            } else {
                // Was complete -> Mark Incomplete
                await api.patch(`/tasks/${taskId}/incomplete`);
            }
            
            fetchData(); 
        } catch (error) {
            console.error("Update failed", error);
            fetchData(); 
            alert("Failed to update task status");
        }
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
                {/* Back Button */}
                <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-700 mb-4 inline-block">
                    ← Back to Dashboard
                </Link>

                {/* Project Header */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
                            <p className="mt-2 text-gray-600">{project.description}</p>
                        </div>
                        <div className="text-right">
                             <span className="block text-2xl font-bold text-blue-600">
                                {Math.round(project.progressPercentage)}%
                             </span>
                             <span className="text-xs text-gray-500">Completed</span>
                        </div>
                    </div>

                    {/* Big Progress Bar */}
                    <div className="mt-6 h-4 w-full rounded-full bg-gray-100">
                        <div
                            className="h-4 rounded-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${project.progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Tasks Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Tasks ({tasks.length})</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
                    >
                        + Add Task
                    </button>
                </div>

                {/* Add Task Form */}
                {showForm && (
                    <div className="mb-6 rounded-lg bg-white p-6 shadow animate-fade-in-down">
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Task Title</label>
                                <input
                                    type="text"
                                    required  // <--- Mandatory
                                    className="mt-1 w-full rounded border p-2"
                                    value={newTask.title}
                                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <input
                                        type="text"
                                        required // <--- Mandatory
                                        placeholder="Enter task details" 
                                        className="mt-1 w-full rounded border p-2"
                                        value={newTask.description}
                                        onChange={e => setNewTask({...newTask, description: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        min={today}  // <--- VISUAL INDICATOR: Disables past dates in the calendar
                                        className="mt-1 w-full rounded border p-2"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <button type="submit" className="w-full rounded bg-blue-600 py-2 font-bold text-white hover:bg-blue-700">
                                Save Task
                            </button>
                        </form>
                    </div>
                )}

                {/* Task List */}
                <div className="space-y-3">
                    {tasks.length === 0 ? (
                        <p className="py-8 text-center text-gray-500">No tasks yet. Add one above!</p>
                    ) : (
                        tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggle={handleToggleTask}
                                onDelete={handleDeleteTask}
                            />
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;