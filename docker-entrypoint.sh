#!/bin/bash

chmod 777 -R storage bootstrap/cache
chmod 777 -R public/

php artisan key:generate --force
php artisan optimize

exec "$@"
