FROM node:24

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
RUN npm install

# do i need this?
ENV VITE_BACKEND_URL=/api

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]
