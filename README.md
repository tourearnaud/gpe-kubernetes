# GPE
Déploiement Kubernetes local d’une appli React + .NET + MySQL avec Minikube
📌 Objectif
Déployer en local (via Minikube) une application full-stack composée de :

Une API .NET

Un frontend React + Nginx

Une base de données MySQL

Le tout orchestré via Kubernetes (YAML)

Préparation pour la certification CKA.

🧱 Architecture
rust
Copier
Modifier
[ Frontend React + Nginx ] <---> [ API .NET ] <---> [ MySQL ]
         (Service)                 (Service)         (Service)
              \                      |                   |
         (port-forward)         (port-forward)     (ClusterIP)
⚙️ Technologies
.NET 6 API (EF Core, MySQL)

React + Nginx

MySQL 8

Docker

Kubernetes (via Minikube)

kubectl CLI

🪜 Étapes réalisées
✅ 1. Build des images Docker
bash
Copier
Modifier
# Backend .NET
docker build -t gpe-api -f Dockerfile .

# Frontend React + Nginx
docker build -t gpe-front -f Dockerfile .
✅ 2. Démarrage de Minikube
bash
Copier
Modifier
minikube start
✅ 3. Chargement des images dans Minikube
bash
Copier
Modifier
minikube image load gpe-api
minikube image load gpe-front
✅ 4. Déploiement Kubernetes
bash
Copier
Modifier
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/front-deployment.yaml

kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/api-service.yaml
kubectl apply -f k8s/front-service.yaml
✅ 5. Vérification des pods
bash
Copier
Modifier
kubectl get pods
✅ 6. Debug de connexion API <-> MySQL
Problème :
ping mysql dans le pod API échouait

Connexion MySQL KO

Résolution :
Changer 127.0.0.1 en mysql dans appsettings.json :

json
Copier
Modifier
"ConnectionStrings": {
  "DefaultConnection": "server=mysql;database=GPE;user=toure;password=root"
}
Rebuild + reload image :

bash
Copier
Modifier
docker build -t gpe-api .
minikube image load gpe-api
kubectl delete pod <nom-pod-api>
✅ 7. Test MySQL depuis un pod client
bash
Copier
Modifier
kubectl run -it --rm mysql-client --image=mysql:8 -- bash

# Puis dans le shell MySQL
mysql -h mysql -u toure -p
# password: root
✅ 8. Injection manuelle de la base de données
bash
Copier
Modifier
kubectl cp dump.sql mysql-pod:/tmp/
kubectl exec -it mysql-pod -- bash
mysql -u toure -p GPE < /tmp/dump.sql
✅ 9. Vérification API & React
bash
Copier
Modifier
kubectl port-forward svc/gpe-api-service 8090:80
kubectl port-forward svc/gpe-front-service 3000:80

curl http://localhost:8090/articles
# Résultat : []
✅ Commandes kubectl importantes utilisées aujourd’hui
bash
Copier
Modifier
kubectl get pods
kubectl get svc
kubectl logs <pod-name>
kubectl exec -it <pod-name> -- bash
kubectl delete pod <pod-name>
kubectl run -it --rm mysql-client --image=mysql:8 -- bash
kubectl port-forward svc/gpe-api-service 8090:80
kubectl port-forward svc/gpe-front-service 3000:80
🛠️ Problèmes rencontrés
Problème	Solution
API ne voit pas la BDD	Modifier server=127.0.0.1 → server=mysql
Port-forward API échoue	Relancer pod, rebuild image
Base vide	Injection manuelle d’un dump SQL

📂 Arborescence recommandée
bash
Copier
Modifier
GPE/
│
├── api/                  # .NET backend
│   └── Dockerfile
│
├── front/                # React frontend
│   └── Dockerfile
│
├── k8s/                  # Tous les fichiers YAML
│   ├── mysql-deployment.yaml
│   ├── mysql-service.yaml
│   ├── api-deployment.yaml
│   ├── api-service.yaml
│   └── front-deployment.yaml
│   └── front-service.yaml
│
├── dump.sql              # Sauvegarde MySQL
└── README.md             # Ce fichier
🚀 Pour relancer à zéro
bash
Copier
Modifier
minikube delete
minikube start
minikube image load gpe-api
minikube image load gpe-front
kubectl apply -f k8s/
kubectl port-forward svc/gpe-api-service 8090:80
kubectl port-forward svc/gpe-front-service 3000:80



🗓️ Date : 21 Juin 2025
🎯 Objectif du jour
Configurer un Ingress NGINX unique pour exposer à la fois le front React (gpe-front-service) et l’API backend (gpe-api-service) sur le même hostname gpe.local dans Kubernetes, avec gestion fine du rewrite d’URL.

🚨 Problèmes rencontrés
Front-end inaccessible via Ingress, alors que l’API fonctionnait.

En port-forward, les deux fonctionnaient.

Impossible d’avoir deux Ingress séparés (même hostname et IP).

Le rewrite automatique mal configuré cassait le front.

🛠️ Solutions mises en place
Ingress unique avec annotation configuration-snippet pour rewrite conditionnel uniquement sur /api.

Utilisation d’une regex pour matcher les URLs /api/... et enlever /api avant de router vers l’API.

Pas de rewrite sur le front, qui reste accessible sur /.

🔥 Code Ingress final :
yaml
Copier
Modifier
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gpe-ingress
  annotations:
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      if ($request_uri ~* "^/api/(.*)") {
        rewrite ^/api/(.*) /$1 break;
      }
spec:
  ingressClassName: nginx
  rules:
    - host: gpe.local
      http:
        paths:
          - path: /api(/|$)(.*)
            pathType: Prefix
            backend:
              service:
                name: gpe-api-service
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: gpe-front-service
                port:
                  number: 80
📋 Commandes kubectl utilisées
bash
Copier
Modifier
# Voir les pods et vérifier leur état
kubectl get pods

# Voir les logs du pod front pour vérifier les requêtes entrantes
kubectl logs gpe-front-5d945fc5fb-6nrkj

# Appliquer la configuration ingress
kubectl apply -f ingress-gpe.yaml

# Vérifier les ingress déployés
kubectl get ingress

# Debug avec port-forward (en local) pour tester front et api
kubectl port-forward svc/gpe-front-service 3000:80
kubectl port-forward svc/gpe-api-service 4000:80
✅ Résultats
Front et API accessibles via http://gpe.local avec Ingress.

Navigation privée OK.

Pas besoin de plusieurs IP ni hostname.

Requête /api correctement réécrite pour l’API.

Front servi sans rewrite.

