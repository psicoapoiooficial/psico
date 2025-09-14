document.addEventListener('DOMContentLoaded', () => {

    // --- NAVEGAÇÃO PRINCIPAL ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove a classe 'active' de todos
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));

            // Adiciona a classe 'active' ao link clicado e à página correspondente
            link.classList.add('active');
            const targetPage = document.querySelector(link.getAttribute('href'));
            targetPage.classList.add('active');
        });
    });

    // --- 1. MÓDULO DE RESPIRAÇÃO ---
    const circleContainer = document.querySelector('.breathing-circle-container');
    const circle = document.querySelector('.breathing-circle');
    const breathText = document.querySelector('.breathing-text');
    let isBreathing = false;

    circleContainer.addEventListener('click', () => {
        if (!isBreathing) {
            startBreathing();
        }
    });

    function startBreathing() {
        isBreathing = true;
        breathText.textContent = "Inspire...";
        circle.style.animation = 'grow 4s ease-in-out forwards';

        setTimeout(() => {
            breathText.textContent = "Segure";
        }, 4000);

        setTimeout(() => {
            breathText.textContent = "Expire...";
            circle.style.animation = 'shrink 6s ease-in-out forwards';
        }, 6000);

        // Reinicia o ciclo
        setTimeout(() => {
            isBreathing = false;
            breathText.textContent = "Começar";
            circle.style.animation = 'none';
        }, 12000);
    }

    // --- 2. MÓDULO BÍBLICO ---
    const verseText = document.getElementById('daily-verse-text');
    const verseRef = document.getElementById('daily-verse-ref');
    const generateVerseBtn = document.getElementById('generate-verse-btn');

    const bibleVerses = [
        { text: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
        { text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
        { text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmos 46:1" },
        { text: "O choro pode durar uma noite, mas a alegria vem pela manhã.", ref: "Salmos 30:5" },
        { text: "Lancem sobre ele toda a sua ansiedade, porque ele tem cuidado de vocês.", ref: "1 Pedro 5:7" }
    ];

    function getRandomVerse() {
        const randomIndex = Math.floor(Math.random() * bibleVerses.length);
        verseText.textContent = `"${bibleVerses[randomIndex].text}"`;
        verseRef.textContent = `- ${bibleVerses[randomIndex].ref}`;
    }

    generateVerseBtn.addEventListener('click', getRandomVerse);
    getRandomVerse(); // Gera um versículo ao carregar a página

    // --- MODAL / POP-UP ---
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeBtn = document.querySelector('.close-btn');
    const popupBtns = document.querySelectorAll('.popup-btn');

    function openModal(title, text) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    popupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.title, btn.dataset.text);
        });
    });
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeModal();
        }
    });

    // --- 3. MÓDULO DIÁRIO ---
    const journalTextarea = document.getElementById('journal-textarea');

    // Carregar o diário salvo
    journalTextarea.value = localStorage.getItem('journalEntry') || '';

    // Salvar no diário ao digitar
    journalTextarea.addEventListener('keyup', () => {
        localStorage.setItem('journalEntry', journalTextarea.value);
    });

    // --- 4. MÓDULO CALENDÁRIO ---
    const calendarGrid = document.getElementById('calendar-grid');
    const healthyActivities = [
        "Faça uma caminhada de 15 minutos.",
        "Beba um copo de água agora.",
        "Faça 5 minutos de alongamento.",
        "Escreva 3 coisas pelas quais você é grato.",
        "Ouça uma música que te deixe feliz.",
        "Medite por 3 minutos em silêncio.",
        "Organize uma pequena área do seu quarto.",
        "Mande uma mensagem para um amigo.",
        "Leia uma página de um livro.",
        "Planeje uma refeição saudável."
    ];

    for (let i = 1; i <= 31; i++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        day.textContent = i;
        day.addEventListener('click', () => {
            const randomActivity = healthyActivities[Math.floor(Math.random() * healthyActivities.length)];
            openModal(`Atividade para o dia ${i}`, randomActivity);
        });
        calendarGrid.appendChild(day);
    }

    // --- 5. MÓDULO CHECKLIST ---
    const checklistList = document.getElementById('checklist-list');
    const checklistItems = [
        { text: "Beber 2 litros de água", completed: false },
        { text: "Fazer 10 minutos de exercício", completed: false },
        { text: "Ler por 15 minutos", completed: false },
        { text: "Meditar por 5 minutos", completed: false },
        { text: "Agradecer por 3 coisas hoje", completed: false }
    ];

    let userChecklist = JSON.parse(localStorage.getItem('userChecklist')) || checklistItems;

    function renderChecklist() {
        checklistList.innerHTML = '';
        userChecklist.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.toggle('completed', item.completed);
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''} data-index="${index}">
                <label>${item.text}</label>
            `;
            checklistList.appendChild(li);
        });
    }

    checklistList.addEventListener('click', (e) => {
        if (e.target.type === 'checkbox') {
            const index = e.target.dataset.index;
            userChecklist[index].completed = !userChecklist[index].completed;
            localStorage.setItem('userChecklist', JSON.stringify(userChecklist));
            renderChecklist();
        }
    });

    renderChecklist();

    // --- 6. MÓDULO DE MÚSICA ---
    const playlistInput = document.getElementById('playlist-input');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const playerContainer = document.getElementById('playlist-player-container');

    function loadPlaylist() {
        const savedLink = localStorage.getItem('playlistLink');
        if (savedLink) {
            playlistInput.value = savedLink;
            embedPlaylist(savedLink);
        }
    }

    function embedPlaylist(link) {
        let embedUrl = '';
        if (link.includes('spotify.com')) {
            const playlistId = new URL(link).pathname.split('/').pop();
            embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
        } else if (link.includes('youtube.com/playlist')) {
            const listId = new URL(link).searchParams.get('list');
            embedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`;
        }

        if (embedUrl) {
            playerContainer.innerHTML = `<iframe src="${embedUrl}" allow="encrypted-media"></iframe>`;
        } else {
            playerContainer.innerHTML = `<p>Link inválido ou não suportado. Tente um link de playlist do Spotify ou YouTube.</p>`;
        }
    }

    savePlaylistBtn.addEventListener('click', () => {
        const link = playlistInput.value;
        if (link) {
            localStorage.setItem('playlistLink', link);
            embedPlaylist(link);
        }
    });

    loadPlaylist();

});