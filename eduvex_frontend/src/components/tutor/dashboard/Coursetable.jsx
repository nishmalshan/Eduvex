// components/tutor/CourseTable.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTutorCourses,
  deleteCourse,
  publishCourse,
  setFilter,
  setPage,
  clearError,
  clearSuccess,
  selectFilteredCourses,
  selectCourseLoading,
  selectCourseActionLoading,
  selectCourseError,
  selectCourseActionError,
  selectCourseSuccess,
  selectCourseFilters,
  selectTotalCourses,
} from "../../../redux/features/courseSlice";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusConfig = {
  draft:          { label: "Draft",          classes: "bg-gray-100 text-gray-600 border-gray-200" },
  pending_review: { label: "Under Review",   classes: "bg-amber-50 text-amber-700 border-amber-200" },
  published:      { label: "Published",      classes: "bg-green-50 text-green-700 border-green-200" },
  rejected:       { label: "Rejected",       classes: "bg-red-50 text-red-700 border-red-200" },
  archived:       { label: "Archived",       classes: "bg-slate-100 text-slate-500 border-slate-200" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.draft;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

// ─── Level Badge ──────────────────────────────────────────────────────────────
const levelColors = {
  beginner:     "text-teal-700 bg-teal-50",
  intermediate: "text-blue-700 bg-blue-50",
  advanced:     "text-purple-700 bg-purple-50",
  all:          "text-gray-600 bg-gray-100",
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-gray-100 rounded-full w-4/5" />
        </td>
      ))}
    </tr>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <p className="text-gray-800 font-medium mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CourseTable({ onAddCourse, onEditCourse }) {
  const dispatch = useDispatch();

  const courses       = useSelector(selectFilteredCourses);
  const loading       = useSelector(selectCourseLoading);
  const actionLoading = useSelector(selectCourseActionLoading);
  const error         = useSelector(selectCourseError);
  const actionError   = useSelector(selectCourseActionError);
  const success       = useSelector(selectCourseSuccess);
  const filters       = useSelector(selectCourseFilters);
  const total         = useSelector(selectTotalCourses);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [publishTarget, setPublishTarget] = useState(null);

  useEffect(() => {
    dispatch(fetchTutorCourses());
  }, [dispatch]);

  // Auto-dismiss success
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => dispatch(clearSuccess()), 3500);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  const handleDelete = (id) => setDeleteTarget(id);
  const confirmDelete = () => {
    dispatch(deleteCourse(deleteTarget));
    setDeleteTarget(null);
  };

  const handlePublish = (id) => setPublishTarget(id);
  const confirmPublish = () => {
    dispatch(publishCourse(publishTarget));
    setPublishTarget(null);
  };

  const totalPages = Math.ceil(total / filters.limit);

  const formatDuration = (seconds) => {
    if (!seconds) return "—";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="space-y-5 m-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <p className="text-sm text-gray-400 mt-0.5">{total} course{total !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={onAddCourse}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
          </svg>
          Add New Course
        </button>
      </div>

      {/* Toast notifications */}
      {success && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
          <svg className="w-4 h-4 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          {success}
        </div>
      )}
      {(error || actionError) && (
        <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <span>{error || actionError}</span>
          <button onClick={() => dispatch(clearError())} className="text-red-400 hover:text-red-600">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between gap-3">
  {/* Search - left, fixed width */}
  <div className="relative w-56">
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
    </svg>
    <input
      type="text"
      placeholder="Search courses..."
      value={filters.search}
      onChange={(e) => dispatch(setFilter({ search: e.target.value }))}
      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    />
  </div>

  {/* Dropdowns - right */}
  <div className="flex items-center gap-2">
    <select
      value={filters.status}
      onChange={(e) => dispatch(setFilter({ status: e.target.value }))}
      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
    >
      <option value="all">All Status</option>
      <option value="draft">Draft</option>
      <option value="pending_review">Under Review</option>
      <option value="published">Published</option>
      <option value="rejected">Rejected</option>
      <option value="archived">Archived</option>
    </select>

    <select
      value={`${filters.sortBy}_${filters.sortOrder}`}
      onChange={(e) => {
        const [sortBy, sortOrder] = e.target.value.split("_");
        dispatch(setFilter({ sortBy, sortOrder }));
      }}
      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
    >
      <option value="createdAt_desc">Newest First</option>
      <option value="createdAt_asc">Oldest First</option>
      <option value="enrollmentCount_desc">Most Enrolled</option>
      <option value="rating_desc">Top Rated</option>
    </select>
  </div>
</div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">Course</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase hidden lg:table-cell">Lectures</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase hidden lg:table-cell">Enrolled</th>
                <th className="text-left px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">Status</th>
                <th className="text-right px-4 py-3.5 font-semibold text-gray-500 text-xs tracking-wide uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <svg className="w-10 h-10 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <p className="text-sm font-medium">No courses found</p>
                      <button
                        onClick={onAddCourse}
                        className="mt-1 px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Create your first course
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50/50 transition-colors group">
                    {/* Title + thumbnail */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3 max-w-xs">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center shrink-0 overflow-hidden">
                          {course.thumbnail ? (
                            <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{course.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium capitalize ${levelColors[course.level] || levelColors.all}`}>
                              {course.level}
                            </span>
                            <span className="text-xs text-gray-400">{formatDuration(course.totalDuration)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-gray-600">{course.category?.name || "—"}</span>
                    </td>

                    {/* Lectures */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-gray-600">{course.totalLectures || 0}</span>
                    </td>

                    {/* Enrolled */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-gray-600">{course.enrollmentCount?.toLocaleString() || 0}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={course.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          onClick={() => onEditCourse(course._id)}
                          title="Edit course"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>

                        {/* Submit for review (only draft / rejected) */}
                        {(course.status === "draft" || course.status === "rejected") && (
                          <button
                            onClick={() => handlePublish(course._id)}
                            disabled={actionLoading}
                            title="Submit for review"
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                          </button>
                        )}

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(course._id)}
                          disabled={actionLoading}
                          title="Delete course"
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Page {filters.page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={filters.page === 1}
                onClick={() => dispatch(setPage(filters.page - 1))}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => dispatch(setPage(page))}
                  className={`w-8 h-8 text-xs rounded-lg font-medium transition-colors ${
                    filters.page === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                disabled={filters.page === totalPages}
                onClick={() => dispatch(setPage(filters.page + 1))}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Dialogs */}
      {deleteTarget && (
        <ConfirmDialog
          message="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {publishTarget && (
        <ConfirmDialog
          message="Submit this course for admin review? Once submitted, it will be reviewed before going live."
          onConfirm={confirmPublish}
          onCancel={() => setPublishTarget(null)}
        />
      )}
    </div>
  );
}