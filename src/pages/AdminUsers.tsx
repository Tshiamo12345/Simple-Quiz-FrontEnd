// src/pages/AdminUsers.tsx
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import DashboardLayout from '../component/DashboardLayout';

type Role = 'admin' | 'editor' | 'user';
type Status = 'active' | 'invited' | 'suspended';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    createdAt: string;
}

const PAGE_SIZE = 8;

const ROLE_BADGE: Record<Role, string> = {
    admin: 'text-bg-danger',
    editor: 'text-bg-primary',
    user: 'text-bg-secondary',
};

const STATUS_BADGE: Record<Status, string> = {
    active: 'text-bg-success',
    invited: 'text-bg-warning',
    suspended: 'text-bg-dark',
};

/* ------------------------------------------------------------------ */
/* Demo data layer — replace with real API calls when the backend     */
/* is ready. Every function here simulates network latency.           */
/* ------------------------------------------------------------------ */

const DEMO_USERS: User[] = [
    { id: 'u_01', name: 'Amara Okafor',     email: 'amara.okafor@example.com',   role: 'admin',  status: 'active',    createdAt: '2024-01-12T09:24:00Z' },
    { id: 'u_02', name: 'Liam Novak',       email: 'liam.novak@example.com',     role: 'editor', status: 'active',    createdAt: '2024-02-03T14:10:00Z' },
    { id: 'u_03', name: 'Sofia Marchetti',  email: 'sofia.m@example.com',        role: 'user',   status: 'invited',   createdAt: '2024-02-18T11:45:00Z' },
    { id: 'u_04', name: 'Kenji Tanaka',     email: 'kenji.tanaka@example.com',   role: 'editor', status: 'active',    createdAt: '2024-03-01T08:02:00Z' },
    { id: 'u_05', name: 'Priya Raghavan',   email: 'priya.r@example.com',        role: 'user',   status: 'suspended', createdAt: '2024-03-09T17:30:00Z' },
    { id: 'u_06', name: 'Noah Bergström',   email: 'noah.b@example.com',         role: 'user',   status: 'active',    createdAt: '2024-03-22T13:15:00Z' },
    { id: 'u_07', name: 'Fatima Al-Sayed',  email: 'fatima.alsayed@example.com', role: 'admin',  status: 'active',    createdAt: '2024-04-04T10:00:00Z' },
    { id: 'u_08', name: 'Diego Ramírez',    email: 'diego.r@example.com',        role: 'user',   status: 'invited',   createdAt: '2024-04-19T15:55:00Z' },
    { id: 'u_09', name: 'Elena Petrova',    email: 'elena.p@example.com',        role: 'editor', status: 'active',    createdAt: '2024-05-02T07:40:00Z' },
    { id: 'u_10', name: 'Marcus Chen',      email: 'marcus.chen@example.com',    role: 'user',   status: 'active',    createdAt: '2024-05-17T19:20:00Z' },
    { id: 'u_11', name: 'Zara Hussain',     email: 'zara.h@example.com',         role: 'user',   status: 'suspended', createdAt: '2024-06-01T12:05:00Z' },
    { id: 'u_12', name: 'Oliver Brandt',    email: 'oliver.b@example.com',       role: 'editor', status: 'active',    createdAt: '2024-06-14T16:45:00Z' },
    { id: 'u_13', name: 'Ingrid Larsen',    email: 'ingrid.l@example.com',       role: 'user',   status: 'invited',   createdAt: '2024-06-28T09:10:00Z' },
    { id: 'u_14', name: 'Rafael Souza',     email: 'rafael.souza@example.com',   role: 'user',   status: 'active',    createdAt: '2024-07-05T14:35:00Z' },
    { id: 'u_15', name: 'Hana Kobayashi',   email: 'hana.k@example.com',         role: 'admin',  status: 'active',    createdAt: '2024-07-21T11:00:00Z' },
    { id: 'u_16', name: 'Samuel Adeyemi',   email: 'samuel.a@example.com',       role: 'user',   status: 'active',    createdAt: '2024-08-02T08:25:00Z' },
    { id: 'u_17', name: 'Chloé Dubois',     email: 'chloe.dubois@example.com',   role: 'editor', status: 'invited',   createdAt: '2024-08-16T13:50:00Z' },
    { id: 'u_18', name: 'Viktor Ivanov',    email: 'viktor.i@example.com',       role: 'user',   status: 'suspended', createdAt: '2024-08-29T18:15:00Z' },
    { id: 'u_19', name: 'Maya Rosenberg',   email: 'maya.r@example.com',         role: 'user',   status: 'active',    createdAt: '2024-09-07T10:30:00Z' },
    { id: 'u_20', name: 'Thomas Wright',    email: 'thomas.w@example.com',       role: 'user',   status: 'active',    createdAt: '2024-09-19T16:00:00Z' },
];

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// In-memory store — mutated by the demo CRUD helpers below.
let demoStore: User[] = [...DEMO_USERS];

