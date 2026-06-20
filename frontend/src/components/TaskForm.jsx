import React, { useState } from 'react';
import { taskAPI } from '../services/api';
import '../styles/components.css';

export function TaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('Le titre est obligatoire');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await taskAPI.createTask({
                title: title.trim(),
                description: description.trim(),
                status: 'todo',
            });
            onTaskCreated(response.data);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError('Erreur lors de la création de la tâche');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <h2>Ajouter une tâche</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Titre de la tâche"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            
            <div className="form-group">
                <textarea
                    placeholder="Description (optionnelle)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                />
            </div>
            
            <button type="submit" disabled={loading}>
                {loading ? 'Création...' : 'Ajouter'}
            </button>
        </form>
    );
}
