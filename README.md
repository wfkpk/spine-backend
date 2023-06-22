<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

  <p align="center">Application-<a href="http://wfkpk.vercel.app" target="_blank">Spines</a> Backend for tracking books </p>
    <p align="center">
      

# Description

I wanted to keep track of my books and there not any books tracker with good ui and i build this backend.Now I am sending Books Json data to server and then changing status from want-to-read to read and searching books with my localhosted instance of meilisearch instance lol.
```c
feature list:-
0.-authentication
1.-add books in the 3 main list
2.-search with meilisearch
3.-update everthing
4.-add more from outside to database books
5.-add multiple notes to single book PRIVATE
6.-add multiple comment on thesingle book
```

I am using postgresql database and will do rate limiting with redis and firebase for authentication.
Now Spine is opensource enjoy the backend codebase you might learn while reviwing the code.

`feel free add PR and issues if you find any`

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Stay in touch

- Author - [](https://wfkpk.vercel.app)
- Website - not ready yet
- Twitter - [@wfkpk](https://twitter.com/wfkpk)

## License

Nest is [MIT licensed](LICENSE).
