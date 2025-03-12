import ExampleWorker from './worker?worker';

const first = { value: 1 };
const second = { value: 2 };

if (typeof document !== 'undefined') {
  const myWorker = new ExampleWorker();

  [first, second].forEach(() => {
    myWorker.postMessage([first.value, second.value]);
  });

  myWorker.onmessage = (e) => {
    console.log('use-worker onmessage:', e.data);
    console.log('Message received from worker');
  };
}
