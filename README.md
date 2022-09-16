# plain-text-editor
A plain text editor (based on textarea)

## install
```shell
npm install plain-text-editor #npm
yarn add plain-text-editor #yarn
pnpm add plain-text-editor #pnpm
```

## usage

```js
import Editor from 'plain-text-editor';

const editor = new Editor({
  input: document.getElementById('textarea'),
});

// Insert Bulletlist
editor.insertUl();

// Insert OrderedList
editor.insertOl();

// Destory(clear all events)
editor.destory();
```
### options

```ts
interface Options {
  input: HTMLTextAreaElement;
  content?: string;
  point?: string;
}
```