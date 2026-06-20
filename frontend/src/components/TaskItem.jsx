import React, { useState } from 'react';
import { taskAPI } from '../services/api';
import '../styles/components.css';

export function TaskItem({ task, onTaskUpdated, onTaskDeleted }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description);
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        try {
            const response = await taskAPI.updateTask(task.id, { status: newStatus });
            onTaskUpdated(response.data);
        } catch (err) {
            console.error('Erreur lors de la mise à jour du statut');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editedTitle.trim()) return;

        setLoading(true);
        try {
            const response = await taskAPI.updateTask(task.id, {
                title: editedTitle.trim(),
                description: editedDescription.trim(),
            });
            onTaskUpdated(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Erreur lors de la mise à jour de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

        setLoading(true);
        try {
            await taskAPI.deleteTask(task.id);
            onTaskDeleted(task.id);
        } catch (err) {
            console.error('Erreur lors de la suppression de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const statusLabels = {
        todo: 'À faire',
        in_progress: 'En cours',
        done: 'Fait',
    };

    return (
        <div className={`task-item status-${task.status}`}>
            {isEditing ? (
                <div className="task-edit">
                    <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="edit-input"
                    />
                    <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="edit-textarea"
                    />
                    <div className="edit-actions">
                        <button onClick={handleSaveEdit} disabled={loading}>Sauvegarder</button>
                        <button onClick={() => setIsEditing(false)}>Annuler</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="task-content">
                        <h3>{task.title}</h3>
                        {task.description && <p>{task.description}</p>}
                        <div className="task-meta">
                            <small>
                                Créée le {new Date(task.created_at).toLocaleDateString('fr-FR')}
                            </small>
                        </div>
                    </div>

                    <div className="task-actions">
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={loading}
                            className="status-select"
                        >
                            <option value="todo">À faire</option>
                            <option value="in_progress">En cours</option>
                            <option value="done">Fait</option>
                        </select>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="edit-btn"
                            disabled={loading}
                        >
                            Éditer
                        </button>

                        <button
                            onClick={handleDelete}
                            className="delete-btn"
                            disabled={loading}
                        >
                            Supprimer
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