const demoApi = {
    async list(): Promise<User[]> {
        await delay(450);
        return [...demoStore];
    },

    async create(input: Omit<User, 'id' | 'createdAt'>): Promise<User> {
        await delay(500);
        if (demoStore.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
            throw new Error('A user with that email already exists.');
        }
        const user: User = {
            ...input,
            id: `u_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
        };
        demoStore = [user, ...demoStore];
        return user;
    },

    async update(id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
        await delay(450);
        const index = demoStore.findIndex((u) => u.id === id);
        if (index === -1) throw new Error('User no longer exists.');
        if (
            patch.email &&
            demoStore.some((u) => u.id !== id && u.email.toLowerCase() === patch.email!.toLowerCase())
        ) {
            throw new Error('A user with that email already exists.');
        }
        const updated: User = { ...demoStore[index], ...patch };
        demoStore = demoStore.map((u) => (u.id === id ? updated : u));
        return updated;
    },

    async remove(id: string): Promise<void> {
        await delay(400);
        if (!demoStore.some((u) => u.id === id)) {
            throw new Error('User no longer exists.');
        }
        demoStore = demoStore.filter((u) => u.id !== id);
    },
};

/* ------------------------------------------------------------------ */
/* Modal shell — renders into document.body so fixed positioning is   */
/* relative to the viewport, not to any transformed ancestor.         */
/* ------------------------------------------------------------------ */

interface ModalShellProps {
    children: ReactNode;
    onClose: () => void;
    /** Disable ESC / backdrop close while an action is in flight. */
    busy?: boolean;
}

function ModalShell({ children, onClose, busy = false }: ModalShellProps) {
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape' && !busy) onClose();
        }
        document.addEventListener('keydown', onKey);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [onClose, busy]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <>
            <div
                className="modal fade show d-block"
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                onClick={(e) => {
                    if (e.target === e.currentTarget && !busy) onClose();
                }}
            >
                <div className="modal-dialog modal-dialog-centered">{children}</div>
            </div>
            <div className="modal-backdrop fade show" />
        </>,
        document.body
    );
}

/* ------------------------------------------------------------------ */

function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
    const [page, setPage] = useState(1);

    const [editing, setEditing] = useState<User | null>(null);
    const [creating, setCreating] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);

    async function loadUsers() {
        setLoading(true);
        setError(null);
        try {
            const data = await demoApi.list();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load users.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    // Reset to page 1 whenever the filters change.
    useEffect(() => {
        setPage(1);
    }, [search, roleFilter, statusFilter]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return users.filter((u) => {
            const matchesQuery =
                !q ||
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q);
            const matchesRole = roleFilter === 'all' || u.role === roleFilter;
            const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
            return matchesQuery && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleSaved(saved: User, isNew: boolean) {
        setUsers((prev) =>
            isNew ? [saved, ...prev] : prev.map((u) => (u.id === saved.id ? saved : u))
        );
        setCreating(false);
        setEditing(null);
    }

    async function handleDelete() {
        if (!pendingDelete) return;
        setDeleting(true);
        try {
            await demoApi.remove(pendingDelete.id);
            setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
            setPendingDelete(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not delete user.');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                <div>
                    <h1 className="admin-title mb-1">Manage Users</h1>
                    <p className="admin-subtitle mb-0">
                        {filtered.length} of {users.length} user{users.length === 1 ? '' : 's'}
                    </p>
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCreating(true)}
                >
                    + Add user
                </button>
            </div>

            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Dismiss"
                        onClick={() => setError(null)}
                    />
                </div>
            )}

            <div className="card shadow-sm mb-3">
                <div className="card-body">
                    <div className="row g-2">
                        <div className="col-12 col-md-6">
                            <input
                                type="search"
                                className="form-control"
                                placeholder="Search by name or email…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-6 col-md-3">
                            <select
                                className="form-select"
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value as 'all' | Role)}
                                aria-label="Filter by role"
                            >
                                <option value="all">All roles</option>
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                                <option value="user">User</option>
                            </select>
                        </div>
                        <div className="col-6 col-md-3">
                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as 'all' | Status)}
                                aria-label="Filter by status"
                            >
                                <option value="all">All statuses</option>
                                <option value="active">Active</option>
                                <option value="invited">Invited</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Role</th>
                                <th scope="col">Status</th>
                                <th scope="col">Joined</th>
                                <th scope="col" className="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-5">
                                        <div className="spinner-border spinner-border-sm me-2" role="status" />
                                        Loading users…
                                    </td>
                                </tr>
                            )}

                            {!loading && pageItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center text-muted py-5">
                                        No users match your filters.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                pageItems.map((u) => (
                                    <tr key={u.id}>
                                        <td className="fw-semibold">{u.name}</td>
                                        <td className="text-muted">{u.email}</td>
                                        <td>
                                            <span className={`badge ${ROLE_BADGE[u.role]}`}>{u.role}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${STATUS_BADGE[u.status]}`}>{u.status}</span>
                                        </td>
                                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-secondary me-2"
                                                onClick={() => setEditing(u)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setPendingDelete(u)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                            Page {page} of {totalPages}
                        </span>
                        <div className="btn-group">
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {(creating || editing) && (
                <UserFormModal
                    user={editing}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                    onSaved={handleSaved}
                />
            )}

            {pendingDelete && (
                <ModalShell onClose={() => setPendingDelete(null)} busy={deleting}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete user</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setPendingDelete(null)}
                            />
                        </div>
                        <div className="modal-body">
                            Delete <strong>{pendingDelete.name}</strong> ({pendingDelete.email})? This
                            can&apos;t be undone.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setPendingDelete(null)}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </ModalShell>
            )}
        </DashboardLayout>
    );
}

