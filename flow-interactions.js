// Flow Interactions - Complete workflow from company to professional

// State management
const flowState = {
    shortlist: [],
    currentProfessional: null,
    chatHistory: {},
    sentInvitations: []
};

// Initialize flow interactions
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the results page
    if (!document.getElementById('results-grid')) return;
    
    setupShortlistPanel();
    setupMeetingScheduler();
    setupChatInterface();
    setupInvitationFlow();
    
    // Load saved shortlist from localStorage
    loadShortlist();
});

// SHORTLIST FUNCTIONALITY
function setupShortlistPanel() {
    const shortlistFab = document.getElementById('shortlist-fab');
    const shortlistPanel = document.getElementById('shortlist-panel');
    const closeShortlist = document.getElementById('close-shortlist');
    
    if (shortlistFab) {
        shortlistFab.addEventListener('click', () => {
            shortlistPanel.classList.add('open');
        });
    }
    
    if (closeShortlist) {
        closeShortlist.addEventListener('click', () => {
            shortlistPanel.classList.remove('open');
        });
    }
}

function addToShortlist(professionalId) {
    if (flowState.shortlist.includes(professionalId)) {
        showToast('Deze professional staat al op je shortlist', 'error');
        return;
    }
    
    flowState.shortlist.push(professionalId);
    updateShortlistUI();
    saveShortlist();
    showToast('Toegevoegd aan shortlist', 'success');
    
    // Update button state
    const btn = document.querySelector(`.shortlist-btn[data-professional-id="${professionalId}"]`);
    if (btn) btn.classList.add('active');
}

function removeFromShortlist(professionalId) {
    flowState.shortlist = flowState.shortlist.filter(id => id !== professionalId);
    updateShortlistUI();
    saveShortlist();
    showToast('Verwijderd van shortlist', 'success');
    
    // Update button state
    const btn = document.querySelector(`.shortlist-btn[data-professional-id="${professionalId}"]`);
    if (btn) btn.classList.remove('active');
}

function updateShortlistUI() {
    const count = flowState.shortlist.length;
    const fabCount = document.getElementById('fab-count');
    const shortlistCount = document.getElementById('shortlist-count');
    const shortlistBody = document.getElementById('shortlist-body');
    const shortlistFab = document.getElementById('shortlist-fab');
    const sendBatchBtn = document.getElementById('send-batch-invite');
    
    // Update counts
    if (fabCount) fabCount.textContent = count;
    if (shortlistCount) shortlistCount.textContent = count;
    
    // Show/hide FAB
    if (shortlistFab) {
        shortlistFab.style.display = count > 0 ? 'flex' : 'none';
    }
    
    // Enable/disable batch invite
    if (sendBatchBtn) {
        sendBatchBtn.disabled = count === 0;
    }
    
    // Update shortlist body
    if (shortlistBody) {
        if (count === 0) {
            shortlistBody.innerHTML = `
                <div class="shortlist-empty">
                    <div class="icon">⭐</div>
                    <p>Nog geen professionals op je shortlist</p>
                    <p style="font-size: 0.875rem;">Klik op het ster-icoon om professionals toe te voegen</p>
                </div>
            `;
        } else {
            const items = flowState.shortlist.map(id => {
                const card = document.querySelector(`.profile-card[data-professional-id="${id}"]`);
                if (!card) return '';
                
                const name = card.querySelector('.profile-name').textContent;
                const title = card.querySelector('.profile-title').textContent;
                const photo = card.querySelector('.profile-photo').src;
                const matchScore = card.querySelector('.match-score').textContent;
                
                return `
                    <div class="shortlist-item">
                        <img src="${photo}" alt="${name}" class="shortlist-item-photo">
                        <div class="shortlist-item-info">
                            <div class="shortlist-item-name">${name}</div>
                            <div class="shortlist-item-title">${title}</div>
                            <span class="shortlist-item-match">${matchScore}</span>
                        </div>
                        <button class="shortlist-item-remove" onclick="removeFromShortlist(${id})" title="Verwijder">×</button>
                    </div>
                `;
            }).join('');
            
            shortlistBody.innerHTML = items;
        }
    }
}

function saveShortlist() {
    localStorage.setItem('growtalent_shortlist', JSON.stringify(flowState.shortlist));
}

