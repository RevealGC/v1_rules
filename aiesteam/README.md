
# Steps to run the application

```sh
# Install the required npm packages
npm install

# Copy the files that are updated to achieve the custom functionality 
cp custom-files/asyncruleevaluator-index.js node_modules/async-rule-evaluator/build/index.js
cp custom-files/asyncruleevaluator-parser.js node_modules/async-rule-evaluator/parser.js

# Excute the application (nodemon -r esm app.js)
npm run dev
```

# Steps to build and run docker image

```sh
# Build image
docker build . -t <image tag>

# Run the container in dev mode - displays logs
docker run -it -p 8000:80 <container_id/tag>

# Run the container in detached mode
docker run -d -p 8000:80 <container_id/tag>
```