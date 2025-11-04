// Spanish Learning App - Interactive Functionality
class SpanishLearningApp {
    constructor() {
        // Vocabulary data from provided JSON
        this.vocabularyData = {
            "Essential_Greetings": {
                "English": ["Hello", "Goodbye", "Thank you", "Please", "Excuse me", "Good morning", "Good afternoon", "Good night", "How are you?", "I'm fine"],
                "Spanish": ["Hola", "Adiós", "Gracias", "Por favor", "Con permiso", "Buenos días", "Buenas tardes", "Buenas noches", "¿Cómo estás?", "Estoy bien"],
                "Pronunciation": ["OH-lah", "ah-DYOHS", "GRAH-thyahs", "por fah-VOR", "kon per-MEE-so", "BWAY-nos DEE-ahs", "BWAY-nas TAR-des", "BWAY-nas NO-ches", "KOH-moh ehs-TAHS", "ehs-TOY bee-EHN"]
            },
            "Family_Members": {
                "English": ["Mother/Mom", "Father/Dad", "Sister", "Brother", "Grandmother", "Grandfather", "Aunt", "Uncle", "Cousin", "Baby"],
                "Spanish": ["Madre/Mamá", "Padre/Papá", "Hermana", "Hermano", "Abuela", "Abuelo", "Tía", "Tío", "Primo/Prima", "Bebé"],
                "Pronunciation": ["MAH-dreh/mah-MAH", "PAH-dreh/pah-PAH", "er-MAH-nah", "er-MAH-no", "ah-BWAY-lah", "ah-BWAY-lo", "TEE-ah", "TEE-oh", "PREE-mo/PREE-mah", "beh-BEH"]
            },
            "Spatial_Words": {
                "English": ["On/On top of", "Under", "Next to", "Behind", "In front of", "Inside", "Outside", "Between", "Above", "Below"],
                "Spanish": ["Encima de/Sobre", "Debajo de", "Al lado de", "Detrás de", "Delante de", "Dentro de", "Fuera de", "Entre", "Arriba de", "Abajo de"],
                "Pronunciation": ["en-SEE-mah deh", "deh-BAH-ho deh", "ahl LAH-do deh", "deh-TRAHS deh", "deh-LAHN-teh deh", "DEN-tro deh", "FWAY-rah deh", "EN-treh", "ah-REE-bah deh", "ah-BAH-ho deh"]
            },
            "Feelings_Emotions": {
                "English": ["Happy", "Sad", "Angry", "Tired", "Hungry", "Thirsty", "Excited", "Scared", "Hot", "Cold"],
                "Spanish": ["Feliz/Contento", "Triste", "Enojado", "Cansado", "Hambriento", "Sediento", "Emocionado", "Asustado", "Caliente", "Frío"],
                "Pronunciation": ["feh-LEES/kon-TEN-to", "TREES-teh", "eh-no-HAH-do", "kan-SAH-do", "am-bree-EN-to", "seh-dee-EN-to", "eh-mo-see-o-NAH-do", "ah-soos-TAH-do", "ka-lee-EN-teh", "FREE-o"]
            },
            "Body_Parts": {
                "English": ["Head", "Hair", "Eyes", "Nose", "Mouth", "Hands", "Feet", "Arms", "Legs", "Back"],
                "Spanish": ["Cabeza", "Pelo", "Ojos", "Nariz", "Boca", "Manos", "Pies", "Brazos", "Piernas", "Espalda"],
                "Pronunciation": ["ka-BEH-sah", "PEH-lo", "OH-hos", "nah-REES", "BOH-ka", "MAH-nos", "pee-EHS", "BRAH-sos", "pee-ER-nas", "ehs-PAHL-da"]
            },
            "Colors": {
                "English": ["Red", "Blue", "Yellow", "Green", "Black", "White", "Pink", "Orange", "Purple", "Brown"],
                "Spanish": ["Rojo", "Azul", "Amarillo", "Verde", "Negro", "Blanco", "Rosa", "Naranja", "Morado", "Marrón"],
                "Pronunciation": ["ROH-ho", "ah-SOOL", "ah-mah-REE-yo", "VER-deh", "NEH-gro", "BLAHN-ko", "ROH-sa", "nah-RAHN-ha", "mo-RAH-do", "mah-ROHN"]
            },
            "Food_Basics": {
                "English": ["Water", "Milk", "Bread", "Apple", "Banana", "Chicken", "Rice", "Beans", "Cheese", "Egg"],
                "Spanish": ["Agua", "Leche", "Pan", "Manzana", "Plátano", "Pollo", "Arroz", "Frijoles", "Queso", "Huevo"],
                "Pronunciation": ["AH-gwa", "LEH-cheh", "pahn", "man-SAH-na", "PLAH-ta-no", "POH-yo", "ah-ROHS", "free-HOH-les", "KEH-so", "WAY-vo"]
            },
            "Daily_Actions": {
                "English": ["Wake up", "Get dressed", "Eat breakfast", "Go to school", "Play", "Take a bath", "Brush teeth", "Go to bed", "Walk", "Run"],
                "Spanish": ["Despertarse", "Vestirse", "Desayunar", "Ir a la escuela", "Jugar", "Bañarse", "Lavarse los dientes", "Acostarse", "Caminar", "Correr"],
                "Pronunciation": ["des-per-TAR-seh", "ves-TEER-seh", "deh-sah-yu-NAHR", "eer ah lah ehs-KWAY-lah", "hu-GAHR", "bah-NYAR-seh", "la-VAR-seh los dee-EN-tes", "ah-kos-TAR-seh", "ka-mee-NAHR", "ko-RRER"]
            }
        };

        // Daily phrases data
        this.dailyPhrasesData = {
            "Morning": {
                "English": ["Good morning!", "Time to wake up", "Get dressed", "Let's eat breakfast", "Brush your teeth", "Where are your shoes?", "Ready to go?", "Have a great day!"],
                "Spanish": ["¡Buenos días!", "Hora de levantarse", "Vístete", "Vamos a desayunar", "Lávate los dientes", "¿Dónde están tus zapatos?", "¿Listo para ir?", "¡Que tengas un buen día!"],
                "Pronunciation": ["BWAY-nos DEE-ahs", "OH-rah deh leh-van-TAR-seh", "VEES-teh-teh", "VAH-mos ah deh-sah-yu-NAHR", "LAH-va-teh los dee-EN-tes", "DOHN-deh ehs-TAHN toos sah-PAH-tos", "LEES-to PAH-rah eer", "keh TEN-gahs oon bwen DEE-ah"]
            },
            "Meals": {
                "English": ["Are you hungry?", "What do you want to eat?", "Sit down please", "More water?", "How does it taste?", "Finish your food", "May I have more?", "I'm full"],
                "Spanish": ["¿Tienes hambre?", "¿Qué quieres comer?", "Siéntate por favor", "¿Más agua?", "¿Cómo sabe?", "Termina tu comida", "¿Puedo tener más?", "Estoy lleno"],
                "Pronunciation": ["tee-EH-nes AHM-breh", "keh kee-EH-res ko-MEHR", "see-EN-ta-teh por fah-VOR", "mahs AH-gwa", "KOH-mo SAH-beh", "ter-MEE-nah too ko-MEE-dah", "PWAY-do teh-NEHR mahs", "ehs-TOY YEH-no"]
            },
            "Playtime": {
                "English": ["Let's play!", "Where is the toy?", "Share with your sister", "Clean up time", "Be careful", "That's fun!", "Let's go outside", "Come here"],
                "Spanish": ["¡Vamos a jugar!", "¿Dónde está el juguete?", "Comparte con tu hermana", "Hora de limpiar", "Ten cuidado", "¡Qué divertido!", "Vamos afuera", "Ven acá"],
                "Pronunciation": ["VAH-mos ah hu-GAHR", "DOHN-deh ehs-TAH el hu-GEH-teh", "kom-PAR-teh kon too er-MAH-nah", "OH-rah deh lim-pee-AHR", "ten kwee-DAH-do", "keh dee-ver-TEE-do", "VAH-mos ah-FWAY-rah", "ven ah-KAH"]
            },
            "Bedtime": {
                "English": ["Time for bath", "Put on pajamas", "Brush your teeth", "Story time", "Sweet dreams", "Good night", "I love you", "Sleep well"],
                "Spanish": ["Hora del baño", "Ponte la pijama", "Lávate los dientes", "Hora del cuento", "Dulces sueños", "Buenas noches", "Te amo", "Duerme bien"],
                "Pronunciation": ["OH-rah del BAH-nyo", "PON-teh lah pee-HAH-mah", "LAH-va-teh los dee-EN-tes", "OH-rah del KWEN-to", "DOOL-ses SWAY-nyos", "BWAY-nas NO-ches", "teh AH-mo", "DWER-meh bee-EN"]
            }
        };

        // Mexican expressions
        this.mexicanExpressions = {
            "English": ["What's up?", "Really?", "Cool/Awesome", "Right now", "How's it going?", "To chat/talk", "Kid/Child", "Wow!"],
            "Spanish": ["¿Qué onda?", "¿Neta?", "Qué padre", "Ahorita", "¿Cómo te va?", "Platicar", "Chamaco", "¡Híjole!"],
            "Usage": ["Very informal greeting", "Informal way to say really", "Family-friendly way to say cool", "Can mean now or later", "More natural than ¿Cómo estás?", "More common than hablar in Mexico", "Informal way to say kid", "Expression of surprise"]
        };

        // Parent tips
        this.parentTips = [
            "Start with 5-10 words per week and build gradually",
            "Use Spanish during daily routines like meals and bedtime",
            "Don't worry about perfect pronunciation - consistency matters more",
            "Celebrate any attempt at Spanish with praise",
            "Make it fun with songs, games, and positive reinforcement",
            "Connect Spanish to activities your children already enjoy",
            "Be patient - language acquisition takes time",
            "Model correct usage instead of correcting mistakes directly"
        ];

        // App state
        this.currentSection = 'welcome';
        this.currentCategory = null;
        this.currentPhrasesTab = 'Morning';
        this.quizData = [];
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        this.starsEarned = 0;
        this.wordsExplored = 0;

        /* =====================
         * Daily Stats Tracking
         * ===================== */
        this.dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');

        // Load any saved vocabulary from localStorage
        const storedVocab = localStorage.getItem('vocabData');
        if (storedVocab) {
            try {
                this.vocabularyData = JSON.parse(storedVocab);
            } catch (e) {
                console.error('Failed parsing saved vocab, using defaults', e);
            }
        } else {
            // Persist defaults on first load so later edits always have baseline
            localStorage.setItem('vocabData', JSON.stringify(this.vocabularyData));
        }

        this.init();
        // Ensure today's dashboard is shown if quiz section visited first
        this.updateStatsDashboard();
    }