function loadShortlist() {
    const saved = localStorage.getItem('growtalent_shortlist');
    if (saved) {
        flowState.shortlist = JSON.parse(saved);
        updateShortlistUI();
        
        // Update button states
        flowState.shortlist.forEach(id => {
            const btn = document.querySelector(`.shortlist-btn[data-professional-id="${id}"]`);
            if (btn) btn.classList.add('active');
        });
    }
}

// MEETING SCHEDULER
function setupMeetingScheduler() {
    const meetingDate = document.getElementById('meeting-date');
    const confirmBtn = document.getElementById('confirm-meeting');
    
    // Set minimum date to today
    if (meetingDate) {
        const today = new Date().toISOString().split('T')[0];
        meetingDate.setAttribute('min', today);
        
        meetingDate.addEventListener('change', function() {
            generateTimeSlots(this.value);
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmMeeting);
    }
}

function openMeetingScheduler(professionalId) {
    const card = document.querySelector(`.profile-card[data-professional-id="${professionalId}"]`);
    if (!card) return;
    
    flowState.currentProfessional = professionalId;
    
    const name = card.querySelector('.profile-name').textContent;
    const title = card.querySelector('.profile-title').textContent;
    const photo = card.querySelector('.profile-photo').src;
    const availability = card.querySelector('.meta-value.available').textContent;
    
    const infoDiv = document.getElementById('meeting-professional-info');
    infoDiv.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
            <img src="${photo}" alt="${name}" style="width: 60px; height: 60px; border-radius: 50%;">
            <div>
                <div style="font-weight: 700; font-size: 1.125rem;">${name}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${title}</div>
            </div>
        </div>
        <div class="meeting-info-item">
            <span class="meeting-info-label">Beschikbaar:</span>
            <span>${availability}</span>
        </div>
    `;
    
    // Reset form
    document.getElementById('meeting-form').reset();
    document.getElementById('time-slots').innerHTML = '<p style="color: var(--text-secondary); font-size: 0.875rem;">Selecteer eerst een datum</p>';
    
    openModal('meeting-modal');
}

function generateTimeSlots(date) {
    const slotsDiv = document.getElementById('time-slots');
    const slots = [
        '09:00', '10:00', '11:00',
        '13:00', '14:00', '15:00',
        '16:00', '17:00'
    ];
    
    slotsDiv.innerHTML = slots.map(time => `
        <div class="time-slot" data-time="${time}">${time}</div>
    `).join('');
    
    // Add click handlers
    slotsDiv.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            slotsDiv.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

function confirmMeeting() {
    const date = document.getElementById('meeting-date').value;
    const selectedSlot = document.querySelector('.time-slot.selected');
    const type = document.getElementById('meeting-type').value;
    const notes = document.getElementById('meeting-notes').value;
    
    if (!date || !selectedSlot || !type) {
        showToast('Vul alle verplichte velden in', 'error');
        return;
    }
    
    const time = selectedSlot.getAttribute('data-time');
    const card = document.querySelector(`.profile-card[data-professional-id="${flowState.currentProfessional}"]`);
    const name = card.querySelector('.profile-name').textContent;
    
    // Simulate sending meeting request
    console.log('Meeting request sent:', {
        professionalId: flowState.currentProfessional,
        date, time, type, notes
    });
    
    closeModal('meeting-modal');
    showToast(`Kennismakingsverzoek verstuurd naar ${name}`, 'success');
    
    // In real app: Professional receives notification
    simulateProfessionalNotification(flowState.currentProfessional, 'meeting', {
        date, time, type, notes
    });
}

// CHAT INTERFACE
function setupChatInterface() {
    const chatForm = document.getElementById('chat-form');
    const fileUpload = document.getElementById('file-upload');
    const sendProposalBtn = document.getElementById('send-proposal-btn');
    const generateSummaryBtn = document.getElementById('generate-summary-btn');
    
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendChatMessage();
        });
    }
    
    if (fileUpload) {
        fileUpload.addEventListener('change', function(e) {
            handleFileUpload(e.target.files);
        });
    }
    
    if (sendProposalBtn) {
        sendProposalBtn.addEventListener('click', function() {
            openProposalModal();
        });
    }
    
    if (generateSummaryBtn) {
        generateSummaryBtn.addEventListener('click', function() {
            generateAISummary();
        });
    }
}

function openChatModal(professionalId) {
    const card = document.querySelector(`.profile-card[data-professional-id="${professionalId}"]`);
    if (!card) return;
    
    flowState.currentProfessional = professionalId;
    
    const name = card.querySelector('.profile-name').textContent;
    const title = card.querySelector('.profile-title').textContent;
    const photo = card.querySelector('.profile-photo').src;
    
    document.getElementById('chat-professional-name').textContent = `Chat met ${name}`;
    
    // Update chat header
    const chatHeaderInfo = document.getElementById('chat-header-info');
    chatHeaderInfo.innerHTML = `
        <div class="chat-header-left">
            <img src="${photo}" alt="${name}" class="chat-header-avatar">
            <div>
                <div style="font-weight: 600;">${name}</div>
                <div class="chat-header-status">● Online</div>
            </div>
        </div>
        <div class="chat-actions">
            <button class="chat-action-btn" onclick="viewProposals()">
                <span>📄</span> Voorstellen
            </button>
            <button class="chat-action-btn" onclick="viewSharedFiles()">
                <span>📎</span> Bestanden
            </button>
        </div>
    `;
    
    loadChatHistory(professionalId);
    checkAndShowAISummary(professionalId);
    openModal('chat-modal');
}

function loadChatHistory(professionalId) {
    const messagesDiv = document.getElementById('chat-messages');
    const history = flowState.chatHistory[professionalId] || [];
    
    if (history.length === 0) {
        messagesDiv.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <p style="font-size: 2rem; margin-bottom: 0.5rem;">👋</p>
                <p>Start een gesprek met deze professional</p>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">Je kunt berichten sturen, bestanden delen en voorstellen uitwisselen</p>
            </div>
        `;
    } else {
        messagesDiv.innerHTML = history.map(msg => createChatMessageHTML(msg)).join('');
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

function createChatMessageHTML(message) {
    const time = new Date(message.timestamp).toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    let content = '';
    
    // Regular text message
    if (message.text) {
        content = `
            <div class="chat-message-bubble">
                <p class="chat-message-text">${escapeHtml(message.text)}</p>
            </div>
        `;
    }
    
    // File attachment
    if (message.file) {
        content += `
            <div class="chat-message-attachment" onclick="downloadFile('${message.file.name}')">
                <div class="attachment-icon">${getFileIcon(message.file.type)}</div>
                <div class="attachment-info">
                    <div class="attachment-name">${message.file.name}</div>
                    <div class="attachment-size">${formatFileSize(message.file.size)}</div>
                </div>
                <div style="font-size: 1.25rem;">⬇️</div>
            </div>
        `;
    }
    
    // Proposal
    if (message.proposal) {
        const p = message.proposal;
        content += `
            <div class="chat-proposal-preview" onclick="viewProposal(${message.id})">
                <div class="proposal-header">
                    <span class="proposal-title">📄 Voorstel</span>
                    <span class="proposal-amount">€${p.price}</span>
                </div>
                <div class="proposal-details">
                    ${p.intro ? p.intro.substring(0, 100) + '...' : 'Bekijk voorstel voor details'}
                </div>
                <div class="proposal-cta">Klik om volledig voorstel te bekijken →</div>
            </div>
        `;
    }
    
    return `
        <div class="chat-message ${message.sender === 'me' ? 'sent' : ''}">
            <div class="chat-message-avatar">${message.sender === 'me' ? 'U' : message.sender.charAt(0).toUpperCase()}</div>
            <div class="chat-message-content">
                ${content}
                <div class="chat-message-time">${time}</div>
            </div>
        </div>
    `;
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    
    if (!text) return;
    
    const message = {
        id: Date.now(),
        sender: 'me',
        text: text,
        timestamp: new Date().toISOString()
    };
    
    addMessageToHistory(message);
    input.value = '';
    
    console.log('Message sent:', message);
    simulateProfessionalNotification(flowState.currentProfessional, 'message', { text });
}

function handleFileUpload(files) {
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
        const message = {
            id: Date.now() + Math.random(),
            sender: 'me',
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                url: URL.createObjectURL(file) // In real app: upload to server
            },
            timestamp: new Date().toISOString()
        };
        
        addMessageToHistory(message);
        showToast(`Bestand gedeeld: ${file.name}`, 'success');
        console.log('File shared:', file.name);
    });
    
    // Reset file input
    document.getElementById('file-upload').value = '';
}

function addMessageToHistory(message) {
    if (!flowState.chatHistory[flowState.currentProfessional]) {
        flowState.chatHistory[flowState.currentProfessional] = [];
    }
    flowState.chatHistory[flowState.currentProfessional].push(message);
    loadChatHistory(flowState.currentProfessional);
}

// PROPOSAL SYSTEM
function openProposalModal() {
    const templates = document.querySelectorAll('.template-card');
    const proposalForm = document.getElementById('proposal-form');
    const sendBtn = document.getElementById('send-proposal');
    
    // Reset
    templates.forEach(t => t.classList.remove('selected'));
    proposalForm.style.display = 'none';
    sendBtn.disabled = true;
    
    // Add template selection handlers
    templates.forEach(template => {
        template.onclick = function() {
            templates.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
            
            const templateType = this.getAttribute('data-template');
            loadProposalTemplate(templateType);
            proposalForm.style.display = 'block';
            sendBtn.disabled = false;
        };
    });
    
    // Add price calculation
    const priceInput = document.getElementById('proposal-price');
    if (priceInput) {
        priceInput.addEventListener('input', calculatePriceBreakdown);
    }
    
    // Send proposal handler
    sendBtn.onclick = sendProposal;
    
    openModal('proposal-modal');
}

function loadProposalTemplate(type) {
    const templates = {
        basic: {
            intro: 'Ik ben enthousiast om met jullie samen te werken aan dit project. Met mijn ervaring kan ik jullie helpen om het gewenste resultaat te bereiken.',
            deliverables: [
                { title: 'Projectoplevering', timeline: 'Volgens afspraak' }
            ]
        },
        detailed: {
            intro: 'Op basis van jullie briefing heb ik een gedetailleerd plan opgesteld. Mijn aanpak is gefocust op kwaliteit en tijdige oplevering.',
            deliverables: [
                { title: 'Kick-off en strategie', timeline: 'Week 1' },
                { title: 'Concept en eerste versie', timeline: 'Week 2-3' },
                { title: 'Revisies en finalisatie', timeline: 'Week 4' },
                { title: 'Oplevering en overdracht', timeline: 'Week 5' }
            ]
        },
        custom: {
            intro: '',
            deliverables: []
        }
    };
    
    const template = templates[type];
    document.getElementById('proposal-intro').value = template.intro;
    
    // Load deliverables
    const list = document.getElementById('deliverables-list');
    list.innerHTML = template.deliverables.map(d => `
        <li class="deliverable-item">
            <input type="checkbox" checked>
            <div class="deliverable-content">
                <input type="text" class="deliverable-title" value="${d.title}" style="border: none; background: transparent; width: 100%; font-weight: 600;">
                <input type="text" class="deliverable-timeline" value="${d.timeline}" style="border: none; background: transparent; width: 100%; font-size: 0.8125rem;">
            </div>
        </li>
    `).join('');
}

