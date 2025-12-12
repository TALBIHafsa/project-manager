import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => {
    const progressColor = project.progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-600';

    return (
        <div className="flex flex-col justify-between rounded-lg bg-white p-6 shadow hover:shadow-lg transition-shadow">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {project.title}
                    </h3>
                    {/* Delete Button (Trash Icon) */}
                    <button 
                        onClick={(e) => {
                            e.preventDefault(); // Prevent navigating when clicking delete
                            onDelete(project.id);
                        }}
                        className="text-gray-400 hover:text-red-500 font-bold"
                    >
                        ✕
                    </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description || "No description provided."}
                </p>
            </div>

            <div className="mt-4">
                {/* Progress Bar Info */}
                <div className="mb-1 flex justify-between text-xs font-medium text-gray-500">
                    <span>Progress</span>
                    <span>{Math.round(project.progressPercentage)}%</span>
                </div>
                
                {/* The Visual Bar */}
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                        className={`h-2 rounded-full ${progressColor}`}
                        style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                </div>

                <div className="mt-2 text-xs text-gray-400">
                    {project.completedTasks} / {project.totalTasks} tasks completed
                </div>

                <Link
                    to={`/projects/${project.id}`}
                    className="mt-4 block w-full rounded bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProjectCard;