FROM php:8.2-apache

# Habilita la extensión curl (necesaria para response.php -> API de PayPhone)
RUN docker-php-ext-install curl

# Copia el proyecto a la carpeta pública de Apache
COPY . /var/www/html/

EXPOSE 80