function addDeliverable() {
    const list = document.getElementById('deliverables-list');
    const newItem = document.createElement('li');
    newItem.className = 'deliverable-item';
    newItem.innerHTML = `
        <input type="checkbox" checked>
        <div class="deliverable-content">
            <input type="text" class="deliverable-title" placeholder="Nieuwe deliverable" style="border: none; background: transparent; width: 100%; font-weight: 600;">
            <input type="text" class="deliverable-timeline" placeholder="Tijdlijn" style="border: none; background: transparent; width: 100%; font-size: 0.8125rem;">
        </div>
    `;
    list.appendChild(newItem);
}

function calculatePriceBreakdown() {
    const price = parseFloat(document.getElementById('proposal-price').value) || 0;
    const vat = price * 0.21;
    const total = price + vat;
    
    document.getElementById('base-price').textContent = `€${price.toFixed(2)}`;
    document.getElementById('vat-price').textContent = `€${vat.toFixed(2)}`;
    document.getElementById('total-price').textContent = `€${total.toFixed(2)}`;
    
    document.getElementById('price-breakdown').style.display = price > 0 ? 'block' : 'none';
}

function sendProposal() {
    const intro = document.getElementById('proposal-intro').value;
    const price = document.getElementById('proposal-price').value;
    const timeline = document.getElementById('proposal-timeline').value;
    const notes = document.getElementById('proposal-notes').value;
    
    if (!intro || !price || !timeline) {
        showToast('Vul alle verplichte velden in', 'error');
        return;
    }
    
    // Collect deliverables
    const deliverables = Array.from(document.querySelectorAll('.deliverable-item')).map(item => ({
        title: item.querySelector('.deliverable-title').value,
        timeline: item.querySelector('.deliverable-timeline').value,
        checked: item.querySelector('input[type="checkbox"]').checked
    })).filter(d => d.checked);
    
    const proposal = {
        intro, price, timeline, notes, deliverables,
        createdAt: new Date().toISOString()
    };
    
    // Add to chat as message
    const message = {
        id: Date.now(),
        sender: 'me',
        proposal: proposal,
        timestamp: new Date().toISOString()
    };
    
    addMessageToHistory(message);
    
    closeModal('proposal-modal');
    showToast('Voorstel verstuurd!', 'success');
    
    console.log('Proposal sent:', proposal);
    simulateProfessionalNotification(flowState.currentProfessional, 'proposal', proposal);
}

