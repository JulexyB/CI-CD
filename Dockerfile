FROM php:8.2-apache

# Instala las dependencias del sistema necesarias para compilar la extensión curl
RUN apt-get update && apt-get install -y \
    libcurl4-openssl-dev \
    && docker-php-ext-install curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copia el proyecto a la carpeta pública de Apache
COPY . /var/www/html/

EXPOSE 80