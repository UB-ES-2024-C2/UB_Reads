FROM node:20.18.0

# Set working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies and build
RUN npm install

# Copy the code
COPY . .

# Expose the server port
EXPOSE 5173

# Run
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]