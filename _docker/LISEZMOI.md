# Héberger le site Clipothèque avec Docker

Le site est statique (HTML, CSS, images, une vidéo). Il est servi par nginx dans un petit conteneur
(image `nginx:1.28-alpine`, environ 50 Mo). Aucune base de données, aucun secret, aucune variable
à renseigner.

## Prérequis

- Docker Engine 24 ou plus récent avec le plugin `docker compose` (Docker Desktop sous Windows et Mac).
- Git, pour récupérer le site et ses mises à jour.

## Installation

```bash
git clone https://github.com/Jetasque/Jetasque.github.io.git
cd Jetasque.github.io/_docker
docker compose up -d --build
```

Le site répond ensuite sur http://ADRESSE-DE-LA-MACHINE:8080/clipotheque/ (la racine `/` redirige
vers `/clipotheque/`). Vérification rapide : `curl http://127.0.0.1:8080/sante` doit répondre `ok`.

## Changer le port

Par défaut le conteneur écoute sur le port 8080 de la machine. Pour un autre port, créer un fichier
`.env` dans le dossier `_docker` :

```
PORT=80
```

puis relancer `docker compose up -d`.

## Redémarrage automatique

Le service est configuré avec `restart: unless-stopped` : il repart tout seul après un plantage ou
un redémarrage de la machine, tant que le service Docker démarre au boot
(`sudo systemctl enable docker` sous Linux). Il ne s'arrête que sur un `docker compose down` ou
`docker compose stop`.

Docker vérifie aussi l'état du site toutes les 30 secondes (`docker ps` affiche `healthy`).

## Mettre à jour le site

Quand Kilian publie une modification sur GitHub :

```bash
cd Jetasque.github.io
git pull
cd _docker
docker compose up -d --build
```

Le conteneur est remplacé en quelques secondes. Pour faire le ménage des anciennes images :
`docker image prune -f`.

## Variante sans Git : image toute prête

Chaque construction sur GitHub produit l'image exportée `clipotheque-site.tar.gz` (onglet Actions du
dépôt, workflow « Image Docker du site », section Artifacts, conservée 30 jours). Sur la machine :

```bash
docker load -i clipotheque-site.tar.gz
docker run -d --name clipotheque-site --restart unless-stopped -p 8080:80 clipotheque-site:latest
```

Pour une mise à jour, charger la nouvelle archive, puis `docker rm -f clipotheque-site` et relancer
la même commande `docker run`.

## HTTPS avec un nom de domaine

Le conteneur sert du HTTP simple : le HTTPS se fait devant lui, par un reverse proxy.

Si un reverse proxy existe déjà (nginx, Traefik, Caddy, Nginx Proxy Manager), il suffit de le faire
pointer vers `http://127.0.0.1:8080`.

Sinon, le plus simple est Caddy, qui obtient et renouvelle seul le certificat Let's Encrypt. Le nom
de domaine doit déjà pointer vers la machine, et les ports 80 et 443 doivent être ouverts.
Fichier `Caddyfile` (remplacer le domaine) :

```
site.exemple.fr {
    reverse_proxy clipotheque-site:80
}
```

Service à ajouter dans `docker-compose.yml`, sous `services:` :

```yaml
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
    depends_on:
      - site
```

et à la fin du fichier :

```yaml
volumes:
  caddy_data:
```

Dans ce cas, retirer la section `ports` du service `site` (Caddy lui parle directement par le réseau
Docker), puis `docker compose up -d`.

## Commandes utiles

| Action | Commande (dans `_docker`) |
|---|---|
| Voir l'état | `docker compose ps` |
| Voir les journaux | `docker compose logs -f` |
| Arrêter | `docker compose down` |
| Redémarrer | `docker compose restart` |

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `Dockerfile` | Image nginx avec le site copié dedans |
| `nginx.conf` | Cache, compression, page de santé `/sante` |
| `securite.conf` | En-têtes de sécurité (CSP, nosniff, anti-iframe) |
| `docker-compose.yml` | Lancement, port, redémarrage automatique, rotation des journaux |
| `verifier-page.mjs` | Test automatique des pages, utilisé par GitHub Actions |

Le dossier commence par `_` pour que GitHub Pages ne le publie pas : le site actuel
(jetasque.github.io/clipotheque) reste inchangé.
