// Channel Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get channel from URL
    const urlParams = new URLSearchParams(window.location.search);
    const channel = urlParams.get('channel') || 'copywriting';

    // Channel data
    const channelData = {
        copywriting: {
            name: 'Copywriting',
            description: 'Alles over copywriting, storytelling en overtuigende teksten',
            members: 127,
            messages: [
                {
                    author: 'Tom Bach',
                    avatar: 'TB',
                    time: '10:32',
                    text: 'Hoi allemaal! Wat zijn jullie favoriete copywriting frameworks? Ik gebruik zelf vaak AIDA en PAS.'
                },
                {
                    author: 'Sarah Johnson',
                    avatar: 'SJ',
                    time: '10:45',
                    text: 'AIDA is klassiek! Ik ben ook fan van de "Before-After-Bridge" formule. Werkt heel goed voor case studies.'
                },
                {
                    author: 'Marc Visser',
                    avatar: 'MV',
                    time: '11:02',
                    text: 'Voor B2B gebruik ik vaak het 4 P\'s framework: Picture, Promise, Prove, Push. Heel effectief voor landingspagina\'s.'
                },
                {
                    author: 'Lisa Kazemier',
                    avatar: 'LK',
                    time: '11:15',
                    text: 'Interessant! Heeft iemand ervaring met AI tools voor copywriting? Ik experimenteer nu met ChatGPT.'
                },
                {
                    author: 'Tom Bach',
                    avatar: 'TB',
                    time: '11:28',
                    text: 'Zeker! ChatGPT is geweldig voor brainstormen, maar menselijke creativiteit blijft essentieel. Ik gebruik het vooral voor variaties op headlines.'
                }
            ]
        },
        webdesign: {
            name: 'Webdesign',
            description: 'UX/UI design, webdevelopment en alles daartussenin',
            members: 89,
            messages: [
                {
                    author: 'Marc Visser',
                    avatar: 'MV',
                    time: '09:15',
                    text: 'Nieuwe Figma update is out! De variable fonts feature is echt next level 🚀'
                },
                {
                    author: 'Sarah Johnson',
                    avatar: 'SJ',
                    time: '09:42',
                    text: 'Ja! En de auto-layout verbeteringen maken prototyping zoveel sneller. Ben je al aan het experimenten?'
                },
                {
                    author: 'Tom Bach',
                    avatar: 'TB',
                    time: '10:05',
                    text: 'Vraagje: welke design system gebruiken jullie voor jullie projecten? Ik overweeg om Material Design te adopteren.'
                },
                {
                    author: 'Lisa Kazemier',
                    avatar: 'LK',
                    time: '10:20',
                    text: 'Wij gebruiken Tailwind CSS met een custom design system. Geeft veel flexibiliteit en consistentie.'
                },
                {
                    author: 'Marc Visser',
                    avatar: 'MV',
                    time: '10:35',
                    text: 'Voor grotere projecten is Material Design een solide keuze. Voor meer unieke branding zou ik custom gaan.'
                }
            ]
        },
        stemcoach: {
            name: 'Stemcoach',
            description: 'Tips en tricks voor voice-overs, presentaties en stemtraining',
            members: 54,
            messages: [
                {
                    author: 'Lisa Kazemier',
                    avatar: 'LK',
                    time: '14:20',
                    text: 'Net een opname sessie gedaan voor een podcast. Welke microfoon setup gebruiken jullie?'
                },
                {
                    author: 'Tom Bach',
                    avatar: 'TB',
                    time: '14:35',
                    text: 'Ik gebruik een Shure SM7B met een Cloudlifter. Klinkt professioneel en filtert achtergrondgeluiden goed.'
                },
                {
                    author: 'Sarah Johnson',
                    avatar: 'SJ',
                    time: '14:50',
                    text: 'Voor beginners: Blue Yeti is een goede betaalbare optie! Heeft verschillende opnamepatronen.'
                },
                {
                    author: 'Marc Visser',
                    avatar: 'MV',
                    time: '15:10',
                    text: 'Tip: vergeet de akoestiek van je ruimte niet! Een goede mic in een slechte ruimte klinkt minder dan een budget mic in een goede ruimte.'
                },
                {
                    author: 'Lisa Kazemier',
                    avatar: 'LK',
                    time: '15:25',
                    text: 'Helemaal mee eens! Ik heb foam panels aan de muur en het verschil is enorm. Thanks voor de tips! 🎙️'
                }
            ]
        }
    };

    // Load channel data
    const currentChannel = channelData[channel];
    document.getElementById('channelName').textContent = `# ${currentChannel.name.toLowerCase()}`;
    document.getElementById('channelDescription').textContent = currentChannel.description;
    document.getElementById('memberCount').textContent = `${currentChannel.members} leden`;

    // Update active channel in sidebar
    const sidebarChannels = document.querySelectorAll('.sidebar-channel');
    sidebarChannels.forEach(channelLink => {
        if (channelLink.dataset.channel === channel) {
            channelLink.classList.add('active');
            // Remove unread badge when active
            const badge = channelLink.querySelector('.unread-badge');
            if (badge) badge.remove();
        }
    });

    // Load messages
    const messagesContainer = document.getElementById('messagesContainer');
    currentChannel.messages.forEach(msg => {
        const messageEl = createMessageElement(msg);
        messagesContainer.appendChild(messageEl);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Message form handler
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const text = messageInput.value.trim();
        
        if (text) {
            const now = new Date();
            const newMessage = {
                author: 'Jij',
                avatar: 'JD',
                time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
                text: text
            };

            const messageEl = createMessageElement(newMessage);
            messagesContainer.appendChild(messageEl);
            
            // Clear input
            messageInput.value = '';
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Simulate a response after 2 seconds
            setTimeout(() => {
                const responses = [
                    { author: 'Tom Bach', avatar: 'TB', text: 'Goed punt! Daar ben ik het helemaal mee eens.' },
                    { author: 'Sarah Johnson', avatar: 'SJ', text: 'Interessant! Vertel eens meer? 🤔' },
                    { author: 'Marc Visser', avatar: 'MV', text: 'Dat is precies wat ik ook dacht!' },
                    { author: 'Lisa Kazemier', avatar: 'LK', text: 'Super nuttige info, dankjewel! 👍' }
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                const responseTime = new Date();
                randomResponse.time = `${responseTime.getHours()}:${String(responseTime.getMinutes()).padStart(2, '0')}`;
                
                const responseEl = createMessageElement(randomResponse);
                messagesContainer.appendChild(responseEl);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 2000);
        }
    });

    // Auto-focus input
    messageInput.focus();
});

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${message.avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-author">${message.author}</span>
                <span class="message-time">${message.time}</span>
            </div>
            <div class="message-text">${message.text}</div>
        </div>
    `;
    
    return messageDiv;
}
