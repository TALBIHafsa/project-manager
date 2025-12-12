import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });

    const fetchProjects = async () => {
        try {
            const response = await api.get(`/projects?search=${search}&limit=100`); 
            setProjects(response.data.content || []); 
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [search]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', newProject);
            setNewProject({ title: '', description: '' });
            setShowForm(false);
            fetchProjects();
        } catch (error) {
            alert("Failed to create project");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects(); // Refresh list
        } catch (error) {
            alert("Failed to delete project");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section: Title + Search + Create Button */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            placeholder="Search projects..."
                            className="rounded border border-gray-300 px-4 py-2"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                            + New Project
                        </button>
                    </div>
                </div>

                {/* Inline Create Form */}
                {showForm && (
                    <div className="mb-8 rounded-lg bg-white p-6 shadow animate-fade-in-down">
                        <h2 className="mb-4 text-lg font-bold">Create New Project</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows="3"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">No projects found. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;