FROM php:8.2-fpm

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    git curl zip unzip libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-install pdo_mysql zip

# Установка Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Копируем код
WORKDIR /var/www
COPY . .

# Установка зависимостей Laravel
RUN composer install --no-dev --optimize-autoloader

# Генерация ключа (если нужен)
# RUN php artisan key:generate

EXPOSE 8000

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT}"]