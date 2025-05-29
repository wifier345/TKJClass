document.addEventListener('DOMContentLoaded', function() {
    // Initialize the comment system
    initCommentSystem();
});

function initCommentSystem() {
    const commentForm = document.getElementById('commentForm');
    const commentsContainer = document.querySelector('.comments-list');
    const commentCountElement = document.querySelector('.comment-count');
    
    // Load comments from localStorage
    loadComments();
    
    // Handle comment form submission
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('commenterName');
            const commentInput = document.getElementById('commentText');
            
            if (nameInput.value.trim() === '' || commentInput.value.trim() === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Create new comment
            const newComment = {
                id: 'comment-' + Date.now(),
                name: nameInput.value.trim(),
                text: commentInput.value.trim(),
                date: new Date().toLocaleString(),
                likes: 0,
                dislikes: 0,
                replies: [],
                page: window.location.pathname
            };
            
            // Add comment to page
            addCommentToPage(newComment);
            
            // Save to localStorage
            saveComment(newComment);
            
            // Reset form
            commentForm.reset();
            
            // Update comment count
            updateCommentCount();
        });
    }
    
    // Handle clicks on the comments container (event delegation)
    if (commentsContainer) {
        commentsContainer.addEventListener('click', function(e) {
            const target = e.target;
            
            // Like button
            if (target.closest('.like-btn')) {
                const likeBtn = target.closest('.like-btn');
                const commentId = likeBtn.getAttribute('data-id');
                const isReply = likeBtn.getAttribute('data-is-reply') === 'true';
                handleLikeDislike(commentId, 'like', isReply);
            }
            
            // Dislike button
            if (target.closest('.dislike-btn')) {
                const dislikeBtn = target.closest('.dislike-btn');
                const commentId = dislikeBtn.getAttribute('data-id');
                const isReply = dislikeBtn.getAttribute('data-is-reply') === 'true';
                handleLikeDislike(commentId, 'dislike', isReply);
            }
            
            // Reply button
            if (target.closest('.reply-btn')) {
                const replyBtn = target.closest('.reply-btn');
                const commentId = replyBtn.getAttribute('data-id');
                toggleReplyForm(commentId);
            }
            
            // Cancel reply button
            if (target.closest('.reply-cancel')) {
                const cancelBtn = target.closest('.reply-cancel');
                const commentId = cancelBtn.getAttribute('data-comment-id');
                hideReplyForm(commentId);
            }
        });
    }
    
    // Handle reply form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.classList.contains('reply-form')) {
            e.preventDefault();
            
            const form = e.target;
            const commentId = form.getAttribute('data-comment-id');
            const nameInput = form.querySelector('.reply-name');
            const textInput = form.querySelector('.reply-text');
            
            if (nameInput.value.trim() === '' || textInput.value.trim() === '') {
                alert('Please fill in all fields');
                return;
            }
            
            // Create new reply
            const newReply = {
                id: 'reply-' + Date.now(),
                name: nameInput.value.trim(),
                text: textInput.value.trim(),
                date: new Date().toLocaleString(),
                likes: 0,
                dislikes: 0
            };
            
            // Add reply to comment
            addReplyToComment(commentId, newReply);
            
            // Hide reply form
            hideReplyForm(commentId);
        }
    });
}

function loadComments() {
    const currentPage = window.location.pathname;
    const allComments = JSON.parse(localStorage.getItem('blogComments')) || [];
    
    // Filter comments for current page
    const pageComments = allComments.filter(comment => comment.page === currentPage);
    
    // Add comments to page
    pageComments.forEach(comment => {
        addCommentToPage(comment);
    });
    
    // Update comment count
    updateCommentCount();
}

