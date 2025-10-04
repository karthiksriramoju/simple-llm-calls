document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatHistory = document.getElementById('chatHistory');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const exportHistoryBtn = document.getElementById('exportHistory');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    // State
    let conversationHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    
    // Initialize
    renderConversationHistory();
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    clearHistoryBtn.addEventListener('click', clearHistory);
    exportHistoryBtn.addEventListener('click', exportHistory);
    
    // Functions
    async function sendMessage() {
        const message = messageInput.value.trim();
        
        if (!message) return;
        
        // Add user message to UI
        addMessageToUI('user', message);
        
        // Clear input
        messageInput.value = '';
        
        // Disable send button
        toggleSendButton(false);
        
        // Show loading indicator
        showLoading(true);
        
        try {
            // Send message to API
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Add AI response to UI
            addMessageToUI('ai', data.reply);
            
            // Save to conversation history
            saveMessageToHistory('user', message);
            saveMessageToHistory('ai', data.reply);
            
        } catch (error) {
            console.error('Error sending message:', error);
            addMessageToUI('ai', 'Sorry, I encountered an error. Please try again later.');
        } finally {
            // Re-enable send button
            toggleSendButton(true);
            // Hide loading indicator
            showLoading(false);
            // Focus back to input
            messageInput.focus();
        }
    }
    
    function addMessageToUI(sender, message) {
        // Remove welcome message if it exists
        const welcomeMessage = chatHistory.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}`;
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageElement.innerHTML = `
            <div class="message-content">${escapeHtml(message)}</div>
            <div class="timestamp">${timestamp}</div>
        `;
        
        chatHistory.appendChild(messageElement);
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    function saveMessageToHistory(sender, message) {
        conversationHistory.push({
            sender,
            message,
            timestamp: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('chatHistory', JSON.stringify(conversationHistory));
    }
    
    function renderConversationHistory() {
        // Clear existing messages except welcome
        const existingMessages = chatHistory.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Render saved messages
        conversationHistory.forEach(item => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${item.sender}`;
            
            const timestamp = new Date(item.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            messageElement.innerHTML = `
                <div class="message-content">${escapeHtml(item.message)}</div>
                <div class="timestamp">${timestamp}</div>
            `;
            
            chatHistory.appendChild(messageElement);
        });
        
        // Scroll to bottom
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    function clearHistory() {
        if (confirm('Are you sure you want to clear the conversation history?')) {
            conversationHistory = [];
            localStorage.removeItem('chatHistory');
            
            // Clear UI
            const messages = chatHistory.querySelectorAll('.message');
            messages.forEach(msg => msg.remove());
            
            // Add welcome message back
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'welcome-message';
            welcomeMessage.innerHTML = '<p>Welcome! Start a conversation by typing a message below.</p>';
            chatHistory.appendChild(welcomeMessage);
        }
    }
    
    function exportHistory() {
        if (conversationHistory.length === 0) {
            alert('No conversation history to export.');
            return;
        }
        
        // Create export data
        const exportData = {
            exportDate: new Date().toISOString(),
            conversationHistory: conversationHistory
        };
        
        // Create blob and download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    function toggleSendButton(enabled) {
        sendButton.disabled = !enabled;
        if (enabled) {
            sendButton.innerHTML = `
                <span>Send</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
            `;
        } else {
            sendButton.innerHTML = `
                <span>Sending...</span>
                <div class="spinner-small"></div>
            `;
        }
    }
    
    function showLoading(show) {
        if (show) {
            loadingIndicator.classList.add('show');
        } else {
            loadingIndicator.classList.remove('show');
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});