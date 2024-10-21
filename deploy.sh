
SERVER_PASSWORD=""
SERVER_URL=

git archive -o ./deploy.zip HEAD
sshpass -p $SERVER_PASSWORD scp ./deploy.zip root@$SERVER_URL:/home/deploy/cchat/backend/deploy.zip

sshpass -p $SERVER_PASSWORD ssh root@$SERVER_URL "
  cd /home/deploy/cchat/backend/
  unzip -o deploy.zip
  npm run build
  su - deploy
  pm2 restart cchat-backend
"