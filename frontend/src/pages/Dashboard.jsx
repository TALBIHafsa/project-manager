import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [page, setPage] = useState(0); 
    const [totalPages, setTotalPages] = useState(0); 
    const pageSize = 6;

    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: '', description: '' });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/projects?search=${search}&page=${page}&limit=${pageSize}`);
            
            setProjects(response.data.content || []); 
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [search, page]);

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
            fetchProjects(); 
        } catch (error) {
            alert("Failed to delete project");
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(0); 
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            placeholder="Search projects..."
                            className="rounded border border-gray-300 px-4 py-2"
                            value={search}
                            onChange={handleSearchChange} 
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
                    <div className="mb-8 rounded-lg bg-white p-6 shadow">
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
                                <button type="button" onClick={() => setShowForm(false)} className="rounded bg-gray-200 px-4 py-2">Cancel</button>
                                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Save</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Projects Grid */}
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow">
                        <p className="text-gray-500">No projects found.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    onDelete={handleDelete} 
                                />
                            ))}
                        </div>

                        {/* --- PAGINATION CONTROLS --- */}
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className={`rounded px-4 py-2 font-bold ${page === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 shadow hover:bg-gray-50'}`}
                            >
                                Previous
                            </button>
                            
                            <span className="text-sm font-medium text-gray-600">
                                Page {page + 1} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page === totalPages - 1 || totalPages === 0}
                                className={`rounded px-4 py-2 font-bold ${page === totalPages - 1 || totalPages === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-blue-600 shadow hover:bg-gray-50'}`}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;