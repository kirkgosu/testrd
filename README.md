# TEST reigndesign

### Repo

```sh
git clone https://github.com/kirkgosu/testrd.git
```

### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd testrd
$ npm install
```

Enviroment Vars...

```sh
$ MDB_CONNECT=mongodb://feeds:feed123@ds129374.mlab.com:29374/testrd
$ API_URL=https://hn.algolia.com/api/v1/search_by_date?query=nodejs
```

### Test
```sh
npm start
http://localhost:3000/
```