// AI SUMMARY GENERATION
function generateAISummary() {
    const history = flowState.chatHistory[flowState.currentProfessional] || [];
    
    if (history.length < 3) {
        showToast('Te weinig berichten voor een samenvatting', 'error');
        return;
    }
    
    showToast('AI genereert samenvatting...', 'success');
    
    // Simulate AI processing
    setTimeout(() => {
        const summary = createAISummary(history);
        displayAISummary(summary);
    }, 1500);
}

function createAISummary(history) {
    // In real app: call AI API
    // For now: create smart summary based on message content
    
    const messageCount = history.length;
    const hasProposal = history.some(m => m.proposal);
    const hasFiles = history.some(m => m.file);
    
    const keyPoints = [];
    
    if (hasProposal) {
        keyPoints.push('Er is een voorstel uitgewisseld');
    }
    if (hasFiles) {
        const fileCount = history.filter(m => m.file).length;
        keyPoints.push(`${fileCount} bestand(en) gedeeld`);
    }
    
    // Extract some context from messages
    const textMessages = history.filter(m => m.text).slice(-5);
    if (textMessages.length > 0) {
        keyPoints.push('Laatste berichten gaan over projectdetails en planning');
    }
    
    return {
        text: `Conversatie met ${messageCount} berichten. De discussie draait om het project en mogelijke samenwerking.`,
        points: keyPoints,
        generatedAt: new Date().toISOString()
    };
}

function displayAISummary(summary) {
    const summaryPanel = document.getElementById('ai-summary');
    const summaryText = document.getElementById('ai-summary-text');
    
    const points = summary.points.length > 0 
        ? `<ul class="ai-summary-points">${summary.points.map(p => `<li>${p}</li>`).join('')}</ul>`
        : '';
    
    summaryText.innerHTML = `
        <p>${summary.text}</p>
        ${points}
    `;
    
    summaryPanel.style.display = 'block';
    showToast('Samenvatting gegenereerd!', 'success');
}

function checkAndShowAISummary(professionalId) {
    // Check if summary exists and is recent
    const history = flowState.chatHistory[professionalId] || [];
    if (history.length >= 10) {
        // Auto-generate for long conversations
        document.getElementById('ai-summary').style.display = 'none';
    }
}

function regenerateSummary() {
    generateAISummary();
}

function exportSummary() {
    const summaryText = document.getElementById('ai-summary-text').textContent;
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `samenvatting-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showToast('Samenvatting geëxporteerd', 'success');
}

// HELPER FUNCTIONS
function getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    if (type.includes('zip') || type.includes('archive')) return '📦';
    return '📎';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function downloadFile(filename) {
    showToast(`Downloaden: ${filename}`, 'success');
    console.log('Download file:', filename);
}

function viewProposal(id) {
    showToast('Voorstel openen...', 'success');
    console.log('View proposal:', id);
}

function viewProposals() {
    showToast('Alle voorstellen bekijken', 'success');
}

function viewSharedFiles() {
    showToast('Gedeelde bestanden bekijken', 'success');
}

// INVITATION FLOW
function setupInvitationFlow() {
    const sendBtn = document.getElementById('send-invitation');
    const batchBtn = document.getElementById('send-batch-invite');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendInvitation);
    }
    
    if (batchBtn) {
        batchBtn.addEventListener('click', sendBatchInvitations);
    }
}

function openInvitationModal(professionalId) {
    const card = document.querySelector(`.profile-card[data-professional-id="${professionalId}"]`);
    if (!card) return;
    
    flowState.currentProfessional = professionalId;
    
    const name = card.querySelector('.profile-name').textContent;
    const title = card.querySelector('.profile-title').textContent;
    const photo = card.querySelector('.profile-photo').src;
    
    const infoDiv = document.getElementById('invitation-professional-info');
    infoDiv.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center;">
            <img src="${photo}" alt="${name}" style="width: 60px; height: 60px; border-radius: 50%;">
            <div>
                <div style="font-weight: 700; font-size: 1.125rem;">${name}</div>
                <div style="font-size: 0.875rem; color: var(--text-secondary);">${title}</div>
            </div>
        </div>
    `;
    
    // Get project data
    const projectData = JSON.parse(sessionStorage.getItem('projectData'));
    if (projectData) {
        document.getElementById('invitation-budget').value = formatBudget(projectData.budget);
    }
    
    document.getElementById('invitation-form').reset();
    openModal('invitation-modal');
}

