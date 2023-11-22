FROM node AS builder
WORKDIR /doc_f
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /doc_f/dist/doc_f /usr/share/nginx/html
EXPOSE 80

RUN chown -R nginx:nginx /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
