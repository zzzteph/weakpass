FROM dunglas/frankenphp

WORKDIR /weakpass

COPY . .

RUN apt-get update && apt-get install -y  git zip 7zip && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN install-php-extensions \
    pcntl

RUN composer install --no-interaction --prefer-dist --optimize-autoloader
RUN composer require laravel/octane --no-interaction

RUN php artisan key:generate \
 && php artisan storage:link \
&& php artisan octane:install --server=frankenphp

ENTRYPOINT ["php", "artisan", "octane:frankenphp"]