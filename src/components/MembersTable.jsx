import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://node-js-tp3.vercel.app/api/v1/members';

function MembersTable() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [form, setForm] = useState({ name: '', email: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setMembers(res.data.result);
            setErrorMsg('');
        } catch (err) {
            setErrorMsg('Erreur lors du chargement des membres');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, form);
            } else {
                await axios.post(API_URL, form);
            }
            setForm({ name: '', email: '' });
            setEditingId(null);
            fetchMembers();
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Erreur lors de la sauvegarde');
        }
    };

    const handleEdit = (member) => {
        setForm({ name: member.name, email: member.email });
        setEditingId(member.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Supprimer ce membre ?')) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchMembers();
        } catch (err) {
            setErrorMsg('Erreur lors de la suppression');
        }
    };

    const handleCancel = () => {
        setForm({ name: '', email: '' });
        setEditingId(null);
    };

    if (loading) return <p className="loading">Chargement...</p>;

    return (
        <div className="members-container">
            <h1>Gestion des Membres</h1>

            {errorMsg && <p className="error-msg">{errorMsg}</p>}

            <form className="member-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                />
                <button type="submit" className="btn-save">
                    {editingId ? 'Modifier' : 'Ajouter'}
                </button>
                {editingId && (
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        Annuler
                    </button>
                )}
            </form>

            <table className="members-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Aucun membre</td>
                        </tr>
                    ) : (
                        members.map((member) => (
                            <tr key={member.id}>
                                <td>{member.id}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => handleEdit(member)}>
                                        Modifier
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(member.id)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default MembersTable;
