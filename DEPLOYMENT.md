# Deployment Guide

## Docker

### Build images

```bash
docker build -t grc-backend:1.0 ./backend
docker build -t grc-frontend:1.0 ./frontend
```

### Run locally

```bash
docker compose up --build
```

Then access:
- Frontend: http://localhost:4200
- Backend: http://localhost:8083
- Swagger: http://localhost:8083/swagger-ui.html
- MySQL: localhost:3306

## Kubernetes

### Apply manifests

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/mysql-pvc.yaml
kubectl apply -f k8s/mysql-deployment.yaml
kubectl apply -f k8s/mysql-service.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Check status

```bash
kubectl get pods -n grc
kubectl get svc -n grc
kubectl get ingress -n grc
kubectl logs deploy/backend -n grc
kubectl logs deploy/frontend -n grc
```

## Secrets

Never commit real secret values.

Create or update them with:

```bash
kubectl create secret generic grc-secrets -n grc \
  --from-literal=SPRING_DATASOURCE_PASSWORD='...' \
  --from-literal=OPENROUTER_API_KEY='...' \
  --from-literal=KEY_SECRET='...' \
  --from-literal=ADMIN_EMAIL='admin@gmail.com' \
  --from-literal=ADMIN_PASSWORD='...' \
  --dry-run=client -o yaml > k8s/secret.yaml
```

## Images

For local development you can use local tags such as:
- `grc-backend:1.0`
- `grc-frontend:1.0`

If you use a registry, push with a registry prefix, for example:
- `docker.io/username/grc-backend:1.0`
- `docker.io/username/grc-frontend:1.0`

## Troubleshooting

### CrashLoopBackOff
- Check logs: `kubectl logs <pod> -n grc`
- Verify env vars and secrets
- Check if the database is ready

### ImagePullBackOff
- Make sure the image exists locally or in your registry
- For Minikube: `minikube image load grc-backend:1.0` and `minikube image load grc-frontend:1.0`

### Connection refused
- Confirm the backend service and database service names are correct
- Back-end must use `mysql` and not `localhost`

### MySQL not ready
- Wait for MySQL readiness probe success
- Check database logs

### CORS issues
- Verify `APP_CORS_ORIGIN` matches the frontend origin
- Prefer same-origin through ingress instead of wildcard

### OpenRouter issues
- Ensure `OPENROUTER_API_KEY` is set as a secret on backend
- Confirm the backend can reach `https://openrouter.ai/api/v1`

### Angular API URL
- Set `API_URL` at runtime via `window.__env.API_URL` or Nginx env injection
- Do not hardcode `localhost` in the production build

### Ingress
- Ensure the ingress controller is installed
- For local dev, add `grc.local` to your hosts file if needed

```bash
127.0.0.1 grc.local
```
