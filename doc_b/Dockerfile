FROM node 
WORKDIR /doc_b 
COPY package.json .
RUN npm i 

COPY . . 
EXPOSE $PORT 
VOLUME ["/doc_b/data"] 

CMD ["npm", "start"] 
