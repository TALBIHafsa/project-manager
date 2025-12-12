import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
    const isTaskCompleted = task?.isCompleted ?? task?.completed ?? false;
    const isOverdue = task?.dueDate && new Date(task.dueDate) < new Date() && !isTaskCompleted;

    return (
        <div className={`flex items-center justify-between rounded-lg border p-4 shadow-sm transition-all ${isTaskCompleted ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    checked={isTaskCompleted}
                    onChange={() => onToggle(task?.id)}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <div>
                    <h4 className={`font-medium ${isTaskCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task?.title}
                    </h4>

                    <p className="text-sm text-gray-500">
                        {task?.description}
                    </p>

                    {task?.dueDate && (
                        <span className={`mt-1 inline-block text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-gray-400'}`}>
                            📅 {new Date(task.dueDate).toLocaleDateString()} {isOverdue && "(Overdue)"}
                        </span>
                    )}
                </div>
            </div>

            <button
                onClick={() => onDelete(task?.id)}
                className="ml-4 rounded px-2 py-1 text-sm text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
                ✕
            </button>
        </div>
    );
};

export default TaskItem;