<template>
  <div ref="editor" class="div-input">
    {{content}}
  </div>
</template>

<script>
import MediumEditor from 'medium-editor';

export default {
  name: 'medium-editor',
  props: {
    content: {
        // eslint-disable-next-line quote-props
      'default': () => (''),
    },
  },
  mounted() {
    const editorToDataSync = (data, editable) => {
      this.$emit('content', editable.innerText.trim());
    };

    this.editor = new MediumEditor(this.$el, {
      disableReturn: true,
      placeholder: '',
      toolbar: false,
      mode: MediumEditor.inlineMode,
    });
    this.editor.subscribe('editableInput', editorToDataSync);
  },
};
</script>