function addCommentToPage(comment) {
    const commentsContainer = document.querySelector('.comments-list');
    
    if (!commentsContainer) return;
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    commentElement.id = comment.id;
    
    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="commenter-name">${escapeHTML(comment.name)}</span>
            <span class="comment-date">${comment.date}</span>
        </div>
        <div class="comment-content">${escapeHTML(comment.text)}</div>
        <div class="comment-actions">
            <button class="comment-action-btn like-btn" data-id="${comment.id}" data-is-reply="false">
                <i class="fas fa-thumbs-up"></i> <span class="like-count">${comment.likes}</span>
            </button>
            <button class="comment-action-btn dislike-btn" data-id="${comment.id}" data-is-reply="false">
                <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${comment.dislikes}</span>
            </button>
            <button class="comment-action-btn reply-btn" data-id="${comment.id}">
                <i class="fas fa-reply"></i> Reply
            </button>
        </div>
        <div class="reply-form-container" id="reply-form-${comment.id}">
            <form class="reply-form" data-comment-id="${comment.id}">
                <input type="text" class="reply-name" placeholder="Your Name" required>
                <textarea class="reply-text" placeholder="Write your reply..." required></textarea>
                <div class="reply-form-buttons">
                    <button type="submit" class="reply-submit">Post Reply</button>
                    <button type="button" class="reply-cancel" data-comment-id="${comment.id}">Cancel</button>
                </div>
            </form>
        </div>
        <div class="replies-container" id="replies-${comment.id}">
            <!-- Replies will be added here -->
        </div>
    `;
    
    commentsContainer.appendChild(commentElement);
    
    // Add any existing replies
    if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach(reply => {
            addReplyToPage(comment.id, reply);
        });
    }
    
    // Check if user has already liked/disliked this comment
    checkUserInteraction(comment.id, false);
}

function addReplyToComment(commentId, reply) {
    // Add reply to page
    addReplyToPage(commentId, reply);
    
    // Save to localStorage
    const allComments = JSON.parse(localStorage.getItem('blogComments')) || [];
    const commentIndex = allComments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
        if (!allComments[commentIndex].replies) {
            allComments[commentIndex].replies = [];
        }
        allComments[commentIndex].replies.push(reply);
        localStorage.setItem('blogComments', JSON.stringify(allComments));
    }
}

function addReplyToPage(commentId, reply) {
    const repliesContainer = document.getElementById(`replies-${commentId}`);
    
    if (!repliesContainer) return;
    
    const replyElement = document.createElement('div');
    replyElement.className = 'reply-item';
    replyElement.id = reply.id;
    
    replyElement.innerHTML = `
        <div class="comment-header">
            <span class="commenter-name">${escapeHTML(reply.name)}</span>
            <span class="comment-date">${reply.date}</span>
        </div>
        <div class="comment-content">${escapeHTML(reply.text)}</div>
        <div class="comment-actions">
            <button class="comment-action-btn like-btn" data-id="${reply.id}" data-is-reply="true" data-parent-id="${commentId}">
                <i class="fas fa-thumbs-up"></i> <span class="like-count">${reply.likes}</span>
            </button>
            <button class="comment-action-btn dislike-btn" data-id="${reply.id}" data-is-reply="true" data-parent-id="${commentId}">
                <i class="fas fa-thumbs-down"></i> <span class="dislike-count">${reply.dislikes}</span>
            </button>
        </div>
    `;
    
    repliesContainer.appendChild(replyElement);
    
    // Check if user has already liked/disliked this reply
    checkUserInteraction(reply.id, true);
}

function saveComment(comment) {
    const allComments = JSON.parse(localStorage.getItem('blogComments')) || [];
    allComments.push(comment);
    localStorage.setItem('blogComments', JSON.stringify(allComments));
}

function toggleReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    
    if (replyForm) {
        // Hide all other reply forms first
        document.querySelectorAll('.reply-form-container').forEach(form => {
            if (form.id !== `reply-form-${commentId}`) {
                form.style.display = 'none';
            }
        });
        
        // Toggle this form
        replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
        
        // Focus on name input if showing
        if (replyForm.style.display === 'block') {
            replyForm.querySelector('.reply-name').focus();
        }
    }
}

function hideReplyForm(commentId) {
    const replyForm = document.getElementById(`reply-form-${commentId}`);
    
    if (replyForm) {
        replyForm.style.display = 'none';
        replyForm.reset();
    }
}

function handleLikeDislike(id, action, isReply) {
    // Get user interactions from localStorage
    const userInteractions = JSON.parse(localStorage.getItem('userCommentInteractions')) || {};
    const interactionKey = `${id}-${action}`;
    const oppositeAction = action === 'like' ? 'dislike' : 'like';
    const oppositeKey = `${id}-${oppositeAction}`;
    
    // Get all comments from localStorage
    const allComments = JSON.parse(localStorage.getItem('blogComments')) || [];
    
    let targetComment;
    let targetReply;
    let commentIndex;
    let replyIndex;
    
    if (isReply) {
        // Find the parent comment and the reply
        for (let i = 0; i < allComments.length; i++) {
            if (allComments[i].replies) {
                replyIndex = allComments[i].replies.findIndex(r => r.id === id);
                if (replyIndex !== -1) {
                    targetReply = allComments[i].replies[replyIndex];
                    commentIndex = i;
                    break;
                }
            }
        }
    } else {
        // Find the comment
        commentIndex = allComments.findIndex(c => c.id === id);
        if (commentIndex !== -1) {
            targetComment = allComments[commentIndex];
        }
    }
    
    // If user already performed this action, remove it
    if (userInteractions[interactionKey]) {
        delete userInteractions[interactionKey];
        
        // Decrement count
        if (isReply && targetReply) {
            targetReply[`${action}s`]--;
        } else if (targetComment) {
            targetComment[`${action}s`]--;
        }
    } 
    // If user performed the opposite action, switch it
    else if (userInteractions[oppositeKey]) {
        delete userInteractions[oppositeKey];
        userInteractions[interactionKey] = true;
        
        // Update counts
        if (isReply && targetReply) {
            targetReply[`${oppositeAction}s`]--;
            targetReply[`${action}s`]++;
        } else if (targetComment) {
            targetComment[`${oppositeAction}s`]--;
            targetComment[`${action}s`]++;
        }
    } 
    // New action
    else {
        userInteractions[interactionKey] = true;
        
        // Increment count
        if (isReply && targetReply) {
            targetReply[`${action}s`]++;
        } else if (targetComment) {
            targetComment[`${action}s`]++;
        }
    }
    
    // Save updated interactions
    localStorage.setItem('userCommentInteractions', JSON.stringify(userInteractions));
    
    // Save updated comments
    localStorage.setItem('blogComments', JSON.stringify(allComments));
    
    // Update UI
    updateLikeDislikeUI(id, isReply);
}

function updateLikeDislikeUI(id, isReply) {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Get updated data
    const allComments = JSON.parse(localStorage.getItem('blogComments')) || [];
    const userInteractions = JSON.parse(localStorage.getItem('userCommentInteractions')) || {};
    
    let targetItem;
    
    if (isReply) {
        // Find the reply
        for (const comment of allComments) {
            if (comment.replies) {
                const reply = comment.replies.find(r => r.id === id);
                if (reply) {
                    targetItem = reply;
                    break;
                }
            }
        }
    } else {
        // Find the comment
        targetItem = allComments.find(c => c.id === id);
    }
    
    if (!targetItem) return;
    
    // Update counts
    const likeCount = element.querySelector('.like-count');
    const dislikeCount = element.querySelector('.dislike-count');
    
    if (likeCount) likeCount.textContent = targetItem.likes;
    if (dislikeCount) dislikeCount.textContent = targetItem.dislikes;
    
    // Update active states
    const likeBtn = element.querySelector('.like-btn');
    const dislikeBtn = element.querySelector('.dislike-btn');
    
    if (likeBtn) {
        likeBtn.classList.toggle('active', userInteractions[`${id}-like`] === true);
    }
    
    if (dislikeBtn) {
        dislikeBtn.classList.toggle('active', userInteractions[`${id}-dislike`] === true);
    }
}

function checkUserInteraction(id, isReply) {
    const userInteractions = JSON.parse(localStorage.getItem('userCommentInteractions')) || {};
    
    const element = document.getElementById(id);
    if (!element) return;
    
    const likeBtn = element.querySelector('.like-btn');
    const dislikeBtn = element.querySelector('.dislike-btn');
    
    if (likeBtn) {
        likeBtn.classList.toggle('active', userInteractions[`${id}-like`] === true);
    }
    
    if (dislikeBtn) {
        dislikeBtn.classList.toggle('active', userInteractions[`${id}-dislike`] === true);
    }
}

function updateCommentCount() {
    const commentCountElement = document.querySelector('.comment-count');
    const commentItems = document.querySelectorAll('.comment-item');
    
    if (commentCountElement) {
        commentCountElement.textContent = `(${commentItems.length})`;
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}