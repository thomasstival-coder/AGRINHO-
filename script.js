/* ===== MENU RESPONSIVO ===== */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.classList.toggle('active');
});

// Fechar menu ao clicar em um link
nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
    });
});

/* ===== HEADER SCROLL ===== */
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
});

/* ===== CALCULADORA DE IMPACTO ===== */
const calcBtn = document.getElementById('calcBtn');
const calcResult = document.getElementById('calcResult');

calcBtn.addEventListener('click', () => {
    const area = parseFloat(document.getElementById('area').value) || 0;
    const irrigacao = document.getElementById('irrigacao').value;
    const energia = document.getElementById('energia').value;
    const precisao = document.getElementById('precisao').value;

    if (area <= 0) {
        calcResult.innerHTML = '<p>Por favor, informe uma área válida.</p>';
        return;
    }

    // Score base: 100 = máximo impacto negativo, 0 = ideal
    let score = 70; // base média

    // Irrigação
    if (irrigacao === 'inteligente') {
        score -= 20;
    } else {
        score += 10;
    }

    // Energia
    if (energia === 'renovavel') {
        score -= 15;
    } else {
        score += 10;
    }

    // Agricultura de precisão
    if (precisao === 'sim') {
        score -= 20;
    } else {
        score += 5;
    }

    // Ajuste por área (propriedades maiores têm mais impacto potencial)
    if (area > 500) score += 5;
    if (area > 1000) score += 5;

    score = Math.max(0, Math.min(100, score));

    let nivel, cor, dicas;

    if (score <= 30) {
        nivel = 'Excelente';
        cor = '#95d5b2';
        dicas = 'Sua propriedade está no caminho certo! Continue investindo em tecnologias limpas e práticas regenerativas.';
    } else if (score <= 50) {
        nivel = 'Bom';
        cor = '#e9c46a';
        dicas = 'Há espaço para melhorar. Considere adotar irrigação inteligente ou energia renovável.';
    } else if (score <= 70) {
        nivel = 'Moderado';
        cor = '#f4a261';
        dicas = 'O impacto ainda é significativo. Priorize agricultura de precisão e redução do uso de água.';
    } else {
        nivel = 'Alto impacto';
        cor = '#e76f51';
        dicas = 'É urgente adotar práticas sustentáveis. Comece pela irrigação eficiente e fontes de energia limpa.';
    }

    const aguaEconomizada = irrigacao === 'inteligente' ? Math.round(area * 1.5) : 0;
    const co2Reduzido = energia === 'renovavel' ? Math.round(area * 0.8) : 0;
    const insumosReduzidos = precisao === 'sim' ? Math.round(area * 0.3) : 0;

    calcResult.innerHTML = `
        <h4>Resultado do impacto</h4>
        <div class="score-big" style="color: ${cor}">${score}</div>
        <p><strong>Nível:</strong> ${nivel}</p>
        <p style="margin-top:12px">${dicas}</p>
        <hr style="border-color:rgba(255,255,255,0.2); margin:16px 0">
        <p>💧 Economia potencial de água: <strong>${aguaEconomizada > 0 ? aguaEconomizada + ' mil m³/ano' : '—'}</strong></p>
        <p>🌍 Redução estimada de CO₂: <strong>${co2Reduzido > 0 ? co2Reduzido + ' t/ano' : '—'}</strong></p>
        <p>🧪 Redução de insumos: <strong>${insumosReduzidos > 0 ? insumosReduzidos + '%' : '—'}</strong></p>
    `;
});