/* ------------------------------------------------------------------ */

interface UserFormModalProps {
    user: User | null;
    onClose: () => void;
    onSaved: (user: User, isNew: boolean) => void;
}

function UserFormModal({ user, onClose, onSaved }: UserFormModalProps) {
    const isNew = user === null;

    const [name, setName] = useState(user?.name ?? '');
    const [email, setEmail] = useState(user?.email ?? '');
    const [role, setRole] = useState<Role>(user?.role ?? 'user');
    const [status, setStatus] = useState<Status>(user?.status ?? 'active');
    const [password, setPassword] = useState('');

    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setFormError(null);

        try {
            const saved = isNew
                ? await demoApi.create({ name, email, role, status })
                : await demoApi.update(user!.id, { name, email, role, status });

            onSaved(saved, isNew);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Could not save user.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <ModalShell onClose={onClose} busy={saving}>
            <form className="modal-content" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h5 className="modal-title">{isNew ? 'Add user' : 'Edit user'}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                </div>

                <div className="modal-body">
                    {formError && <div className="alert alert-danger py-2">{formError}</div>}

                    <div className="mb-3">
                        <label className="form-label" htmlFor="user-name">Name</label>
                        <input
                            id="user-name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label" htmlFor="user-email">Email</label>
                        <input
                            id="user-email"
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {isNew && (
                        <div className="mb-3">
                            <label className="form-label" htmlFor="user-password">
                                Temporary password
                            </label>
                            <input
                                id="user-password"
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            <div className="form-text">
                                Demo only — not stored anywhere.
                            </div>
                        </div>
                    )}

                    <div className="row g-3">
                        <div className="col-6">
                            <label className="form-label" htmlFor="user-role">Role</label>
                            <select
                                id="user-role"
                                className="form-select"
                                value={role}
                                onChange={(e) => setRole(e.target.value as Role)}
                            >
                                <option value="user">User</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="col-6">
                            <label className="form-label" htmlFor="user-status">Status</label>
                            <select
                                id="user-status"
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Status)}
                            >
                                <option value="active">Active</option>
                                <option value="invited">Invited</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : isNew ? 'Create user' : 'Save changes'}
                    </button>
                </div>
            </form>
        </ModalShell>
    );
}

export default AdminUsers;