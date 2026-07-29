# YUMÉA Wellness — Site vitrine

Site vitrine premium pour **YUMÉA Wellness**, institut dédié au Head Spa japonais, au bien-être et aux soins du visage et du cuir chevelu à Flémalle (Belgique).

> _Du rêve au bien-être._

## Aperçu

Site **one-page** immersif, pensé pour être découvert au défilement (façon album / slides) plutôt que lu en longs paragraphes. Design haut de gamme, épuré et chaleureux.

- **Palette** : vert émeraude · beige naturel · détails dorés
- **Typographies** : Cormorant Garamond (serif élégant), Jost (sans épuré), Pinyon Script (accents calligraphiés)
- **Motifs** : fleur de cerisier (sakura) rappelant le logo, pétales dorés en animation légère
- **Animations** : révélation au scroll, nav flottante, menu mobile

### Sections

1. **Accueil** — logo, signature, appels à l'action
2. **L'expérience** — l'univers YUMÉA en 3 idées
3. **Les rituels** — SAKURA · ATSU · Enfants (nom, durée, prix, une phrase — sans dévoiler les protocoles détaillés)
4. **La fondatrice** — Jessica Séré, sa vocation et ses spécialisations
5. **Les bienfaits** du Head Spa
6. **Sur-mesure** — bulle olfactive & synergie personnalisée
7. **Contact** — adresse, rendez-vous, réseaux, itinéraire

## Structure

```
.
├── index.html          # page unique
├── css/styles.css      # styles & design system
├── js/main.js          # scroll reveal, nav, menu mobile, pétales
├── assets/
│   ├── logo.jpeg
│   └── favicon.svg
├── .nojekyll           # sert les fichiers tels quels (pas de traitement Jekyll)
└── README.md
```

## Lancer en local

Aucune dépendance ni build. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Déploiement (GitHub Pages)

Le site est publié via **GitHub Pages**, en mode _« Deploy from a branch »_ :

- **Source** : branche `main`, dossier racine (`/`)
- **URL** : https://cronobots.github.io/YUMEA/
- Chaque push sur `main` redéclenche automatiquement la mise en ligne.

Le fichier `.nojekyll` désactive le traitement Jekyll pour que les fichiers
soient servis tels quels.

> Pour brancher le domaine **yumea-wellness.be** : ajouter un fichier `CNAME`
> contenant le domaine à la racine, puis configurer les DNS chez le
> registrar (enregistrement `CNAME` → `cronobots.github.io`).

## Notes

- Les cartes de rituels détaillées (protocoles complets) **ne sont pas versionnées
  dans le dépôt** : le dépôt étant public, elles resteraient téléchargeables. Elles
  sont conservées hors dépôt pour protéger le savoir-faire de l'institut.
- Aucun système de réservation en ligne n'est intégré : les boutons « Réserver » ouvrent l'appel téléphonique. Il pourra être branché sur un outil de prise de rendez-vous par la suite.
- Les liens réseaux sociaux pointent vers les pages Instagram, Facebook et la recherche Google de l'institut.