function sendInvitation() {
    const message = document.getElementById('invitation-message').value;
    const budget = document.getElementById('invitation-budget').value;
    const timeline = document.getElementById('invitation-timeline').value;
    
    if (!message || !budget || !timeline) {
        showToast('Vul alle velden in', 'error');
        return;
    }
    
    const card = document.querySelector(`.profile-card[data-professional-id="${flowState.currentProfessional}"]`);
    const name = card.querySelector('.profile-name').textContent;
    
    const invitation = {
        professionalId: flowState.currentProfessional,
        message, budget, timeline,
        timestamp: new Date().toISOString()
    };
    
    flowState.sentInvitations.push(invitation);
    console.log('Invitation sent:', invitation);
    
    closeModal('invitation-modal');
    showToast(`Uitnodiging verstuurd naar ${name}`, 'success');
    
    // Simulate professional notification
    simulateProfessionalNotification(flowState.currentProfessional, 'invitation', invitation);
}

function sendBatchInvitations() {
    if (flowState.shortlist.length === 0) return;
    
    const count = flowState.shortlist.length;
    
    if (confirm(`Wil je een uitnodiging sturen naar alle ${count} professionals op je shortlist?`)) {
        flowState.shortlist.forEach(id => {
            const invitation = {
                professionalId: id,
                message: 'Batch uitnodiging',
                timestamp: new Date().toISOString()
            };
            flowState.sentInvitations.push(invitation);
            simulateProfessionalNotification(id, 'invitation', invitation);
        });
        
        showToast(`${count} uitnodigingen verstuurd!`, 'success');
        console.log('Batch invitations sent:', flowState.sentInvitations);
    }
}

// PROFESSIONAL NOTIFICATIONS (Simulated)
function simulateProfessionalNotification(professionalId, type, data) {
    const notifications = {
        meeting: '📅 Je bent uitgenodigd voor een kennismakingsgesprek',
        message: '💬 Je hebt een nieuw bericht ontvangen',
        invitation: '✉️ Je bent gematcht met een opdracht'
    };
    
    console.log(`\n🔔 PROFESSIONAL NOTIFICATION (ID: ${professionalId})`);
    console.log(notifications[type]);
    console.log('Data:', data);
    console.log('\nProfessional kan nu:');
    console.log('- Reageren op het bericht/uitnodiging');
    console.log('- Een voorstel sturen');
    console.log('- De kennismaking bevestigen');
    console.log('');
}

// MODAL HELPERS
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// HELPER FUNCTIONS
function formatBudget(budget) {
    return budget.replace('-', ' - ').replace('+', '+');
}

// Export for use in other files
window.flowInteractions = {
    addToShortlist,
    removeFromShortlist,
    openMeetingScheduler,
    openChatModal,
    openInvitationModal,
    closeModal
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupChatInterface();
    loadShortlistPanel();
    
    // Initialize file upload trigger
    const uploadFileBtn = document.getElementById('upload-file-btn');
    if (uploadFileBtn) {
        uploadFileBtn.addEventListener('click', function() {
            document.getElementById('file-upload').click();
        });
    }
    
    // Initialize add deliverable button
    const addDeliverableBtn = document.getElementById('add-deliverable');
    if (addDeliverableBtn) {
        addDeliverableBtn.addEventListener('click', addDeliverable);
    }
});
