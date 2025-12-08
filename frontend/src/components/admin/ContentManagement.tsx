import React, { useState, useEffect } from 'react';
import AdminService from '../../services/adminService';

interface Post {
  id: number;
  content: string;
  created_at: string;
  image_url?: string;
  users: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  _count: {
    comments: number;
    post_likes: number;
  };
}

export default function ContentManagement() {
  const [activeTab, setActiveTab] = useState<'posts' | 'events'>('posts');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    if (activeTab === 'posts') {
      loadPosts();
    }
    // You can add events loading here when you implement it
  }, [activeTab, pagination.page]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await AdminService.getPosts(pagination.page, pagination.limit);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Greška prilikom učitavanja objave', error);
      alert('Neuspešno učitavanje objave');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovu objavu?')) {
      try {
        await AdminService.deletePost(postId);
        loadPosts();
        alert('Objava uspješno obrisana');
      } catch (error) {
        console.error('Greška prilikom brisanja objave:', error);
        alert('Neuspješno brisanje objave');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upravljanje sadržajem</h2>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'posts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Objave
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'events'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Događaji
          </button>
        </nav>
      </div>

      {activeTab === 'posts' && (
        <>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Učitavanje objava...</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {post.users.first_name} {post.users.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          @{post.users.username} • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt="Post" 
                        className="max-w-xs rounded-lg mb-3"
                      />
                    )}
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>💬 {post._count.comments} comments</span>
                      <span>👍 {post._count.post_likes} likes</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                  >
                    Previous
                  </button>
                  <span className="text-gray-600">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'events' && (
        <div className="text-center py-8 text-gray-500">
          Upravljanje događajima uskoro...
        </div>
      )}
    </div>
  );
}