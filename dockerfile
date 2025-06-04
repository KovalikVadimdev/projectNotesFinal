FROM php:8.2-fpm

# Установка системных зависимостей и PHP-расширений
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev libjpeg-dev libfreetype6-dev gnupg nginx nodejs npm supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd mbstring xml

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Копируем исходный код приложения
WORKDIR /var/www
COPY . .

# Установка PHP-зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader

# Установка Node.js-зависимостей и сборка фронтенда
RUN npm install && npm run prod

# Кеширование конфигурации, роутов и вьюшек
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

# Настройка прав (важно для storage и bootstrap/cache)
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Копируем конфигурацию nginx и supervisor
COPY ./docker/nginx.conf /etc/nginx/sites-available/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose порт 80
EXPOSE 80

# Запуск supervisor для php-fpm и nginx
CMD ["/usr/bin/supervisord", "-n"]