/* ===== QUIZ ===== */
const quizData = [
    {
        question: 'O que é agricultura de precisão?',
        options: [
            'Plantar o máximo possível em qualquer área',
            'Uso de dados e sensores para otimizar insumos e reduzir desperdícios',
            'Irrigação manual tradicional',
            'Uso exclusivo de agrotóxicos'
        ],
        correct: 1
    },
    {
        question: 'Qual prática ajuda a conservar o solo?',
        options: [
            'Monocultura contínua sem rotação',
            'Queimadas frequentes',
            'Rotação de culturas e cobertura do solo',
            'Desmatamento para expansão'
        ],
        correct: 2
    },
    {
        question: 'Qual benefício principal da irrigação inteligente?',
        options: [
            'Aumentar o uso de água',
            'Economia de água com controle automatizado',
            'Eliminar completamente a irrigação',
            'Usar apenas água de rios'
        ],
        correct: 1
    },
    {
        question: 'Como os drones ajudam na agricultura sustentável?',
        options: [
            'Substituindo completamente os agricultores',
            'Monitorando plantações e reduzindo o uso de insumos',
            'Aumentando o desmatamento',
            'Apenas para fotos promocionais'
        ],
        correct: 1
    },
    {
        question: 'O que caracteriza a agricultura regenerativa?',
        options: [
            'Explorar o solo até o esgotamento',
            'Práticas que recuperam o solo e aumentam a biodiversidade',
            'Uso intensivo de fertilizantes químicos',
            'Produzir apenas para exportação'
        ],
        correct: 1
    }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const quizQuestion = document.getElementById('quizQuestion');
const quizOptions = document.getElementById('quizOptions');
const quizProgress = document.getElementById('quizProgress');
const quizScore = document.getElementById('quizScore');
const quizNext = document.getElementById('quizNext');
const quizRestart = document.getElementById('quizRestart');

function loadQuestion() {
    answered = false;
    quizNext.style.display = 'none';
    quizScore.style.display = 'none';
    quizRestart.style.display = 'none';

    const q = quizData[currentQuestion];
    quizQuestion.textContent = q.question;
    quizProgress.textContent = `Pergunta ${currentQuestion + 1} de ${quizData.length}`;

    quizOptions.innerHTML = '';
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.addEventListener('click', () => selectAnswer(index));
        quizOptions.appendChild(btn);
    });
}

function selectAnswer(index) {
    if (answered) return;
    answered = true;

    const q = quizData[currentQuestion];
    const buttons = quizOptions.querySelectorAll('.quiz-option');

    buttons.forEach((btn, i) => {
        btn.style.pointerEvents = 'none';
        if (i === q.correct) {
            btn.classList.add('correct');
        } else if (i === index && index !== q.correct) {
            btn.classList.add('wrong');
        }
    });

    if (index === q.correct) {
        score++;
    }

    quizNext.style.display = 'inline-block';
}

quizNext.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showScore();
    }
});

function showScore() {
    quizQuestion.textContent = '';
    quizOptions.innerHTML = '';
    quizProgress.textContent = '';
    quizNext.style.display = 'none';
    quizScore.style.display = 'block';
    quizRestart.style.display = 'inline-block';

    const percent = Math.round((score / quizData.length) * 100);
    let mensagem;

    if (percent === 100) {
        mensagem = 'Perfeito! Você domina o tema da sustentabilidade no campo! 🌱';
    } else if (percent >= 60) {
        mensagem = 'Muito bem! Você tem bons conhecimentos sobre o assunto.';
    } else {
        mensagem = 'Continue estudando! A sustentabilidade é um tema essencial para o futuro.';
    }

    quizScore.innerHTML = `
        <h4>Você acertou ${score} de ${quizData.length}</h4>
        <p style="font-size:1.5rem; margin:10px 0">${percent}%</p>
        <p>${mensagem}</p>
    `;
}

quizRestart.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    loadQuestion();
});

// Iniciar quiz
loadQuestion();

/* ===== GALERIA FILTROS ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

/* ===== MODAL GALERIA ===== */
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        modal.classList.add('active');
        modalImg.src = img.src.replace('w=600', 'w=1200');
        modalCaption.textContent = caption ? caption.textContent : '';
    });
});

modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modal.classList.remove('active');
    }
});

/* ===== FORMULÁRIO DE CONTATO ===== */
const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensagem = document.getElementById('mensagem').value.trim();

    if (!nome || !email || !mensagem) {
        formFeedback.textContent = 'Por favor, preencha todos os campos.';
        formFeedback.className = 'form-feedback error';
        return;
    }

    // Simulação de envio (frontend only)
    formFeedback.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada. Juntos construímos um futuro mais sustentável. 🌱`;
    formFeedback.className = 'form-feedback success';
    contactForm.reset();

    setTimeout(() => {
        formFeedback.textContent = '';
        formFeedback.className = 'form-feedback';
    }, 6000);
});
