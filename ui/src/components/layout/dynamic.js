const Loading = {
  template: '<div></div>',
};

export default {
  functional: true,
  props: {
    template: String,
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  render(h, context) {
    const template = context.props.template;
    const dynComponent = {
      template,
      data() {
        return context.props.data;
      },
    };
    const component = template ? dynComponent : Loading;
    return h(component);
  },
};
