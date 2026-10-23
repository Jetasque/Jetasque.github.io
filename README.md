# Site de Clipothèque

Site public : https://jetasque.github.io/clipotheque/

- `clipotheque/config.js` : liens d'achat Lemon Squeezy
- `clipotheque/version.json` : dernière version (lue par l'application pour proposer les mises à jour)

## Conformité légale

Pages légales, toutes reliées dans le pied de page de chaque page du site :

| Page | Contenu |
|---|---|
| `clipotheque/mentions-legales.html` | Éditeur, directeur de la publication, hébergeur (GitHub Pages), vente via Lemon Squeezy |
| `clipotheque/cgu.html` | Conditions d'utilisation : bon usage, contenus de tiers, propriété intellectuelle, logiciel fourni en l'état, responsabilité, droit français |
| `clipotheque/cgv.html` | Conditions de vente et de licence (offres, 3 PC par clé, rétractation) |
| `clipotheque/remboursement.html` | Remboursement sous 14 jours |
| `clipotheque/confidentialite.html` | Données traitées, bases légales, durées de conservation, droits RGPD |
| `clipotheque/signalement.html` | Signalement de contenu illicite (art. 6 LCEN, DSA, DMCA) |

Les champs encore à compléter par l'éditeur sont marqués `A COMPLETER` en commentaire HTML
(`grep -rn "A COMPLETER" clipotheque/`).

Cookies et traceurs : le site ne dépose aucun cookie, n'utilise ni LocalStorage ni IndexedDB, et
ne charge aucune ressource tierce (polices, vidéo et scripts sont servis par le site). Il n'y a donc
pas de bandeau de consentement. Si un outil de mesure d'audience, une vidéo intégrée (YouTube...)
ou un script externe est ajouté un jour, il faudra d'abord ajouter un bandeau de consentement qui
bloque ce chargement tant que le visiteur n'a pas accepté, et mettre à jour la politique de
confidentialité.

Sécurité : le site est servi uniquement en HTTPS (GitHub Pages, option « Enforce HTTPS »). Les liens
de paiement s'ouvrent dans un nouvel onglet avec `rel="noopener noreferrer"`. Aucun contenu saisi
par un visiteur n'est injecté dans la page.

Ces documents sont une base de travail et ne constituent pas un avis juridique.

## Licence

Tous droits réservés, voir `LICENSE`. La police Geist reste sous SIL Open Font License 1.1.
