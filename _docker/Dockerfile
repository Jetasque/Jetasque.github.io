# Site public de Clipotheque servi par nginx (image legere, aucun secret).
# Construction depuis la racine du depot :
#   docker build -f _docker/Dockerfile -t clipotheque-site .
FROM nginx:1.28-alpine

# Configuration du serveur (cache, compression, en-tetes de securite).
COPY _docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY _docker/securite.conf /etc/nginx/securite.conf

# Contenu du site : meme arborescence que GitHub Pages.
COPY index.html /usr/share/nginx/html/index.html
COPY clipotheque/ /usr/share/nginx/html/clipotheque/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/sante || exit 1
