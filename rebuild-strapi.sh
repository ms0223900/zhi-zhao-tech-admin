# pull latest code
git pull

# down strapi service
docker-compose down strapi -v

# up strapi service
docker-compose up --build --no-cache --force-recreate strapi -d