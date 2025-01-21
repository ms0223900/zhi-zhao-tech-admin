# pull latest code
git pull

# down strapi service
docker-compose down strapi

# up strapi service
docker-compose up --build --force-recreate strapi -d