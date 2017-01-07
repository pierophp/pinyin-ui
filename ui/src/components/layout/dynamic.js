const Loading = {
  template: '<div></div>',
};

export default {
  functional: true,
  props: {
    options: Object,
  },
  render(h, context) {
    const options = context.props.options;
    if (!options) {
      return h(Loading);
    }
    const dynComponent = {
      template: options.template,
      methods: options.methods,
    };

    return h(dynComponent);
  },
};
