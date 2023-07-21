FROM php:7.4-fpm

COPY composer.lock composer.json /var/www/html/web_market_prod/

WORKDIR /var/www/html/web_market_prod

RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    build-essential \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    libzip-dev \
    unzip \
    git \
    libonig-dev \
    curl

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install gd

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN npm install

COPY . /var/www/html/web_market_prod/

RUN chown -R www-data:www-data /var/www/html/web_market_prod

EXPOSE 9000

CMD ["php-fpm"]
