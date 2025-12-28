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

// Копіюємо зображення з configurator (рекурсивно)
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (!entry.name.startsWith('.DS_Store')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const configuratorImagesSrc = path.join(srcDir, 'images', 'configurator');
const configuratorImagesDest = path.join(distDir, 'images', 'configurator');

if (fs.existsSync(configuratorImagesSrc)) {
  copyDirectory(configuratorImagesSrc, configuratorImagesDest);
  console.log('✅ Скопійовано зображення configurator');
}

// Функція для обробки HTML файлів
function processHtmlFile(htmlPath, filename) {
  if (!fs.existsSync(htmlPath)) {
    console.log(`❌ HTML файл ${filename} не знайдено`);
    return;
  }

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

  // Оновлюємо шляхи до CSS файлів (з src/css/ на css/)
  htmlContent = htmlContent.replace(
    /<link rel="stylesheet" href="\.\/src\/css\/([^"]+)"[^>]*>/g,
    (match, cssFile) => {
      // Знаходимо згенерований CSS файл
      const cssDir = path.join(distDir, 'css');
      if (fs.existsSync(cssDir)) {
        const files = fs.readdirSync(cssDir);
        // Шукаємо файл, який містить назву оригінального файлу
        const cssFileName = cssFile.replace('.css', '');
        const foundFile = files.find(f => f.includes(cssFileName) && f.endsWith('.css'));
        if (foundFile) {
          return `<link rel="stylesheet" href="./css/${foundFile}">`;
        }
      }
      return `<link rel="stylesheet" href="./css/${cssFile}">`;
    }
  );

  // Оновлюємо шляхи до зображень (з src/images/ на images/)
  htmlContent = htmlContent.replace(
    /src="\.\/src\/images\/([^"]+)"/g,
    (match, imagePath) => {
      // Знаходимо згенероване зображення
      const imagesDir = path.join(distDir, 'images');
      const imageName = path.basename(imagePath);
      const imageNameWithoutExt = path.parse(imageName).name;
      
      if (fs.existsSync(imagesDir)) {
        // Рекурсивно шукаємо файл
        function findImage(dir, targetName) {
          const files = fs.readdirSync(dir, { withFileTypes: true });
          for (const file of files) {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
              const found = findImage(fullPath, targetName);
              if (found) return found;
            } else if (file.name.includes(imageNameWithoutExt)) {
              return path.relative(distDir, fullPath).replace(/\\/g, '/');
            }
          }
          return null;
        }
        
        const foundImage = findImage(imagesDir, imageNameWithoutExt);
        if (foundImage) {
          return `src="./${foundImage}"`;
        }
      }
      return `src="./images/${imagePath}"`;
    }
  );

  // Виправляємо абсолютні посилання на HTML файли (з / на ./)
  htmlContent = htmlContent.replace(
    /href="\/([^"]+\.html)"/g,
    'href="./$1"'
  );

  // Оновлюємо шляхи до JS файлів (обробляємо обидва варіанти: з ./ і без)
  htmlContent = htmlContent.replace(
    /<script src="(\.\/)?src\/js\/([^"]+)"><\/script>/g,
    (match, optionalDot, jsFilename) => {
      const jsDir = path.join(distDir, 'js');
      if (fs.existsSync(jsDir)) {
        const files = fs.readdirSync(jsDir);
        
        if (jsFilename === 'main.js') {
          // Знаходимо згенерований main файл
          const mainFile = files.find(f => f.startsWith('main-') && f.endsWith('.js'));
          if (mainFile) {
            return `<script src="./js/${mainFile}"></script>`;
          }
        } else if (jsFilename === 'configurator.js') {
          // Для configurator.js перевіряємо, чи є згенерований файл Vite
          const configuratorFile = files.find(f => f.startsWith('configurator-') && f.endsWith('.js') && !f.endsWith('.map'));
          if (configuratorFile) {
            return `<script src="./js/${configuratorFile}"></script>`;
          }
          // Якщо немає згенерованого, використовуємо скопійований файл
          return `<script src="./js/${jsFilename}"></script>`;
        }
      }
      return `<script src="./js/${jsFilename}"></script>`;
    }
  );

  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ Оновлено ${filename}`);
}

// Оновлюємо HTML файли
processHtmlFile(path.join(distDir, 'index.html'), 'index.html');
processHtmlFile(path.join(distDir, 'configurator.html'), 'configurator.html');

console.log('🎉 Готово! Тепер dist працює офлайн.');

