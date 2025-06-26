#!/bin/bash

echo "📦 Génération du kubeconfig portable..."

KUBECONFIG_PATH="$HOME/.kube/config"
CRT_PATH="$HOME/.minikube/profiles/minikube/client.crt"
KEY_PATH="$HOME/.minikube/profiles/minikube/client.key"
CA_PATH="$HOME/.minikube/ca.crt"

# Vérifie l'existence
if [[ ! -f $CRT_PATH || ! -f $KEY_PATH || ! -f $CA_PATH || ! -f $KUBECONFIG_PATH ]]; then
  echo "❌ Un ou plusieurs fichiers sont manquants (client.crt, client.key, ca.crt, config)."
  exit 1
fi

# Copie kubeconfig
cp "$KUBECONFIG_PATH" kubeconfig.yaml

# Encode les certificats
CRT_B64=$(base64 -w0 "$CRT_PATH")
KEY_B64=$(base64 -w0 "$KEY_PATH")
CA_B64=$(base64 -w0 "$CA_PATH")

# Remplace les chemins par les données encodées
sed -i "s|client-certificate:.*|client-certificate-data: $CRT_B64|" kubeconfig.yaml
sed -i "s|client-key:.*|client-key-data: $KEY_B64|" kubeconfig.yaml
sed -i "s|certificate-authority:.*|certificate-authority-data: $CA_B64|" kubeconfig.yaml

# Supprime les lignes inutiles si encore présentes
sed -i '/client-certificate:/d' kubeconfig.yaml
sed -i '/client-key:/d' kubeconfig.yaml
sed -i '/certificate-authority:/d' kubeconfig.yaml

echo "✅ kubeconfig.yaml généré."

# Montre le contenu encodé à copier dans GitHub Secrets
echo ""
echo "🔐 Ajoute ce bloc dans GitHub > Settings > Secrets > Actions > Nouveau secret (KUBECONFIG) :"
echo ""
base64 -w0 kubeconfig.yaml
echo ""
