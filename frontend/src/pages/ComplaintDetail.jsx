import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { complaintAPI } from '../services/api';
import toast from 'react-hot-toast';

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    priority: '',
    resolution: ''
  });

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getById(id);
      setComplaint(response.complaint);
      setUpdateData({
        status: response.complaint.status,
        priority: response.complaint.priority,
        resolution: response.complaint.resolution || ''
      });
    } catch (error) {
      toast.error('Failed to load complaint');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      const response = await complaintAPI.addComment(id, { message: commentText });
      setComplaint(prev => ({
        ...prev,
        comments: [...prev.comments, response.comment]
      }));
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      // Error handled by API interceptor
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const response = await complaintAPI.update(id, updateData);
      setComplaint(response.complaint);
      toast.success('Complaint updated successfully');
    } catch (error) {
      // Error handled by API interceptor
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Complaint not found</h3>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-500">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const canEdit = isAdmin || complaint.user._id === user?.id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
        <Link
          to={isAdmin ? "/complaints/all" : "/complaints"}
          className="text-blue-600 hover:text-blue-500 text-sm font-medium"
        >
          ← Back to List
        </Link>
      </div>

      {/* Complaint Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{complaint.title}</h2>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Category</h3>
              <p className="text-gray-900 capitalize">{complaint.category}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Created By</h3>
              <p className="text-gray-900">{complaint.user.name} ({complaint.user.email})</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Created At</h3>
              <p className="text-gray-900">{new Date(complaint.createdAt).toLocaleString()}</p>
            </div>
            {complaint.assignedTo && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Assigned To</h3>
                <p className="text-gray-900">{complaint.assignedTo.name}</p>
              </div>
            )}
          </div>
          
          {complaint.resolution && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Resolution</h3>
              <p className="text-gray-900 whitespace-pre-wrap bg-green-50 p-3 rounded-md">{complaint.resolution}</p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Update Form */}
      {isAdmin && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Update Complaint</h3>
          </div>
          <div className="px-6 py-4">
            <form onSubmit={handleUpdateComplaint} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={updateData.priority}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <textarea
                  value={updateData.resolution}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, resolution: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter resolution details..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={updating}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    updating
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {updating ? 'Updating...' : 'Update Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        </div>
        
        <div className="px-6 py-4">
          {/* Add Comment Form */}
          {canEdit && (
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="mb-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a comment..."
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">{commentText.length}/500 characters</p>
              </div>
              <button
                type="submit"
                disabled={submittingComment || !commentText.trim()}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  submittingComment || !commentText.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {submittingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </form>
          )}
          
          {/* Comments List */}
          {complaint.comments && complaint.comments.length > 0 ? (
            <div className="space-y-4">
              {complaint.comments.map((comment, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.user.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;