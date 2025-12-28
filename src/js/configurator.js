// Конфігуратор - навігація між степами
document.addEventListener('DOMContentLoaded', function() {
    // Визначаємо базовий шлях до зображень (для dev і білду)
    // В dev режимі (Vite server на порту 3000) файли в src/, в білді - в dist/
    const isDev = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
                  window.location.port === '3000';
    const IMAGE_BASE_PATH = isDev ? 'src/images/configurator' : './images/configurator';
    
    const totalSteps = 9; // 1 (вибір стилю) + 8 (кроки гілки)
    let currentStep = 1;
    let selectedBranch = null; // 'real' або 'anime'
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const currentStepSpan = document.getElementById('current-step');
    const progressFill = document.getElementById('progress-fill');
    
    // Елементи верхньої навігації
    const topPrevBtn = document.getElementById('top-prev-btn');
    const topNextBtn = document.getElementById('top-next-btn');
    const navStepTitle = document.getElementById('nav-step-title');
    const navStepCounter = document.getElementById('nav-step-counter');
    
    // Перевірка наявності елементів
    if (!prevBtn || !nextBtn || !submitBtn || !progressFill) {
        console.error('Не знайдено необхідні елементи для конфігуратора');
    }
    
    // Мапінг назв кроків
    const stepTitles = {
        1: 'Choose Style',
        2: 'Choose Ethnicity',
        3: 'Choose Hairstyle',
        4: 'Body Configuration',
        5: 'Choose Personality',
        6: 'Choose Occupation',
        7: 'Choose Outfit',
        8: 'Choose Relationship',
        9: 'Summary'
    };
    
    // Отримуємо всі степи
    const allSteps = document.querySelectorAll('.step');
    
    // Функція для отримання поточного активного степу
    function getCurrentStepElement() {
        if (currentStep === 1) {
            return document.querySelector('.step[data-step="1"]');
        } else if (selectedBranch) {
            return document.querySelector(`.step[data-step="${currentStep}"][data-branch="${selectedBranch}"]`);
        }
        return null;
    }
    
    // Функція для отримання вибраної гілки
    function getSelectedBranch() {
        const selectedStyleCard = document.querySelector('.style-card.active');
        if (selectedStyleCard) {
            return selectedStyleCard.dataset.style;
        }
        return null;
    }
    
    // Функція для перевірки, чи всі обов'язкові поля на поточному кроці заповнені
    function isCurrentStepComplete() {
        const currentStepElement = getCurrentStepElement();
        if (!currentStepElement) return false;
        
        if (currentStep === 1) {
            // Step 1: вибір стилю
            return selectedBranch !== null;
        } else if (currentStep === 2) {
            // Step 2: етнічність, вік, колір очей
            const hasEthnicity = currentStepElement.querySelector('.ethnicity-card[data-ethnicity].active') !== null;
            const hasAge = currentStepElement.querySelector('.age-btn.active') !== null;
            const hasEyes = currentStepElement.querySelector('.eyes-btn.active') !== null;
            return hasEthnicity && hasAge && hasEyes;
        } else if (currentStep === 3) {
            // Step 3: зачіска, колір волосся
            const hasHairstyle = currentStepElement.querySelector('.ethnicity-card[data-hairstyle].active') !== null;
            const hasHairColor = currentStepElement.querySelector('.hair-color-btn.active') !== null;
            return hasHairstyle && hasHairColor;
        } else if (currentStep === 4) {
            // Step 4: body type, breast size, butt type
            const hasBodyType = currentStepElement.querySelector('.ethnicity-card[data-block="1"].active') !== null;
            const hasBreastSize = currentStepElement.querySelector('.ethnicity-card[data-block="2"].active') !== null;
            const hasButtType = currentStepElement.querySelector('.ethnicity-card[data-block="3"].active') !== null;
            return hasBodyType && hasBreastSize && hasButtType;
        } else if (currentStep === 5) {
            // Step 5: personality
            const hasPersonality = currentStepElement.querySelector('.personality-card.active') !== null;
            return hasPersonality;
        } else if (currentStep === 6) {
            // Step 6: occupation and hobbies (min 1, max 3)
            const hasOccupation = currentStepElement.querySelector('.occupation-tag.active') !== null;
            const selectedHobbies = currentStepElement.querySelectorAll('.hobby-tag.active');
            const hasHobbies = selectedHobbies.length >= 1 && selectedHobbies.length <= 3;
            return hasOccupation && hasHobbies;
        } else if (currentStep === 7) {
            // Step 7: outfit
            const hasOutfit = currentStepElement.querySelector('.outfit-tag.active') !== null;
            return hasOutfit;
        } else if (currentStep === 8) {
            // Step 8: relationship
            const hasRelationship = currentStepElement.querySelector('.relationship-card.active') !== null;
            return hasRelationship;
        } else if (currentStep === 9) {
            // Step 9: summary - завжди доступний
            return true;
        }
        // Для інших кроків поки що повертаємо true (поки не заповнені)
        return true;
    }
    
    // Мапінг файлів для anime (з хешами)
    const animeFileMap = {
        'european': 'European.231e21fc4224f71f7b1c.png',
        'latin': 'Latin.dad29f1dc32faa446e89.png',
        'asian': 'Asian.b6dbc6ecc8bfcb67f428.png',
        'arab': 'Arab.78672d48ecf163f1268b.png',
        'afro': 'Afro.43cf3f0f051fbed811aa.png',
        'indian': 'Indian.62a24dd84017f473a475.png'
    };
    
    // Мапінг файлів для зачісок anime (з хешами)
    const animeHairstyleFileMap = {
        'bangs': 'Bangs.ac058f71206fa5d02475.png',
        'braids': 'Braids.28af6af68cea46c0791d.png',
        'bun': 'Bun.021be9f93da28d492a07.png',
        'curly': 'Curly.2e69a2de657cc2e407e3.png',
        'long': 'Long.0fab37f113d9b5514da1.png',
        'ponytail': 'Ponytail.43f1b250d6884576dfad.png',
        'short': 'Short.a9aa3db74536e9d2ae4a.png',
        'straight': 'Straight.899fb6d9eb5f5a461a6f.png'
    };
    
    // Мапінг файлів для зачісок real (з хешами)
    const realHairstyleFileMap = {
        'bangs': 'Bangs.c5144bab546614f21e2b.jpg',
        'braids': 'Braids.cf0b4b786575ebc6ed2f.jpg',
        'bun': 'Bun.db7306366cce21638bc5.jpg',
        'curly': 'Curly.8191d2ee20f197ae3745.jpg',
        'long': 'Long.07666efe5efde9d9350b.jpg',
        'ponytail': 'Ponytail.20a67c7ded0d1eaff2dc.jpg',
        'short': 'Short.a31cf73cbb9dc300b42b.jpg',
        'straight': 'Straight.afc18e9e558fcf326c33.jpg'
    };
    
    // Мапінг файлів для step 4 block 1 (Body Type) - anime
    const animeBlock1FileMap = {
        'athletic': 'Athletic.3d250b3e225815457139.png',
        'curvy': 'Curvy.5f8da0c9c9ae2af34b2d.png',
        'muscular': 'Muscular.6108d2edac3e61f02077.png',
        'petite': 'Petite.f9438cdebbe3dee71ff6.png',
        'slim': 'Slim.0c8f444505d302dde9fc.png',
        'voluptuous': 'Voluptuous.aa8f858ea826bba93a5c.png',
        'wide': 'Wide.1048d06529beb8626ba3.png'
    };
    
    // Мапінг файлів для step 4 block 1 (Body Type) - real
    const realBlock1FileMap = {
        'athletic': 'Athletic.6b8d6cdbde6672fe90bd.jpg',
        'curvy': 'Curvy.2008191b47971d1753d2.jpg',
        'muscular': 'Muscular (1).ba22f558b23d3ac4b150.png',
        'petite': 'Petite.913e5907e6d1f261f4a8.jpg',
        'slim': 'Slim.8d94b7c5b1f32c238d09.jpg',
        'voluptuous': 'Voluptuous.02687fcd8fdf75cb47a3.jpg'
    };
    
    // Мапінг файлів для step 4 block 2 (Breast Size) - anime
    const animeBlock2FileMap = {
        'flat': 'Flat.26577f6c162c81b4ee5b.png',
        'huge': 'Huge.2c5edcf5e26824cff7a6.png',
        'large': 'Large.36599d6142f3c688215d.png',
        'medium': 'Medium.a8b4d01511b582e5b9e8.png',
        'small': 'Small.91bb4a02b3267770f9a9.png'
    };
    
    // Мапінг файлів для step 4 block 2 (Breast Size) - real
    const realBlock2FileMap = {
        'flat': 'Flat.9f677902db0da0da551e.png',
        'huge': 'Huge.85ec8eeb04e7081d131a.png',
        'large': 'Large.8a31f2a3d339fe4fdc35.png',
        'medium': 'Medium.9b34d4d6e32083433765.png',
        'small': 'Small.7f095c40a833f93a6af9.png'
    };
    
    // Мапінг файлів для step 4 block 3 (Butt Type) - anime
    const animeBlock3FileMap = {
        'athletic': 'Athletic.122eb9b06dcf5ed95a3f.png',
        'huge': 'Huge.842ee2698a85760886c8.png',
        'medium': 'Medium.929cae8cb8ea98ef37b4.png',
        'skinny': 'Skinny.246599c958256ea61747.png',
        'small': 'Small.286dda7f60fd1e890e50.png'
    };
    
    // Мапінг файлів для step 4 block 3 (Butt Type) - real
    const realBlock3FileMap = {
        'athletic': 'Athletic.637feb500421a2778411.png',
        'huge': 'Huge.b050a0007cc1316d579d.png',
        'medium': 'Medium.015647213350d389c96b.png',
        'skinny': 'Skinny.d8daf092409b64f4f597.png',
        'small': 'Small.ddd49b8fb3f90e12f12a.png'
    };
    
    // Функція для завантаження зображень етнічностей
    function loadEthnicityImages() {
        if (currentStep === 2 && selectedBranch) {
            const stepElement = document.querySelector(`.step[data-step="2"][data-branch="${selectedBranch}"]`);
            if (!stepElement) return;
            
            const ethnicityCards = stepElement.querySelectorAll('.ethnicity-card');
            
            ethnicityCards.forEach(card => {
                const ethnicity = card.dataset.ethnicity;
                const image = card.querySelector('.ethnicity-image');
                
                if (image) {
                    if (selectedBranch === 'real') {
                        // Для real: більшість файлів .jpg, але Indian.png
                        const ethnicityName = ethnicity.charAt(0).toUpperCase() + ethnicity.slice(1);
                        const fileExtension = ethnicity === 'indian' ? 'png' : 'jpg';
                        image.src = `${IMAGE_BASE_PATH}/step2/${selectedBranch}/${ethnicityName}.${fileExtension}`;
                        card.style.display = 'block';
                    } else {
                        // Для anime: використовуємо мапінг з хешами
                        const fileName = animeFileMap[ethnicity];
                        if (fileName) {
                            image.src = `${IMAGE_BASE_PATH}/step2/${selectedBranch}/${fileName}`;
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                }
            });
        }
    }
    
    // Функція для завантаження зображень зачісок
    function loadHairstyleImages() {
        if (currentStep === 3 && selectedBranch) {
            const stepElement = document.querySelector(`.step[data-step="3"][data-branch="${selectedBranch}"]`);
            if (!stepElement) return;
            
            const hairstyleCards = stepElement.querySelectorAll('.ethnicity-card[data-hairstyle]');
            
            hairstyleCards.forEach(card => {
                const hairstyle = card.dataset.hairstyle;
                const image = card.querySelector('.ethnicity-image');
                
                if (image) {
                    if (selectedBranch === 'real') {
                        // Для real: використовуємо мапінг з хешами
                        const fileName = realHairstyleFileMap[hairstyle];
                        if (fileName) {
                            image.src = `${IMAGE_BASE_PATH}/step3/${selectedBranch}/${fileName}`;
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    } else {
                        // Для anime: використовуємо мапінг з хешами
                        const fileName = animeHairstyleFileMap[hairstyle];
                        if (fileName) {
                            image.src = `${IMAGE_BASE_PATH}/step3/${selectedBranch}/${fileName}`;
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                }
            });
        }
    }
    
    // Функція для оновлення стану disabled тегів хобі
    function updateHobbyTagsState(container) {
        const allHobbyTags = container.querySelectorAll('.hobby-tag');
        const selectedHobbies = container.querySelectorAll('.hobby-tag.active');
        const isMaxSelected = selectedHobbies.length >= 3;
        
        allHobbyTags.forEach(tag => {
            const isActive = tag.classList.contains('active');
            if (isMaxSelected && !isActive) {
                tag.disabled = true;
                tag.classList.add('disabled');
            } else {
                tag.disabled = false;
                tag.classList.remove('disabled');
            }
        });
    }
    
    // Мапінг значень для відображення
    const valueLabels = {
        // Ethnicity
        'european': 'European',
        'latin': 'Latin',
        'asian': 'Asian',
        'arab': 'Arab',
        'afro': 'Afro',
        'indian': 'Indian',
        // Hairstyle
        'bangs': 'Bangs',
        'braids': 'Braids',
        'bun': 'Bun',
        'curly': 'Curly',
        'long': 'Long',
        'ponytail': 'Ponytail',
        'short': 'Short',
        'straight': 'Straight',
        // Hair color
        'blond': 'Blond',
        'brunette': 'Brunette',
        'black': 'Black',
        // Body type
        'athletic': 'Athletic',
        'curvy': 'Curvy',
        'muscular': 'Muscular',
        'petite': 'Petite',
        'slim': 'Slim',
        'voluptuous': 'Voluptuous',
        'wide': 'Wide',
        // Breast size
        'flat': 'Flat',
        'small': 'Small',
        'medium': 'Medium',
        'large': 'Large',
        'huge': 'Huge',
        // Butt type
        'skinny': 'Skinny',
        // Personality
        'caregiver': 'Caregiver',
        'innocent': 'Innocent',
        'temptress': 'Temptress',
        'submissive': 'Submissive',
        'nympho': 'Nympho',
        'confidant': 'Confidant',
        'sage': 'Sage',
        'jester': 'Jester',
        'dominant': 'Dominant',
        'lover': 'Lover',
        'mean': 'Mean',
        'experimenter': 'Experimenter',
        // Relationship
        'stranger': 'Stranger',
        'school-mate': 'School Mate',
        'colleague': 'Colleague',
        'mentor': 'Mentor',
        'sex-friend': 'Sex Friend',
        'wife': 'Wife',
        'mistress': 'Mistress',
        'friend': 'Friend',
        'best-friend': 'Best Friend',
        'step-sister': 'Step Sister',
        'step-mom': 'Step Mom',
        // Hobbies
        'fitness': 'Fitness',
        'vlogging': 'Vlogging',
        'traveling': 'Traveling',
        'tourism': 'Tourism',
        'gaming': 'Gaming',
        'parties': 'Parties',
        'tv-series': 'TV series',
        'anime': 'Anime',
        'cosplay': 'Cosplay',
        'self-development': 'Self-development',
        'writing': 'Writing',
        'handicrafts': 'Handicrafts',
        'photography': 'Photography',
        'volunteering': 'Volunteering',
        'veganism': 'Veganism',
        'cars': 'Cars',
        'art': 'Art',
        'watching-netflix': 'Watching Netflix',
        'manga-anime': 'Manga and anime',
        'martial-arts': 'Martial arts'
    };
    
    // Функція для отримання читабельного значення
    function getDisplayValue(key, value) {
        if (valueLabels[value]) {
            return valueLabels[value];
        }
        // Якщо немає в мапінгу, робимо першу літеру великою
        return value ? value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ') : '-';
    }
    
    // Функція для оновлення summary
    function updateSummary() {
        const currentStepElement = getCurrentStepElement();
        if (!currentStepElement || currentStep !== 9) return;
        
        // Знаходимо всі елементи summary в поточному step
        const summaryContainer = currentStepElement.querySelector('.summary-container');
        if (!summaryContainer) return;
        
        // Style
        const styleCard = document.querySelector('.style-card.active');
        const styleVideo = summaryContainer.querySelector('#summary-style-video');
        const styleValue = summaryContainer.querySelector('#summary-style');
        if (styleCard && styleVideo && styleValue) {
            const style = styleCard.dataset.style;
            styleValue.textContent = style ? style.charAt(0).toUpperCase() + style.slice(1) : '-';
            const videoSource = styleCard.querySelector('source');
            if (videoSource && videoSource.src) {
                const source = styleVideo.querySelector('source');
                if (source) {
                    source.src = videoSource.src;
                    styleVideo.load();
                    styleVideo.style.display = 'block';
                }
            } else {
                styleVideo.style.display = 'none';
            }
        }
        
        // Ethnicity
        const ethnicityCard = document.querySelector(`.step[data-step="2"][data-branch="${selectedBranch}"] .ethnicity-card.active`);
        const ethnicityImage = summaryContainer.querySelector('#summary-ethnicity-image');
        const ethnicityValue = summaryContainer.querySelector('#summary-ethnicity');
        if (ethnicityCard && ethnicityImage && ethnicityValue) {
            const ethnicity = ethnicityCard.dataset.ethnicity;
            ethnicityValue.textContent = getDisplayValue('ethnicity', ethnicity);
            const img = ethnicityCard.querySelector('.ethnicity-image');
            if (img && img.src && img.src !== window.location.href) {
                ethnicityImage.src = img.src;
                ethnicityImage.style.display = 'block';
            } else {
                ethnicityImage.style.display = 'none';
            }
        }
        
        // Age
        const ageBtn = document.querySelector(`.step[data-step="2"][data-branch="${selectedBranch}"] .age-btn.active`);
        const ageValue = summaryContainer.querySelector('#summary-age');
        if (ageBtn && ageValue) {
            ageValue.textContent = ageBtn.dataset.age || '-';
        } else if (ageValue) {
            ageValue.textContent = '-';
        }
        
        // Eyes
        const eyesBtn = document.querySelector(`.step[data-step="2"][data-branch="${selectedBranch}"] .eyes-btn.active`);
        const eyesImage = summaryContainer.querySelector('#summary-eyes-image');
        const eyesValue = summaryContainer.querySelector('#summary-eyes');
        if (eyesBtn && eyesImage && eyesValue) {
            eyesValue.textContent = getDisplayValue('eyes', eyesBtn.dataset.eyes);
            const img = eyesBtn.querySelector('.eyes-icon');
            if (img && img.src && img.src !== window.location.href) {
                eyesImage.src = img.src;
                eyesImage.style.display = 'block';
            } else {
                eyesImage.style.display = 'none';
            }
        } else if (eyesValue) {
            eyesValue.textContent = '-';
        }
        
        // Hairstyle
        const hairstyleCard = document.querySelector(`.step[data-step="3"][data-branch="${selectedBranch}"] .ethnicity-card[data-hairstyle].active`);
        const hairstyleImage = summaryContainer.querySelector('#summary-hairstyle-image');
        const hairstyleValue = summaryContainer.querySelector('#summary-hairstyle');
        if (hairstyleCard && hairstyleImage && hairstyleValue) {
            hairstyleValue.textContent = getDisplayValue('hairstyle', hairstyleCard.dataset.hairstyle);
            const img = hairstyleCard.querySelector('.ethnicity-image');
            if (img && img.src && img.src !== window.location.href) {
                hairstyleImage.src = img.src;
                hairstyleImage.style.display = 'block';
            } else {
                hairstyleImage.style.display = 'none';
            }
        } else if (hairstyleValue) {
            hairstyleValue.textContent = '-';
        }
        
        // Hair color
        const hairColorBtn = document.querySelector(`.step[data-step="3"][data-branch="${selectedBranch}"] .hair-color-btn.active`);
        const hairColorSwatch = summaryContainer.querySelector('#summary-hair-color-swatch');
        const hairColorValue = summaryContainer.querySelector('#summary-hair-color');
        if (hairColorBtn && hairColorSwatch && hairColorValue) {
            hairColorValue.textContent = getDisplayValue('hair-color', hairColorBtn.dataset.hairColor);
            const swatch = hairColorBtn.querySelector('.hair-color-swatch');
            if (swatch && swatch.style.backgroundColor) {
                hairColorSwatch.style.backgroundColor = swatch.style.backgroundColor;
                hairColorSwatch.style.display = 'block';
            } else {
                hairColorSwatch.style.display = 'none';
            }
        } else if (hairColorValue) {
            hairColorValue.textContent = '-';
        }
        
        // Body type
        const bodyTypeCard = document.querySelector(`.step[data-step="4"][data-branch="${selectedBranch}"] .ethnicity-card[data-block="1"].active`);
        const bodyTypeImage = summaryContainer.querySelector('#summary-body-type-image');
        const bodyTypeValue = summaryContainer.querySelector('#summary-body-type');
        if (bodyTypeCard && bodyTypeImage && bodyTypeValue) {
            bodyTypeValue.textContent = getDisplayValue('body-type', bodyTypeCard.dataset.option);
            const img = bodyTypeCard.querySelector('.ethnicity-image');
            if (img && img.src && img.src !== window.location.href) {
                bodyTypeImage.src = img.src;
                bodyTypeImage.style.display = 'block';
            } else {
                bodyTypeImage.style.display = 'none';
            }
        } else if (bodyTypeValue) {
            bodyTypeValue.textContent = '-';
        }
        
        // Breast size
        const breastSizeCard = document.querySelector(`.step[data-step="4"][data-branch="${selectedBranch}"] .ethnicity-card[data-block="2"].active`);
        const breastSizeImage = summaryContainer.querySelector('#summary-breast-size-image');
        const breastSizeValue = summaryContainer.querySelector('#summary-breast-size');
        if (breastSizeCard && breastSizeImage && breastSizeValue) {
            breastSizeValue.textContent = getDisplayValue('breast-size', breastSizeCard.dataset.option);
            const img = breastSizeCard.querySelector('.ethnicity-image');
            if (img && img.src && img.src !== window.location.href) {
                breastSizeImage.src = img.src;
                breastSizeImage.style.display = 'block';
            } else {
                breastSizeImage.style.display = 'none';
            }
        } else if (breastSizeValue) {
            breastSizeValue.textContent = '-';
        }
        
        // Butt type
        const buttTypeCard = document.querySelector(`.step[data-step="4"][data-branch="${selectedBranch}"] .ethnicity-card[data-block="3"].active`);
        const buttTypeImage = summaryContainer.querySelector('#summary-butt-type-image');
        const buttTypeValue = summaryContainer.querySelector('#summary-butt-type');
        if (buttTypeCard && buttTypeImage && buttTypeValue) {
            buttTypeValue.textContent = getDisplayValue('butt-type', buttTypeCard.dataset.option);
            const img = buttTypeCard.querySelector('.ethnicity-image');
            if (img && img.src && img.src !== window.location.href) {
                buttTypeImage.src = img.src;
                buttTypeImage.style.display = 'block';
            } else {
                buttTypeImage.style.display = 'none';
            }
        } else if (buttTypeValue) {
            buttTypeValue.textContent = '-';
        }
        
        // Personality
        const personalityCard = document.querySelector(`.step[data-step="5"][data-branch="${selectedBranch}"] .personality-card.active`);
        const personalityEmoji = summaryContainer.querySelector('#summary-personality-emoji');
        const personalityValue = summaryContainer.querySelector('#summary-personality');
        if (personalityCard && personalityEmoji && personalityValue) {
            personalityValue.textContent = getDisplayValue('personality', personalityCard.dataset.personality);
            const emoji = personalityCard.querySelector('.personality-emoji');
            if (emoji && emoji.textContent) {
                personalityEmoji.textContent = emoji.textContent;
                personalityEmoji.style.display = 'block';
            } else {
                personalityEmoji.style.display = 'none';
            }
        } else if (personalityValue) {
            personalityValue.textContent = '-';
        }
        
        // Relationship
        const relationshipCard = document.querySelector(`.step[data-step="8"][data-branch="${selectedBranch}"] .relationship-card.active`);
        const relationshipEmoji = summaryContainer.querySelector('#summary-relationship-emoji');
        const relationshipValue = summaryContainer.querySelector('#summary-relationship');
        if (relationshipCard && relationshipEmoji && relationshipValue) {
            relationshipValue.textContent = getDisplayValue('relationship', relationshipCard.dataset.relationship);
            const emoji = relationshipCard.querySelector('.relationship-emoji');
            if (emoji && emoji.textContent) {
                relationshipEmoji.textContent = emoji.textContent;
                relationshipEmoji.style.display = 'block';
            } else {
                relationshipEmoji.style.display = 'none';
            }
        } else if (relationshipValue) {
            relationshipValue.textContent = '-';
        }
        
        // Occupation
        const occupationTag = document.querySelector(`.step[data-step="6"][data-branch="${selectedBranch}"] .occupation-tag.active`);
        const occupationValue = summaryContainer.querySelector('#summary-occupation');
        if (occupationTag && occupationValue) {
            const occupation = occupationTag.dataset.occupation;
            occupationValue.textContent = occupation ? occupation.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-';
        } else if (occupationValue) {
            occupationValue.textContent = '-';
        }
        
        // Hobbies
        const hobbyTags = document.querySelectorAll(`.step[data-step="6"][data-branch="${selectedBranch}"] .hobby-tag.active`);
        const hobbiesContainer = summaryContainer.querySelector('#summary-hobbies .summary-tags');
        if (hobbiesContainer) {
            hobbiesContainer.innerHTML = '';
            if (hobbyTags.length > 0) {
                hobbyTags.forEach(tag => {
                    const hobby = tag.dataset.hobby;
                    const hobbyTag = document.createElement('div');
                    hobbyTag.className = 'summary-tag';
                    hobbyTag.textContent = getDisplayValue('hobby', hobby);
                    hobbiesContainer.appendChild(hobbyTag);
                });
            } else {
                hobbiesContainer.innerHTML = '<div class="summary-tag">-</div>';
            }
        }
        
        // Outfit
        const outfitTag = document.querySelector(`.step[data-step="7"][data-branch="${selectedBranch}"] .outfit-tag.active`);
        const outfitValue = summaryContainer.querySelector('#summary-outfit');
        if (outfitTag && outfitValue) {
            const outfit = outfitTag.dataset.outfit;
            outfitValue.textContent = outfit ? outfit.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '-';
        } else if (outfitValue) {
            outfitValue.textContent = '-';
        }
    }
    
    // Функція для завантаження зображень step 4
    function loadStep4Images() {
        if (currentStep === 4 && selectedBranch) {
            const stepElement = document.querySelector(`.step[data-step="4"][data-branch="${selectedBranch}"]`);
            if (!stepElement) return;
            
            // Завантажуємо зображення для кожного блоку
            for (let blockNum = 1; blockNum <= 3; blockNum++) {
                const blockCards = stepElement.querySelectorAll(`.ethnicity-card[data-block="${blockNum}"]`);
                
                blockCards.forEach(card => {
                    const option = card.dataset.option;
                    const image = card.querySelector('.ethnicity-image');
                    
                    if (image) {
                        let fileName = null;
                        
                        if (blockNum === 1) {
                            // Block 1: Body Type
                            if (selectedBranch === 'real') {
                                fileName = realBlock1FileMap[option];
                            } else {
                                fileName = animeBlock1FileMap[option];
                            }
                        } else if (blockNum === 2) {
                            // Block 2: Breast Size
                            if (selectedBranch === 'real') {
                                fileName = realBlock2FileMap[option];
                            } else {
                                fileName = animeBlock2FileMap[option];
                            }
                        } else if (blockNum === 3) {
                            // Block 3: Butt Type
                            if (selectedBranch === 'real') {
                                fileName = realBlock3FileMap[option];
                            } else {
                                fileName = animeBlock3FileMap[option];
                            }
                        }
                        
                        if (fileName) {
                            image.src = `${IMAGE_BASE_PATH}/step4/block${blockNum}/${selectedBranch}/${fileName}`;
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            }
        }
    }
    
    // Функція для оновлення відображення
    function updateDisplay() {
        // Оновлюємо номер поточного кроку (якщо елемент існує)
        if (currentStepSpan) {
            currentStepSpan.textContent = currentStep;
        }
        
        // Оновлюємо верхню навігацію
        if (navStepTitle) {
            navStepTitle.textContent = stepTitles[currentStep] || `Step ${currentStep}`;
        }
        if (navStepCounter) {
            navStepCounter.textContent = `${currentStep}/${totalSteps}`;
        }
        
        // Якщо ми на першому степі, визначаємо гілку
        if (currentStep === 1) {
            selectedBranch = getSelectedBranch();
        }
        
        // Ховаємо всі степи
        allSteps.forEach(step => {
            step.classList.remove('active');
            step.style.display = 'none';
        });
        
        // Показуємо тільки поточний степ
        const currentStepElement = getCurrentStepElement();
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.style.display = 'block';
        }
        
        // Завантажуємо зображення для кроку 2
        if (currentStep === 2) {
            loadEthnicityImages();
        }
        
        // Завантажуємо зображення для кроку 3
        if (currentStep === 3) {
            loadHairstyleImages();
        }
        
        // Завантажуємо зображення для кроку 4
        if (currentStep === 4) {
            loadStep4Images();
        }
        
        // Оновлюємо стан disabled для тегів хобі на step 6
        if (currentStep === 6) {
            const currentStepElement = getCurrentStepElement();
            if (currentStepElement) {
                const hobbyTagsContainer = currentStepElement.querySelector('.hobby-tags');
                if (hobbyTagsContainer) {
                    updateHobbyTagsState(hobbyTagsContainer);
                }
            }
        }
        
        // Оновлюємо summary на step 9
        if (currentStep === 9) {
            updateSummary();
        }
        
        // Перевіряємо, чи всі обов'язкові поля заповнені
        const isStepComplete = isCurrentStepComplete();
        
        // Керуємо кнопками
        prevBtn.disabled = currentStep === 1;
        
        // Перевіряємо, чи можна перейти далі
        nextBtn.disabled = !isStepComplete || currentStep >= totalSteps;
        
        // Оновлюємо стан стрілок верхньої навігації
        if (topPrevBtn) {
            topPrevBtn.disabled = currentStep === 1;
        }
        if (topNextBtn) {
            topNextBtn.disabled = !isStepComplete || currentStep >= totalSteps;
        }
        
        // Оновлюємо прогрес-бар
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
    }
    
    // Функція для переходу до наступного кроку
    function nextStep() {
        // Перевіряємо, чи всі обов'язкові поля заповнені
        if (!isCurrentStepComplete()) {
            let message = 'Будь ласка, заповніть всі обов\'язкові поля:';
            
            const currentStepElement = getCurrentStepElement();
            if (currentStep === 1) {
                message = 'Будь ласка, виберіть стиль перед продовженням';
            } else if (currentStep === 2) {
                const missing = [];
                if (!currentStepElement.querySelector('.ethnicity-card[data-ethnicity].active')) missing.push('етнічність');
                if (!currentStepElement.querySelector('.age-btn.active')) missing.push('вік');
                if (!currentStepElement.querySelector('.eyes-btn.active')) missing.push('колір очей');
                message += ' ' + missing.join(', ');
            } else if (currentStep === 3) {
                const missing = [];
                if (!currentStepElement.querySelector('.ethnicity-card[data-hairstyle].active')) missing.push('зачіску');
                if (!currentStepElement.querySelector('.hair-color-btn.active')) missing.push('колір волосся');
                message += ' ' + missing.join(', ');
            } else if (currentStep === 4) {
                const missing = [];
                if (!currentStepElement.querySelector('.ethnicity-card[data-block="1"].active')) missing.push('тип тіла');
                if (!currentStepElement.querySelector('.ethnicity-card[data-block="2"].active')) missing.push('розмір грудей');
                if (!currentStepElement.querySelector('.ethnicity-card[data-block="3"].active')) missing.push('тип сідниць');
                message += ' ' + missing.join(', ');
            } else if (currentStep === 5) {
                message = 'Будь ласка, виберіть особистість перед продовженням';
            } else if (currentStep === 6) {
                const missing = [];
                if (!currentStepElement.querySelector('.occupation-tag.active')) missing.push('професію');
                const selectedHobbies = currentStepElement.querySelectorAll('.hobby-tag.active');
                if (selectedHobbies.length === 0) {
                    missing.push('хобі (мінімум 1)');
                } else if (selectedHobbies.length > 3) {
                    missing.push('хобі (максимум 3)');
                }
                message += ' ' + missing.join(', ');
            } else if (currentStep === 7) {
                message = 'Будь ласка, виберіть одяг перед продовженням';
            } else if (currentStep === 8) {
                message = 'Будь ласка, виберіть роль стосунків перед продовженням';
            }
            
            alert(message);
            return;
        }
        
        if (currentStep < totalSteps) {
            currentStep++;
            updateDisplay();
            // Прокручуємо до верху тільки при переході між степами
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Функція для переходу до попереднього кроку
    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            // Якщо повертаємося до першого кроку, зберігаємо вибрану гілку
            if (currentStep === 1) {
                // Гілка зберігається з вибору картки
            }
            updateDisplay();
            // Прокручуємо до верху тільки при переході між степами
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Обробники подій для кнопок
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    
    // Обробники подій для верхньої навігації
    if (topPrevBtn) {
        topPrevBtn.addEventListener('click', prevStep);
    }
    if (topNextBtn) {
        topNextBtn.addEventListener('click', nextStep);
    }
    
    
    // Ініціалізація
    updateDisplay();
    
    // Обробка вибору стилю для Step 1
    const styleCards = document.querySelectorAll('.style-card');
    styleCards.forEach(card => {
        card.addEventListener('click', function() {
            // Видаляємо active з усіх карток
            styleCards.forEach(c => c.classList.remove('active'));
            // Додаємо active до вибраної картки
            this.classList.add('active');
            // Оновлюємо вибрану гілку
            selectedBranch = this.dataset.style;
            // Оновлюємо відображення, щоб активувати кнопку "Вперед"
            updateDisplay();
        });
    });
    
    // Обробка вибору етнічності для Step 2 (використовуємо делегування подій)
    function initEthnicityCards() {
        // Використовуємо делегування подій на контейнері steps
        const stepsContainer = document.querySelector('.steps-container');
        if (stepsContainer) {
            stepsContainer.addEventListener('click', function(e) {
                let shouldUpdate = false;
                
                // Обробка вибору етнічності
                const ethnicityCard = e.target.closest('.ethnicity-card');
                if (ethnicityCard && currentStep === 2 && ethnicityCard.dataset.ethnicity) {
                    // Знаходимо всі картки в поточному контейнері
                    const container = ethnicityCard.closest('.ethnicity-cards');
                    if (!container) return;
                    
                    const cardsInContainer = container.querySelectorAll('.ethnicity-card');
                    
                    // Видаляємо active з усіх карток в контейнері
                    cardsInContainer.forEach(c => c.classList.remove('active'));
                    
                    // Додаємо active до вибраної картки
                    ethnicityCard.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору зачіски
                const hairstyleCard = e.target.closest('.ethnicity-card[data-hairstyle]');
                if (hairstyleCard && currentStep === 3) {
                    // Знаходимо всі картки в поточному контейнері
                    const container = hairstyleCard.closest('.ethnicity-cards');
                    if (!container) return;
                    
                    const cardsInContainer = container.querySelectorAll('.ethnicity-card[data-hairstyle]');
                    
                    // Видаляємо active з усіх карток в контейнері
                    cardsInContainer.forEach(c => c.classList.remove('active'));
                    
                    // Додаємо active до вибраної картки
                    hairstyleCard.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору карток для step 4
                const step4Card = e.target.closest('.ethnicity-card[data-block]');
                if (step4Card && currentStep === 4) {
                    const blockNum = step4Card.dataset.block;
                    // Знаходимо всі картки в тому ж блоці
                    const container = step4Card.closest(`.ethnicity-cards[data-block="${blockNum}"]`);
                    if (!container) return;
                    
                    const cardsInBlock = container.querySelectorAll(`.ethnicity-card[data-block="${blockNum}"]`);
                    
                    // Видаляємо active з усіх карток в блоці
                    cardsInBlock.forEach(c => c.classList.remove('active'));
                    
                    // Додаємо active до вибраної картки
                    step4Card.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору віку
                const ageBtn = e.target.closest('.age-btn');
                if (ageBtn && currentStep === 2) {
                    const container = ageBtn.closest('.age-buttons');
                    if (!container) return;
                    
                    const buttonsInContainer = container.querySelectorAll('.age-btn');
                    buttonsInContainer.forEach(btn => btn.classList.remove('active'));
                    ageBtn.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору кольору очей
                const eyesBtn = e.target.closest('.eyes-btn');
                if (eyesBtn && currentStep === 2) {
                    const container = eyesBtn.closest('.eyes-buttons');
                    if (!container) return;
                    
                    const buttonsInContainer = container.querySelectorAll('.eyes-btn');
                    buttonsInContainer.forEach(btn => btn.classList.remove('active'));
                    eyesBtn.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору кольору волосся
                const hairColorBtn = e.target.closest('.hair-color-btn');
                if (hairColorBtn && currentStep === 3) {
                    const container = hairColorBtn.closest('.hair-color-buttons');
                    if (!container) return;
                    
                    const buttonsInContainer = container.querySelectorAll('.hair-color-btn');
                    buttonsInContainer.forEach(btn => btn.classList.remove('active'));
                    hairColorBtn.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору особистості для step 5
                const personalityCard = e.target.closest('.personality-card');
                if (personalityCard && currentStep === 5) {
                    const container = personalityCard.closest('.personality-cards');
                    if (!container) return;
                    
                    const cardsInContainer = container.querySelectorAll('.personality-card');
                    cardsInContainer.forEach(c => c.classList.remove('active'));
                    personalityCard.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору професії для step 6
                const occupationTag = e.target.closest('.occupation-tag');
                if (occupationTag && currentStep === 6) {
                    const container = occupationTag.closest('.occupation-tags');
                    if (!container) return;
                    
                    const tagsInContainer = container.querySelectorAll('.occupation-tag');
                    tagsInContainer.forEach(tag => tag.classList.remove('active'));
                    occupationTag.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору хобі для step 6
                const hobbyTag = e.target.closest('.hobby-tag');
                if (hobbyTag && currentStep === 6) {
                    const container = hobbyTag.closest('.hobby-tags');
                    if (!container) return;
                    
                    const selectedHobbies = container.querySelectorAll('.hobby-tag.active');
                    const isActive = hobbyTag.classList.contains('active');
                    
                    if (isActive) {
                        // Якщо тег вже вибраний, знімаємо вибір (якщо є ще вибрані)
                        if (selectedHobbies.length > 1) {
                            hobbyTag.classList.remove('active');
                            shouldUpdate = true;
                        }
                    } else {
                        // Якщо тег не вибраний, додаємо вибір (якщо не перевищено ліміт)
                        if (selectedHobbies.length < 3) {
                            hobbyTag.classList.add('active');
                            shouldUpdate = true;
                        }
                    }
                    
                    // Оновлюємо стан disabled для всіх тегів хобі
                    updateHobbyTagsState(container);
                }
                
                // Обробка вибору одягу для step 7
                const outfitTag = e.target.closest('.outfit-tag');
                if (outfitTag && currentStep === 7) {
                    const container = outfitTag.closest('.outfit-tags');
                    if (!container) return;
                    
                    const tagsInContainer = container.querySelectorAll('.outfit-tag');
                    tagsInContainer.forEach(tag => tag.classList.remove('active'));
                    outfitTag.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Обробка вибору ролі стосунків для step 8
                const relationshipCard = e.target.closest('.relationship-card');
                if (relationshipCard && currentStep === 8) {
                    const container = relationshipCard.closest('.relationship-cards');
                    if (!container) return;
                    
                    const cardsInContainer = container.querySelectorAll('.relationship-card');
                    cardsInContainer.forEach(c => c.classList.remove('active'));
                    relationshipCard.classList.add('active');
                    shouldUpdate = true;
                }
                
                // Оновлюємо відображення після вибору
                if (shouldUpdate) {
                    updateDisplay();
                }
            });
        }
    }
    
    // Ініціалізуємо картки етнічностей після завантаження DOM
    initEthnicityCards();
    
    // Обробка кліку на картки summary для переходу на відповідний step
    function initSummaryCards() {
        const stepsContainer = document.querySelector('.steps-container');
        if (stepsContainer) {
            stepsContainer.addEventListener('click', function(e) {
                const summaryCard = e.target.closest('.summary-card, .summary-tags-container');
                if (summaryCard && currentStep === 9) {
                    const editStep = parseInt(summaryCard.dataset.editStep);
                    if (editStep && editStep >= 1 && editStep <= 9) {
                        currentStep = editStep;
                        updateDisplay();
                    }
                }
            });
        }
    }
    
    initSummaryCards();
    
    // Додаємо підтримку клавіатури
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevStep();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled && currentStep < totalSteps) {
            nextStep();
        }
    });
});

