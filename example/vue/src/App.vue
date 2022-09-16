<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Editor from 'plain-text-editor';

const textarea = ref<HTMLTextAreaElement>();

let editor: Editor;

const insertUl = () => {
  if (editor) {
    editor.insertUl();
  }
};

const insertOl = () => {
  if (editor) {
    editor.insertOl();
  }
};

const destory = () => {
  editor.destory();
};

onMounted(() => {
  editor = new Editor({
    input: textarea.value as HTMLTextAreaElement,
  });
});
</script>

<template>
  <div class="toolbar">
    <button @click="insertUl">无序列表</button>
    <button @click="insertOl">有序列表</button>
    <button @click="destory">销毁</button>
  </div>
  <textarea ref="textarea" cols="30" rows="10" placeholder="write something..." />
</template>

<style>
body {
  padding-top: 100px;
  display: flex;
  justify-content: center;
}
.toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
.toolbar button {
  margin-right: 15px;
}

textarea {
  width: 500px;
  height: 250px;
  border-radius: 6px;
  outline: none;
  padding: 10px;
  font-size: 16px;
}
</style>
