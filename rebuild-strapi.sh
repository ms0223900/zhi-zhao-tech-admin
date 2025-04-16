# pull latest code
git pull

# prune dangling images and builder cache
docker image prune -f
docker builder prune -f

# down strapi service
docker-compose down strapi -v

# up strapi service
docker-compose up --build --force-recreate strapi -d