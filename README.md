# README.md

# My Django Todo App

Ce projet est une application de liste de tâches construite avec Django pour le backend et React.js avec TailwindCSS pour le frontend. L'application permet aux utilisateurs de créer, modifier, supprimer, archiver, réorganiser (Drag & Drop) et filtrer des tâches.

## Structure du projet

Le projet est organisé comme suit :

```
my-django-todo-app
├── backend
│   ├── manage.py               # Script principal pour gérer le projet Django
│   ├── backend                 # Dossier contenant les fichiers de configuration Django
│   ├── tasks                   # Dossier contenant les modèles et la logique des tâches
│   ├── templates               # Dossier contenant les templates HTML
│   ├── static                  # Dossier contenant les fichiers statiques (CSS, JS)
│   └── tailwind                # Dossier pour la configuration de TailwindCSS
├── frontend                    # Dossier contenant le frontend React
│   ├── src                     # Dossier source pour les composants React
│   ├── public                  # Dossier contenant le fichier HTML principal
├── README.md                   # Documentation générale pour le projet
└── requirements.txt            # Dépendances Python nécessaires pour le backend
```

## Fonctionnalités

- **Ajout de tâches** : Ajoutez de nouvelles tâches à votre liste.
- **Modification de tâches** : Modifiez le texte des tâches existantes.
- **Suppression de tâches** : Supprimez des tâches individuelles.
- **Archivage de tâches** : Archivez et désarchivez des tâches.
- **Réorganisation des tâches** : Réorganisez les tâches par glisser-déposer (drag & drop).
- **Suppression des tâches complétées** : Supprimez toutes les tâches complétées en une seule action.
- **Filtrage des tâches** : Filtrez les tâches par statut (toutes, actives, complétées).
- **Recherche de tâches** : Recherchez des tâches par texte.

## Installation

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Cheikh-Dev99/my-django-todo-app.git
   cd my-django-todo-app
   ```

2. Installez les dépendances du backend :

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Configurez la base de données dans `backend/backend/settings.py`.

4. Exécutez les migrations :

   ```bash
   python manage.py migrate
   ```

5. Démarrez le serveur Django :

   ```bash
   python manage.py runserver
   ```

6. Dans un autre terminal, installez les dépendances du frontend :

   ```bash
   cd frontend
   npm install
   ```

7. Démarrez l'application React :

   ```bash
   npm start
   ```

## Utilisation

- Accédez à l'application via `http://localhost:5173` pour le frontend.
- Utilisez l'interface pour ajouter, modifier, supprimer, archiver, réorganiser et filtrer vos tâches.

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des demandes de tirage ou à signaler des problèmes.

## Licence

Ce projet est un projet d'etude personel de : CheikhDev99