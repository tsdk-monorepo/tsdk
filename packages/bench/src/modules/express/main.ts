import express from 'express';

const port = 3013;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`hi, from express.`);
});

const count = 2000;
let i = 0;

while (i <= count) {
  const _i = i === 0 ? '' : i;
  i++;

  app.get(`/api/user/hello${_i}`, (req, res) => {
    const result = 'hi ' + Date.now() + ' ' + Math.random();
    res.send({ result });
  });
}

app.listen(port, () => {
  console.log(`Express server running at http://localhost:${port}`);
});
