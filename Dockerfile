# Use Node.js LTS como imagem base
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package.json package-lock.json ./

# Instala todas as dependências (incluindo devDependencies para tsx)
RUN npm ci

# Copia o restante do código
COPY . .

# Expõe a porta da aplicação
EXPOSE 3333

# Define variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3333

# Comando para iniciar a aplicação
CMD ["npm", "run", "start"]
