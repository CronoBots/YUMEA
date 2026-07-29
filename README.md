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
│   ├── favicon.svg
│   └── ritual-*.png    # cartes détaillées (non affichées — usage interne / futur)
└── README.md
```

## Lancer en local

Aucune dépendance ni build. Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Déploiement

Site 100 % statique — déployable tel quel sur n'importe quel hébergeur (Netlify, Vercel, GitHub Pages, OVH, o2switch…) pour le domaine **yumea-wellness.be**.

## Notes

- Les images des cartes de rituels (`assets/ritual-*.png`) contiennent les protocoles détaillés et **ne sont volontairement pas affichées** sur le site public. Elles restent disponibles pour un usage interne ou une évolution future.
- Aucun système de réservation en ligne n'est intégré : les boutons « Réserver » ouvrent l'appel téléphonique. Il pourra être branché sur un outil de prise de rendez-vous par la suite.
- Les liens réseaux sociaux pointent vers les pages Instagram, Facebook et la recherche Google de l'institut.
