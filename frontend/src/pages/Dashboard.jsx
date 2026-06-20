import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import '../styles/dashboard.css';

export function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const response = await taskAPI.getTasks();
            setTasks(response.data);
            setError('');
        } catch (err) {
            setError('Erreur lors du chargement des tâches');
        } finally {
            setLoading(false);
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks([newTask, ...tasks]);
    };

    const handleTaskUpdated = (updatedTask) => {
        setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    };

    const handleTaskDeleted = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="dashboard"><p>Chargement...</p></div>;
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gestion des Tâches</h1>
                <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
            </header>

            {error && <div className="error-message">{error}</div>}

            <main className="dashboard-content">
                <TaskForm onTaskCreated={handleTaskCreated} />
                <TaskList 
                    tasks={tasks}
                    onTaskUpdated={handleTaskUpdated}
                    onTaskDeleted={handleTaskDeleted}
                />
            </main>
        </div>
    );
}
