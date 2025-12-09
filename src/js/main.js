// Таймер відліку
function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    // Початковий час: 23 години 54 хвилини 46 секунд
    let hours = 23;
    let minutes = 54;
    let seconds = 46;

    function updateCountdown() {
        // Форматуємо час з ведучими нулями
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

        // Віднімаємо одну секунду
        seconds--;

        // Якщо секунди стали від'ємними, зменшуємо хвилини
        if (seconds < 0) {
            seconds = 59;
            minutes--;

            // Якщо хвилини стали від'ємними, зменшуємо години
            if (minutes < 0) {
                minutes = 59;
                hours--;

                // Якщо години стали від'ємними, скидаємо таймер
                if (hours < 0) {
                    hours = 23;
                    minutes = 54;
                    seconds = 46;
                }
            }
        }
    }

    // Оновлюємо відразу
    updateCountdown();

    // Оновлюємо кожну секунду
    setInterval(updateCountdown, 1000);
}

// Основні функції для роботи з DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт завантажено успішно!');

    // Запускаємо таймер відліку
    startCountdown();

    // Демо функціональність для кнопки
    const demoBtn = document.getElementById('demo-btn');

    if (demoBtn) {
        demoBtn.addEventListener('click', function() {
            alert('Привіт! Це демо функціональність.');

            // Додаємо анімацію
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Функція для плавного скролу
    function smoothScroll(target) {
        const element = document.querySelector(target);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Експортуємо функції для використання в інших скриптах
    window.smoothScroll = smoothScroll;

    // Додаємо обробник для всіх посилань з атрибутом data-scroll
    document.querySelectorAll('[data-scroll]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-scroll');
            smoothScroll(target);
        });
    });

    // FAQ Accordion функціональність
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Закриваємо всі інші елементи
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Перемикаємо поточний елемент
                if (isActive) {
                    item.classList.remove('active');
                } else {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Утилітарні функції
const utils = {
    // Функція для форматування дати
    formatDate: function(date) {
        return new Intl.DateTimeFormat('uk-UA').format(date);
    },

    // Функція для генерації випадкового ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Функція для перевірки чи є елемент у viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Експортуємо утиліти
window.utils = utils;
