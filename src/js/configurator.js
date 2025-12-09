// Конфігуратор - навігація між степами
document.addEventListener('DOMContentLoaded', function() {
    const totalSteps = 9;
    let currentStep = 1;
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const currentStepSpan = document.getElementById('current-step');
    const progressFill = document.getElementById('progress-fill');
    
    // Отримуємо всі степи
    const steps = document.querySelectorAll('.step');
    
    // Функція для оновлення відображення
    function updateDisplay() {
        // Оновлюємо номер поточного кроку
        currentStepSpan.textContent = currentStep;
        
        // Оновлюємо прогрес-бар
        const progress = (currentStep / totalSteps) * 100;
        progressFill.style.width = progress + '%';
        
        // Показуємо/ховаємо степи
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Керуємо кнопками
        prevBtn.disabled = currentStep === 1;
        
        if (currentStep === totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'inline-block';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
        }
        
        // Прокручуємо до верху
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Функція для переходу до наступного кроку
    function nextStep() {
        if (currentStep < totalSteps) {
            currentStep++;
            updateDisplay();
        }
    }
    
    // Функція для переходу до попереднього кроку
    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
            updateDisplay();
        }
    }
    
    // Обробники подій для кнопок
    nextBtn.addEventListener('click', nextStep);
    prevBtn.addEventListener('click', prevStep);
    
    // Обробник для кнопки завершення
    submitBtn.addEventListener('click', function() {
        // Збираємо всі дані з форми
        const formData = {};
        
        // Збираємо дані з радіо-кнопок
        document.querySelectorAll('input[type="radio"]:checked').forEach(input => {
            formData[input.name] = input.value;
        });
        
        // Збираємо дані з чекбоксів
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            if (!formData[input.name]) {
                formData[input.name] = [];
            }
            if (Array.isArray(formData[input.name])) {
                formData[input.name].push(input.value);
            }
        });
        
        // Збираємо дані з полів вводу
        document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"]').forEach(input => {
            if (input.value) {
                formData[input.name] = input.value;
            }
        });
        
        // Виводимо дані в консоль (тут можна додати відправку на сервер)
        console.log('Дані конфігурації:', formData);
        
        // Показуємо повідомлення про успішне завершення
        alert('Конфігурацію завершено успішно! Дані збережено.');
        
        // Можна перенаправити на сторінку підтвердження або назад на головну
        // window.location.href = 'index.html';
    });
    
    // Ініціалізація
    updateDisplay();
    
    // Додаємо підтримку клавіатури
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
            prevStep();
        } else if (e.key === 'ArrowRight' && !nextBtn.disabled && currentStep < totalSteps) {
            nextStep();
        }
    });
});

