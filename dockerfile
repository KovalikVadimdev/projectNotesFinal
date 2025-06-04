FROM php:8.2-fpm

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev libjpeg-dev libfreetype6-dev gnupg \
    && docker-php-ext-install pdo_mysql zip

# Установка Node.js (LTS) и npm
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Копируем исходный код
WORKDIR /var/www
COPY . .

# Установка PHP-зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader

# Установка Node.js-зависимостей и сборка фронтенда
RUN npm install 
RUN php artisan serve
# RUN npm run dev
# Кеширование конфигурации, роутов и вьюшек
# RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Порт приложения
EXPOSE 8000

# Запуск Laravel через встроенный сервер (или можно через nginx/php-fpm отдельно)
CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]