    init() {
        this.setupEventListeners();
        this.setDailyWord();
        this.loadParentTips();
        this.loadMexicanExpressions();
        this.loadPhrasesContent('Morning');
        this.updateProgressDisplay();
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            // ManageVocab nav button handled automatically via data-section attribute

            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Back buttons
        document.querySelectorAll('.back-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.dataset.target;
                this.showSection(target);
            });
        });

        // Category cards
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.showCategoryDetail(category);
            });
        });

        // Phrase tabs
        document.querySelectorAll('.phrase-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const routine = e.target.dataset.routine;
                this.switchPhrasesTab(routine);
            });
        });

        // Quiz buttons
        document.querySelectorAll('.quiz-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.type;
                this.startQuiz(type);
            });
        });

        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetQuiz();
        });

        /* =======================
         * Manage Vocabulary Events
         * ======================= */
        const categorySelect = document.getElementById('categorySelect');
        const addRowBtn = document.getElementById('addRowBtn');
        const saveVocabBtn = document.getElementById('saveVocabBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');
        const importCsvBtn = document.getElementById('importCsvBtn');
        const csvImportInput = document.getElementById('csvImportInput');

        if (categorySelect) {
            categorySelect.addEventListener('change', () => {
                this.renderWordTable(categorySelect.value);
            });
        }
        if (addRowBtn) {
            addRowBtn.addEventListener('click', () => {
                this.addRowToTable();
            });
        }
        if (saveVocabBtn) {
            saveVocabBtn.addEventListener('click', () => {
                this.saveCurrentCategory();
            });
        }
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                this.exportCurrentCategory();
            });
        }
        if (importCsvBtn) {
            importCsvBtn.addEventListener('click', () => csvImportInput.click());
        }
        if (csvImportInput) {
            csvImportInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = evt => {
                        this.importCsvToCategory(evt.target.result);
                    };
                    reader.readAsText(file);
                }
            });
        }

    }

    showSection(sectionName) {
        // Hook for updating stats dashboard when entering quiz section
        if (sectionName === 'quiz') {
            this.updateStatsDashboard();
        }

        // Special hook for Manage Vocab: populate UI when shown
        if (sectionName === 'manageVocab') {
            this.populateCategorySelect();
            // render table for selected category after populate
            const categorySelect = document.getElementById('categorySelect');
            if (categorySelect && categorySelect.value) {
                this.renderWordTable(categorySelect.value);
            }
        }

        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName + 'Section');
        if (targetSection) {
            targetSection.classList.remove('hidden');
            this.currentSection = sectionName;
        }
    }

    showCategoryDetail(category) {
        this.currentCategory = category;
        
        // Update category title
        const categoryTitle = document.getElementById('categoryTitle');
        const friendlyName = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        categoryTitle.textContent = friendlyName;

        // Load words for this category
        this.loadCategoryWords(category);

        // Show category detail section
        this.showSection('categoryDetail');

        // Track words explored
        const added = this.vocabularyData[category].English.length;
        this.wordsExplored += added;
        this.updateDailyStats('words', added);
        this.updateProgressDisplay();
    }

    loadCategoryWords(category) {
        const wordsList = document.getElementById('wordsList');
        const categoryData = this.vocabularyData[category];
        
        let html = '';
        for (let i = 0; i < categoryData.English.length; i++) {
            html += `
                <div class="word-item">
                    <div class="word-english">${categoryData.English[i]}</div>
                    <div class="word-spanish">${categoryData.Spanish[i]}</div>
                    <div class="word-pronunciation">${categoryData.Pronunciation[i]}</div>
                </div>
            `;
        }
        
        wordsList.innerHTML = html;
    }

    switchPhrasesTab(routine) {
        // Update active tab
        document.querySelectorAll('.phrase-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-routine="${routine}"]`).classList.add('active');

        // Load phrases for this routine
        this.loadPhrasesContent(routine);
        this.currentPhrasesTab = routine;
    }

    loadPhrasesContent(routine) {
        const phrasesContent = document.getElementById('phrasesContent');
        const routineData = this.dailyPhrasesData[routine];
        
        let html = '';
        for (let i = 0; i < routineData.English.length; i++) {
            html += `
                <div class="phrase-item">
                    <div class="phrase-english">${routineData.English[i]}</div>
                    <div class="phrase-spanish">${routineData.Spanish[i]}</div>
                    <div class="phrase-pronunciation">${routineData.Pronunciation[i]}</div>
                </div>
            `;
        }
        
        phrasesContent.innerHTML = html;
    }

    loadMexicanExpressions() {
        const expressionsGrid = document.getElementById('expressionsGrid');
        let html = '';
        
        for (let i = 0; i < this.mexicanExpressions.English.length; i++) {
            html += `
                <div class="expression-item">
                    <div class="expression-english">${this.mexicanExpressions.English[i]}</div>
                    <div class="expression-spanish">${this.mexicanExpressions.Spanish[i]}</div>
                    <div class="expression-usage">${this.mexicanExpressions.Usage[i]}</div>
                </div>
            `;
        }
        
        expressionsGrid.innerHTML = html;
    }

    loadParentTips() {
        const implementationTips = document.getElementById('implementationTips');
        let html = '';
        
        this.parentTips.forEach(tip => {
            html += `<li>${tip}</li>`;
        });
        
        implementationTips.innerHTML = html;
    }

    setDailyWord() {
        // Create a combined array of all words
        const allWords = [];
        Object.keys(this.vocabularyData).forEach(category => {
            const categoryData = this.vocabularyData[category];
            for (let i = 0; i < categoryData.English.length; i++) {
                allWords.push({
                    english: categoryData.English[i],
                    spanish: categoryData.Spanish[i],
                    pronunciation: categoryData.Pronunciation[i]
                });
            }
        });

        // Select a word based on the current date to ensure consistency
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const wordIndex = dayOfYear % allWords.length;
        const dailyWord = allWords[wordIndex];

        // Update the display
        document.getElementById('dailyWordSpanish').textContent = dailyWord.spanish;
        document.getElementById('dailyWordEnglish').textContent = dailyWord.english;
        document.getElementById('dailyWordPronunciation').textContent = dailyWord.pronunciation;
    }

    startQuiz(type) {
        this.prepareQuizData(type);
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        
        // Show quiz game
        document.getElementById('quizStart').classList.add('hidden');
        document.getElementById('quizGame').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        
        this.showQuestion();
    }

    prepareQuizData(type) {
        this.quizData = [];
        
        if (type === 'vocabulary') {
            // Create quiz from vocabulary data
            Object.keys(this.vocabularyData).forEach(category => {
                const categoryData = this.vocabularyData[category];
                for (let i = 0; i < categoryData.English.length; i++) {
                    this.quizData.push({
                        question: `What does "${categoryData.Spanish[i]}" mean?`,
                        correct: categoryData.English[i],
                        category: category
                    });
                }
            });
        } else {
            // Create quiz from phrases data
            Object.keys(this.dailyPhrasesData).forEach(routine => {
                const routineData = this.dailyPhrasesData[routine];
                for (let i = 0; i < routineData.English.length; i++) {
                    this.quizData.push({
                        question: `How do you say "${routineData.English[i]}" in Spanish?`,
                        correct: routineData.Spanish[i],
                        category: routine
                    });
                }
            });
        }
        
        // Shuffle and limit to 5 questions
        this.quizData = this.shuffleArray(this.quizData).slice(0, 5);
        
        // Update total questions display
        document.getElementById('totalQuestions').textContent = this.quizData.length;
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.quizData.length) {
            this.showQuizResults();
            return;
        }

        const currentQuestion = this.quizData[this.currentQuestionIndex];
        
        // Update question display
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('questionText').textContent = currentQuestion.question;
        
        // Generate answer options
        const options = this.generateAnswerOptions(currentQuestion);
        this.displayAnswerOptions(options, currentQuestion.correct);
        
        // Hide feedback
        document.getElementById('quizFeedback').classList.add('hidden');
    }

    generateAnswerOptions(currentQuestion) {
        const options = [currentQuestion.correct];
        
        // Get wrong answers from other categories/routines
        const allAnswers = [];
        if (currentQuestion.category in this.vocabularyData) {
            // Vocabulary question
            Object.keys(this.vocabularyData).forEach(category => {
                this.vocabularyData[category].English.forEach(word => {
                    if (word !== currentQuestion.correct) {
                        allAnswers.push(word);
                    }
                });
            });
        } else {
            // Phrases question
            Object.keys(this.dailyPhrasesData).forEach(routine => {
                this.dailyPhrasesData[routine].Spanish.forEach(phrase => {
                    if (phrase !== currentQuestion.correct) {
                        allAnswers.push(phrase);
                    }
                });
            });
        }
        
        // Add 3 random wrong answers
        const shuffledWrong = this.shuffleArray(allAnswers).slice(0, 3);
        options.push(...shuffledWrong);
        
        return this.shuffleArray(options);
    }

    displayAnswerOptions(options, correctAnswer) {
        const answerOptions = document.getElementById('answerOptions');
        let html = '';
        
        options.forEach(option => {
            html += `
                <button class="answer-option" data-answer="${option}">
                    ${option}
                </button>
            `;
        });
        
        answerOptions.innerHTML = html;
        
        // Add click listeners to answer options
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAnswerClick(e.target, correctAnswer);
            });
        });
    }

    handleAnswerClick(clickedBtn, correctAnswer) {
        const selectedAnswer = clickedBtn.dataset.answer;
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.answer === correctAnswer) {
                btn.classList.add('correct');
            } else if (btn === clickedBtn && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        // Update score
        if (isCorrect) {
            this.quizScore++;
            document.getElementById('quizScore').textContent = this.quizScore;
        }
        
        // Show feedback
        this.showQuizFeedback(isCorrect);
    }

    showQuizFeedback(isCorrect) {
        const feedback = document.getElementById('quizFeedback');
        const message = document.getElementById('feedbackMessage');
        
        if (isCorrect) {
            message.textContent = '¡Correcto! Excellent!';
            message.className = 'feedback-message correct';
        } else {
            message.textContent = '¡Inténtalo otra vez! Try again next time!';
            message.className = 'feedback-message incorrect';
        }
        
        feedback.classList.remove('hidden');
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    showQuizResults() {
        // Calculate stars earned (1-3 based on score)
        const percentage = (this.quizScore / this.quizData.length) * 100;
        let stars = 1;
        if (percentage >= 80) stars = 3;
        else if (percentage >= 60) stars = 2;
        
        this.starsEarned += stars;
        // Update daily stats
        this.updateDailyStats('stars', stars);
        this.addQuizGrade(`${this.quizScore}/${this.quizData.length}`);
        
        // Update displays
        document.getElementById('finalScore').textContent = this.quizScore;
        document.getElementById('finalTotal').textContent = this.quizData.length;
        
        const starsDisplay = document.getElementById('starsEarned');
        starsDisplay.innerHTML = '⭐'.repeat(stars);
        
        // Hide quiz game and show results
        document.getElementById('quizGame').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
        
        this.updateProgressDisplay();
    }

    resetQuiz() {
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('quizStart').classList.remove('hidden');
        
        // Reset quiz state
        this.currentQuestionIndex = 0;
        this.quizScore = 0;
        document.getElementById('quizScore').textContent = '0';
    }

    updateProgressDisplay() {
        document.querySelector('.star-count').textContent = this.starsEarned;
        const wordsLearnedEl = document.getElementById('wordsLearned');
        if (wordsLearnedEl) {
            wordsLearnedEl.textContent = this.wordsExplored;
        }
    }

    /* =============================
     * Manage Vocabulary Helpers
     * ============================= */

    populateCategorySelect() {
        const select = document.getElementById('categorySelect');
        if (!select) return;
        // Preserve current value if exists
        const current = select.value;
        select.innerHTML = Object.keys(this.vocabularyData).map(cat => {
            const friendly = cat.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<option value="${cat}" ${cat===current?'selected':''}>${friendly}</option>`;
        }).join('');
    }

    renderWordTable(category) {
        const tbody = document.querySelector('#wordTable tbody');
        if (!tbody) return;
        const data = this.vocabularyData[category];
        tbody.innerHTML = '';
        for (let i = 0; i < data.English.length; i++) {
            tbody.insertAdjacentHTML('beforeend', this.rowHtml(data.English[i], data.Spanish[i], data.Pronunciation[i]));
        }
        // Attach delete listeners
        tbody.querySelectorAll('.delete-row-btn').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('tr').remove());
        });
    }

    rowHtml(eng='', spa='', pro='') {
        return `<tr>
            <td><input type="text" class="eng-input" value="${eng}"></td>
            <td><input type="text" class="spa-input" value="${spa}"></td>
            <td><input type="text" class="pro-input" value="${pro}"></td>
            <td><button class="delete-row-btn">🗑</button></td>
        </tr>`;
    }

    addRowToTable() {
        const tbody = document.querySelector('#wordTable tbody');
        if (!tbody) return;
        tbody.insertAdjacentHTML('beforeend', this.rowHtml());
        tbody.lastElementChild.querySelector('.delete-row-btn').addEventListener('click', (e)=>{
            e.target.closest('tr').remove();
        });
    }

    saveCurrentCategory() {
        const select = document.getElementById('categorySelect');
        if (!select) return;
        const category = select.value;
        const tbody = document.querySelector('#wordTable tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const eng=[], spa=[], pro=[];
        rows.forEach(tr=>{
            eng.push(tr.querySelector('.eng-input').value.trim());
            spa.push(tr.querySelector('.spa-input').value.trim());
            pro.push(tr.querySelector('.pro-input').value.trim());
        });
        this.vocabularyData[category] = {English: eng, Spanish: spa, Pronunciation: pro};
        localStorage.setItem('vocabData', JSON.stringify(this.vocabularyData));
        alert('Vocabulary saved!');
    }

    exportCurrentCategory() {
        const select = document.getElementById('categorySelect');
        if (!select) return;
        const category = select.value;
        const csv = this.jsonToCsv(this.vocabularyData[category]);
        const blob = new Blob([csv], {type: 'text/csv'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${category}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    importCsvToCategory(csvStr) {
        const select = document.getElementById('categorySelect');
        if (!select) return;
        const category = select.value;
        const json = this.csvToJson(csvStr);
        if (json.English.length) {
            this.vocabularyData[category] = json;
            localStorage.setItem('vocabData', JSON.stringify(this.vocabularyData));
            this.renderWordTable(category);
            alert('CSV imported!');
        } else {
            alert('CSV format invalid.');
        }
    }

    csvToJson(csvStr) {
        const lines = csvStr.trim().split(/\r?\n/);
        const eng=[], spa=[], pro=[];
        lines.forEach(line=>{
            const [e,s,p=''] = line.split(',');
            if(e && s) {
                eng.push(e.trim());
                spa.push(s.trim());
                pro.push(p.trim());
            }
        });
        return {English: eng, Spanish: spa, Pronunciation: pro};
    }

    jsonToCsv(obj) {
        const lines=[];
        for(let i=0;i<obj.English.length;i++) {
            lines.push([obj.English[i]||'', obj.Spanish[i]||'', obj.Pronunciation[i]||''].join(','));
        }
        return lines.join('\n');
    }

    /* ============================
     * Daily Stats Helpers
     * ============================ */
    getTodayKey() {
        const today = new Date();
        return today.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    updateDailyStats(field, increment) {
        const key = this.getTodayKey();
        if (!this.dailyStats[key]) {
            this.dailyStats[key] = {stars:0, words:0, grades:[]};
        }
        if (field === 'stars') this.dailyStats[key].stars += increment;
        if (field === 'words') this.dailyStats[key].words += increment;
        localStorage.setItem('dailyStats', JSON.stringify(this.dailyStats));
        this.updateStatsDashboard();
    }

    addQuizGrade(grade) {
        const key = this.getTodayKey();
        if (!this.dailyStats[key]) {
            this.dailyStats[key] = {stars:0, words:0, grades:[]};
        }
        this.dailyStats[key].grades.push(grade);
        localStorage.setItem('dailyStats', JSON.stringify(this.dailyStats));
        this.updateStatsDashboard();
    }

    updateStatsDashboard() {
        const key = this.getTodayKey();
        const stats = this.dailyStats[key] || {stars:0, words:0, grades:[]};
        const starsEl = document.getElementById('statsStarsToday');
        const wordsEl = document.getElementById('statsWordsToday');
        const gradesUl = document.getElementById('statsGradesToday');
        if (starsEl) starsEl.textContent = stats.stars;
        if (wordsEl) wordsEl.textContent = stats.words;
        if (gradesUl) {
            gradesUl.innerHTML = stats.grades.map(g=>`<li>${g}</li>`).join('');
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpanishLearningApp();
});
