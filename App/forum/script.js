const API_URL = 'http://127.0.0.1:5000';

document.getElementById('question-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
    });

    if (response.ok) {
        alert('Question posted!');
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        loadQuestions();
    }
});

// Updated loadQuestions function to include data-id attribute
async function loadQuestions() {
    const response = await fetch(`${API_URL}/questions`);
    const questions = await response.json();

    const questionsContainer = document.getElementById('questions');
    questionsContainer.innerHTML = ''; // Clear previous questions

    questions.forEach(question => {
        const div = document.createElement('div');
        div.className = 'question';
        div.setAttribute('data-id', question[0]); // Associate question ID
        div.innerHTML = `
            <h3>${question[1]}</h3>
            <p>${question[2]}</p>
            <small>${question[3]}</small>
            <button class="reply-button">Reply</button>
            <button class="view-replies">View Replies</button>
            <button class="delete-question">Delete Question</button>
            <div class="reply-form" style="display: none;">
                <textarea class="reply-content" placeholder="Write your reply here..."></textarea>
                <button class="submit-reply">Submit Reply</button>
            </div>
            <div class="replies" style="display: none;"></div>
        `;

        // Add click event to toggle reply form
        const replyButton = div.querySelector('.reply-button');
        replyButton.addEventListener('click', () => {
            const replyForm = div.querySelector('.reply-form');
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });

        // Add event listener for reply submission
        const submitReplyButton = div.querySelector('.submit-reply');
        submitReplyButton.addEventListener('click', async () => {
            const replyContent = div.querySelector('.reply-content').value;
            if (replyContent.trim()) {
                await submitReply(question[0], replyContent);
                div.querySelector('.reply-content').value = ''; // Clear input after submission
                alert('Reply submitted successfully!');
            } else {
                alert('Reply content cannot be empty!');
            }
        });

        // Add click event to toggle replies
        const viewRepliesButton = div.querySelector('.view-replies');
        viewRepliesButton.addEventListener('click', () => {
            const replies = div.querySelector('.replies');
            if (replies.style.display === 'none') {
                loadReplies(question[0]);
                replies.style.display = 'block';
            } else {
                replies.style.display = 'none';
            }
        });

        // Add event listener for delete question
        const deleteQuestionButton = div.querySelector('.delete-question');
        deleteQuestionButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this question?')) {
                await deleteQuestion(question[0]);
                loadQuestions(); // Reload questions after deletion
            }
        });

        questionsContainer.appendChild(div);
    });
}

async function deleteQuestion(questionId) {
    const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Question deleted successfully!');
    } else {
        alert('Failed to delete question.');
    }
}

async function submitReply(questionId, content) {
    const response = await fetch(`${API_URL}/replies/${questionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content }),
    });

    // if (response.ok) {
    //     alert('Reply added successfully!');
    // } else {
    //     alert('Failed to add reply.');
    // }
}

// Updated loadReplies function
async function loadReplies(questionId) {
    // Find the correct question container
    const questionDiv = document.querySelector(`.question[data-id="${questionId}"]`);

    // Check if replies container already exists
    let replyContainer = questionDiv.querySelector('.replies');

    if (replyContainer) {
        // If the container exists, toggle visibility
        if (replyContainer.style.display === 'none') {
            replyContainer.style.display = 'block';
        } else {
            replyContainer.style.display = 'none';
            return; // Stop further processing when just hiding replies
        }
    } else {
        // If no replies container, create one
        replyContainer = document.createElement('div');
        replyContainer.className = 'replies';
        questionDiv.appendChild(replyContainer);
    }

    // Clear existing content (if any) before appending new replies
    replyContainer.innerHTML = '';

    // Fetch replies from the backend
    const response = await fetch(`${API_URL}/replies/${questionId}`);
    const replies = await response.json();

    // Append each reply to the container
    replies.forEach(reply => {
        const div = document.createElement('div');
        div.className = 'reply';
        div.innerHTML = `
            <p>${reply[1]}</p>
            <small>${reply[2]}</small>
            <button class="delete-reply" data-reply-id="${reply[0]}">Delete</button>
        `;

        // Add event listener for delete button
        const deleteButton = div.querySelector('.delete-reply');
        deleteButton.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this reply?')) {
                await deleteReply(reply[0]); // Call deleteReply function
                loadReplies(questionId); // Reload replies after deletion
            }
        });

        replyContainer.appendChild(div);
    });
}

// Add a deleteReply function to handle reply deletion
async function deleteReply(replyId) {
    const response = await fetch(`${API_URL}/replies/${replyId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Reply deleted successfully!');
    } else {
        alert('Failed to delete reply.');
    }
}



loadQuestions();
