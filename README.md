# After you fork and clone this repo, do the following:

## Create a .env file and put the following details there

```bash
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=supersecretjwtkey
JWT_EXPIRES_IN=1h
```

## then:

```bash
cd fontend
npm install
```

```bash
cd ..
cd backend
npm install
```

## To run the frontend:
### make sure you are in the frontend folder
```bash
ng serve
```

## To run the backend
### make sure you are in the backend folder
```bash
npm run start
```

