FROM node:18

WORKDIR /src
COPY . .

RUN npm install
RUN cp custom-files/asyncruleevaluator-index.js node_modules/async-rule-evaluator/build/index.js
RUN cp custom-files/asyncruleevaluator-parser.js node_modules/async-rule-evaluator/parser.js

EXPOSE 80

# RUN npm i -g nodemon

CMD ["npm", "run", "dev"]

# CMD ["nodemon", "-r", "esm", "app.js"]
