<template>
  <div ref="editor" class="div-input">
    {{content}}
  </div>
</template>

<script>
import MediumEditor from 'medium-editor';

export default {
  name: 'medium-editor',
  data() {
    return {
      internalContent: this.content,
    };
  },
  props: {
    content: {
        // eslint-disable-next-line quote-props
      'default': () => (''),
    },
  },
  watch: {
    content() {
      if (this.content !== this.internalContent) {
        this.internalContent = this.content;
        this.editor.setContent(this.internalContent, 0);
      }
    },
  },
  mounted() {
    const editorToDataSync = (data, editable) => {
      this.internalContent = editable.innerText.trim();
      this.$emit('content', this.internalContent);
    };

    this.editor = new MediumEditor(this.$el, {
      disableReturn: true,
      placeholder: false,
      spellcheck: false,
      toolbar: false,
      mode: MediumEditor.inlineMode,
    });
    this.editor.subscribe('editableInput', editorToDataSync);
    setTimeout(() => {
      // editor.setContent('teste', 0);
    }, 5000);
  },
};
</script>
