import React, { useState } from 'react';
import { TaskItem } from './TaskItem';
import '../styles/components.css';

export function TaskList({ tasks, onTaskUpdated, onTaskDeleted }) {
    const [filter, setFilter] = useState('all');

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    const statuses = [
        { value: 'all', label: 'Toutes' },
        { value: 'todo', label: 'À faire' },
        { value: 'in_progress', label: 'En cours' },
        { value: 'done', label: 'Fait' },
    ];

    return (
        <div className="task-list-container">
            <div className="filters">
                {statuses.map(status => (
                    <button
                        key={status.value}
                        className={`filter-btn ${filter === status.value ? 'active' : ''}`}
                        onClick={() => setFilter(status.value)}
                    >
                        {status.label}
                    </button>
                ))}
            </div>

            <div className="task-list">
                {filteredTasks.length === 0 ? (
                    <p className="no-tasks">Aucune tâche à afficher</p>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onTaskUpdated={onTaskUpdated}
                            onTaskDeleted={onTaskDeleted}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
