import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../component/DashboardLayout';
import { useGetAllQuizAdmin, useDeleteQuiz } from '../api/generated/queries';
import * as Common from '../api/generated/queries/common';
import type { AdminQuizRequestDto } from '../api/generated/requests/types.gen';

function AdminQuizzes() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: quizzes, isLoading, isError, error } = useGetAllQuizAdmin();

    const [pendingDelete, setPendingDelete] = useState<AdminQuizRequestDto | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const deleteMutation = useDeleteQuiz(undefined, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: Common.UseGetAllQuizAdminKeyFn(),
            });
            setPendingDelete(null);
            setDeleteError(null);
        },
        onError: (err: unknown) => {
            setDeleteError(
                err instanceof Error ? err.message : 'Could not delete quiz.'
            );
        },
    });

    const isDeleting = deleteMutation.isPending;

    function closeDeleteModal() {
        if (isDeleting) return;
        setPendingDelete(null);
        setDeleteError(null);
    }

    function confirmDelete() {
        if (!pendingDelete?.id) return;
        setDeleteError(null);
        deleteMutation.mutate({ path: { quizId: pendingDelete.id } });
    }

    useEffect(() => {
        if (!pendingDelete) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape' && !isDeleting) {
                setPendingDelete(null);
                setDeleteError(null);
            }
        }
        document.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
        };
    }, [pendingDelete, isDeleting]);

    return (
        <DashboardLayout>
            <div className="row align-items-center mb-4 g-2">
                <div className="col-md-2 d-none d-md-block" />

                <div className="col-12 col-md-8 text-center">
                    <h1 className="fw-bold mb-1">Manage Quizzes</h1>
                    <p className="text-secondary mb-0">Create, edit and remove quizzes.</p>
                </div>

                <div className="col-12 col-md-2 d-flex justify-content-center justify-content-md-end">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate('/admin/quizzes/create')}
                    >
                        + Create Quiz
                    </button>
                </div>
            </div>

            {isLoading && (
                <div className="d-flex justify-content-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading…</span>
                    </div>
                </div>
            )}

            {isError && (
                <div className="alert alert-danger" role="alert">
                    Failed to load quizzes: {(error as Error)?.message ?? 'Unknown error'}
                </div>
            )}

            {!isLoading && !isError && (
                <div className="card shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Quiz</th>
                                    <th scope="col" className="d-none d-md-table-cell">Language</th>
                                    <th scope="col" className="text-center">Questions</th>
                                    <th scope="col" className="text-center">Attempts</th>
                                    <th scope="col" className="text-center">Status</th>
                                    <th scope="col" className="text-end">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {!quizzes || quizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-5">
                                            <p className="text-secondary mb-0">
                                                No quizzes yet. Click <strong>Create Quiz</strong> to add one.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    quizzes.map((quiz, index) => (
                                        <tr key={quiz.id ?? index}>
                                            <td>
                                                <p className="mb-0 fw-semibold">
                                                    {quiz.quizName ?? '—'}
                                                </p>
                                            </td>

                                            <td className="d-none d-md-table-cell">
                                                <span className="text-secondary small">
                                                    {quiz.language ?? '—'}
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                {quiz.numberOfQuestions ?? 0}
                                            </td>
                                            <td className="text-center">
                                                {quiz.numberOfAttempts ?? 0}
                                            </td>

                                            <td className="text-center">
                                                <span
                                                    className={
                                                        quiz.status === 'PUBLISHED'
                                                            ? 'badge text-bg-success'
                                                            : 'badge text-bg-secondary'
                                                    }
                                                >
                                                    {quiz.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                                                </span>
                                            </td>

                                            <td className="text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-secondary me-2"
                                                    disabled={!quiz.id}
                                                    onClick={() =>
                                                        quiz.id && navigate(`/admin/quizzes/${quiz.id}`)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    disabled={!quiz.id}
                                                    onClick={() => {
                                                        setDeleteError(null);
                                                        setPendingDelete(quiz);
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {pendingDelete &&
                createPortal(
                    <>
                        <div
                            className="modal fade show d-block"
                            tabIndex={-1}
                            role="dialog"
                            aria-modal="true"
                            onClick={closeDeleteModal}
                        >
                            <div
                                className="modal-dialog modal-dialog-centered"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Delete quiz</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            aria-label="Close"
                                            onClick={closeDeleteModal}
                                            disabled={isDeleting}
                                        />
                                    </div>

                                    <div className="modal-body">
                                        {deleteError && (
                                            <div className="alert alert-danger py-2" role="alert">
                                                {deleteError}
                                            </div>
                                        )}

                                        <p className="mb-2">
                                            You are about to permanently delete{' '}
                                            <strong>{pendingDelete.quizName ?? 'this quiz'}</strong>.
                                        </p>

                                        <ul className="mb-3">
                                            <li>
                                                <strong>Language:</strong>{' '}
                                                {pendingDelete.language ?? '—'}
                                            </li>
                                            <li>
                                                <strong>Questions:</strong>{' '}
                                                {pendingDelete.numberOfQuestions ?? 0}
                                            </li>
                                            <li>
                                                <strong>Attempts:</strong>{' '}
                                                {pendingDelete.numberOfAttempts ?? 0}
                                            </li>
                                            <li>
                                                <strong>Status:</strong>{' '}
                                                {pendingDelete.status ?? '—'}
                                            </li>
                                        </ul>

                                        <p className="text-danger mb-0">
                                            This will also remove all associated questions and
                                            attempts. This action cannot be undone.
                                        </p>
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={closeDeleteModal}
                                            disabled={isDeleting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={confirmDelete}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Deleting…' : 'Delete quiz'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-backdrop fade show" />
                    </>,
                    document.body
                )}
        </DashboardLayout>
    );
}

export default AdminQuizzes;