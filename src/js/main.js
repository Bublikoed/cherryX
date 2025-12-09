// Основні функції для роботи з DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('Скрипт завантажено успішно!');

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
