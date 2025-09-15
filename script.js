document.addEventListener('DOMContentLoaded', () => {

    // --- NAVEGAÇÃO PRINCIPAL ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Verifica se o link é para abrir em outra aba (target="_blank")
            // ou se é um link externo que não deve ser interceptado pelo JS
            if (link.getAttribute('target') === '_blank' || !link.getAttribute('href').startsWith('#')) {
                // Se for para abrir em outra aba ou for um link externo sem '#' no href,
                // apenas permite o comportamento padrão do navegador.
                return;
            }

            // Para links internos (que começam com #), impedimos o comportamento padrão
            // e fazemos a navegação gerenciada pelo JavaScript.
            e.preventDefault();

            // Remove a classe 'active' de todos os links de navegação
            navLinks.forEach(l => l.classList.remove('active'));
            // Remove a classe 'active' de todas as páginas/seções
            pages.forEach(p => p.classList.remove('active'));

            // Adiciona a classe 'active' ao link clicado
            link.classList.add('active');

            // Encontra a página/seção de destino e adiciona a classe 'active' a ela
            const targetPage = document.querySelector(link.getAttribute('href'));
            if (targetPage) { // Verifica se o elemento de destino realmente existe
                targetPage.classList.add('active');
            }
        });
    });

    // --- 1. MÓDULO DE RESPIRAÇÃO ---
    const circleContainer = document.querySelector('.breathing-circle-container');
    const circle = document.querySelector('.breathing-circle');
    const breathText = document.querySelector('.breathing-text');
    let isBreathing = false;

    if (circleContainer) { // Verifica se o elemento existe antes de adicionar o listener
        circleContainer.addEventListener('click', () => {
            if (!isBreathing) {
                startBreathing();
            }
        });
    }

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
        if (verseText && verseRef) { // Verifica se os elementos existem
            const randomIndex = Math.floor(Math.random() * bibleVerses.length);
            verseText.textContent = `"${bibleVerses[randomIndex].text}"`;
            verseRef.textContent = `- ${bibleVerses[randomIndex].ref}`;
        }
    }

    if (generateVerseBtn) { // Verifica se o botão existe
        generateVerseBtn.addEventListener('click', getRandomVerse);
    }
    getRandomVerse(); // Gera um versículo ao carregar a página

    // --- MODAL / POP-UP ---
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeBtn = document.querySelector('.close-btn');
    const popupBtns = document.querySelectorAll('.popup-btn');

    function openModal(title, text) {
        if (modal && modalTitle && modalText) { // Verifica se os elementos do modal existem
            modalTitle.textContent = title;
            modalText.textContent = text;
            modal.style.display = 'flex';
        }
    }

    function closeModal() {
        if (modal) { // Verifica se o modal existe
            modal.style.display = 'none';
        }
    }

    popupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            openModal(btn.dataset.title, btn.dataset.text);
        });
    });

    if (closeBtn) { // Verifica se o botão de fechar existe
        closeBtn.addEventListener('click', closeModal);
    }
    window.addEventListener('click', (e) => {
        if (modal && e.target == modal) { // Verifica se o modal existe
            closeModal();
        }
    });

    // --- 3. MÓDULO DIÁRIO (ATUALIZADO) ---
    const journalTextarea = document.getElementById('journal-textarea');
    const journalTitleInput = document.getElementById('journal-title-input');
    const dateDisplay = document.getElementById('diary-date-display');
    const moodOptions = document.querySelectorAll('.mood-option');

    // 3.1 - Exibir a data atual
    function displayCurrentDate() {
        if (dateDisplay) { // Verifica se o elemento existe
            const now = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let formattedDate = now.toLocaleDateString('pt-BR', options);
            // Coloca a primeira letra do dia da semana em maiúscula
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            dateDisplay.textContent = formattedDate;
        }
    }
    displayCurrentDate();

    // 3.2 - Seletor de humor
    moodOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove a classe 'selected' de todos
            moodOptions.forEach(opt => opt.classList.remove('selected'));
            // Adiciona a classe 'selected' ao clicado
            option.classList.add('selected');
            // Salva o humor no localStorage
            localStorage.setItem('selectedMood', option.dataset.mood);
        });
    });

    // 3.3 - Carregar dados salvos do diário
    function loadJournalData() {
        if (journalTextarea) journalTextarea.value = localStorage.getItem('journalEntry') || '';
        if (journalTitleInput) journalTitleInput.value = localStorage.getItem('journalTitle') || '';

        const savedMood = localStorage.getItem('selectedMood');
        if(savedMood) {
            const selectedMoodElement = document.querySelector(`.mood-option[data-mood="${savedMood}"]`);
            if (selectedMoodElement) {
                selectedMoodElement.classList.add('selected');
            }
        }
    }
    loadJournalData();

    // 3.4 - Salvar dados do diário ao digitar
    if (journalTextarea) {
        journalTextarea.addEventListener('keyup', () => {
            localStorage.setItem('journalEntry', journalTextarea.value);
        });
    }
    if (journalTitleInput) {
        journalTitleInput.addEventListener('keyup', () => {
            localStorage.setItem('journalTitle', journalTitleInput.value);
        });
    }


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

    if (calendarGrid) { // Verifica se o grid do calendário existe
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
        if (checklistList) { // Verifica se a lista do checklist existe
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
    }

    if (checklistList) { // Verifica se a lista do checklist existe
        checklistList.addEventListener('click', (e) => {
            if (e.target.type === 'checkbox') {
                const index = e.target.dataset.index;
                userChecklist[index].completed = !userChecklist[index].completed;
                localStorage.setItem('userChecklist', JSON.stringify(userChecklist));
                renderChecklist();
            }
        });
    }

    renderChecklist();

    // --- 6. MÓDULO DE MÚSICA ---
    const playlistInput = document.getElementById('playlist-input');
    const savePlaylistBtn = document.getElementById('save-playlist-btn');
    const playerContainer = document.getElementById('playlist-player-container');

    function loadPlaylist() {
        const savedLink = localStorage.getItem('playlistLink');
        if (savedLink && playlistInput && playerContainer) { // Verifica se os elementos existem
            playlistInput.value = savedLink;
            embedPlaylist(savedLink);
        }
    }

    function embedPlaylist(link) {
        let embedUrl = '';
        if (link.includes('spotify.com/playlist/')) { // Correção: Spotify links geralmente têm /playlist/
            const playlistId = link.split('playlist/')[1]?.split('?')[0]; // Pega o ID após /playlist/ e antes de possíveis parâmetros
            if (playlistId) {
                // A forma de embedar Spotify pode variar, esta é uma tentativa comum
                embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`;
            }
        } else if (link.includes('youtube.com/playlist')) {
            const listId = new URL(link).searchParams.get('list');
            if (listId) {
                embedUrl = `https://www.youtube.com/embed/videoseries?list=${listId}`;
            }
        }

        if (embedUrl && playerContainer) {
            playerContainer.innerHTML = `<iframe src="${embedUrl}" width="100%" height="300" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>`;
        } else if (playerContainer) {
            playerContainer.innerHTML = `<p>Link inválido ou não suportado. Tente um link de playlist do Spotify ou YouTube.</p>`;
        }
    }

    if (savePlaylistBtn && playlistInput) { // Verifica se os elementos existem
        savePlaylistBtn.addEventListener('click', () => {
            const link = playlistInput.value;
            if (link) {
                localStorage.setItem('playlistLink', link);
                embedPlaylist(link);
            }
        });
    }

    loadPlaylist();

});
