#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Шляхи
const distDir = path.join(__dirname, '..', 'dist');
const srcDir = path.join(__dirname, '..', 'src');

console.log('🔧 Виправляємо dist для офлайн-сумісності...');

// Копіюємо JS файли з src/js (якщо вони не модульні)
const jsDir = path.join(srcDir, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
  jsFiles.forEach(file => {
    const srcPath = path.join(jsDir, file);
    const distJsDir = path.join(distDir, 'js');
    
    if (!fs.existsSync(distJsDir)) {
      fs.mkdirSync(distJsDir, { recursive: true });
    }
    
    const distPath = path.join(distJsDir, file);
    
    // Копіюємо тільки якщо файл не є модульним (не main.js, який збирається Vite)
    if (file !== 'main.js' && fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, distPath);
      console.log(`✅ Скопійовано ${file}`);
    }
  });
}

// Оновлюємо HTML файл
const htmlPath = path.join(distDir, 'index.html');
if (fs.existsSync(htmlPath)) {
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Видаляємо модульний скрипт з head (якщо потрібно)
  htmlContent = htmlContent.replace(
    /<script[^>]*type="module"[^>]*><\/script>/g,
    ''
  );

  // Видаляємо crossorigin з CSS посилань для офлайн-сумісності
  htmlContent = htmlContent.replace(
    /<link rel="stylesheet" crossorigin[^>]*href="([^"]+)"[^>]*>/g,
    '<link rel="stylesheet" href="$1">'
  );

  // Оновлюємо шляхи до JS файлів
  htmlContent = htmlContent.replace(
    /<script src="\.\/src\/js\/([^"]+)"><\/script>/g,
    (match, filename) => {
      if (filename === 'main.js') {
        // Знаходимо згенерований main файл
        const jsDir = path.join(distDir, 'js');
        if (fs.existsSync(jsDir)) {
          const files = fs.readdirSync(jsDir);
          const mainFile = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
          if (mainFile) {
            return `<script src="./js/${mainFile}"></script>`;
          }
        }
      }
      return `<script src="./js/${filename}"></script>`;
    }
  );

  fs.writeFileSync(htmlPath, htmlContent);
  console.log('✅ Оновлено index.html');
} else {
  console.log('❌ HTML файл не знайдено');
}

console.log('🎉 Готово! Тепер dist працює офлайн.');

