# tsdk-boilerplate (warning: STILL WORKING!)

Boilerplate code generateor for `tsdk`.

```bash
# npx tsdk --gen plugin=tsdk-boilerplate entity=Todo CRUD=true tests=true category=false user=false
npx tsdk --gen entity=Todo

# npx tsdk --gen entity=Todo category=true
# npx tsdk --gen entity=Todo user=true

# npx tsdk --gen needAuth-tests=true

# npx tsdk --gen swr=true
# npx tsdk --gen react-query=true

```

## Features

- [ ] CRUD APIs generate with tests base on `entity`;
- [ ] Common APIs generate;
- [ ] NeedAuth APIs check tests code generate;
- [ ] SWR hooks generate plugin;
- [ ] Custom your own plugin!
