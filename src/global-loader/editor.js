import MdButton from 'vue-material/dist/components/MdButton';
import MdContent from 'vue-material/dist/components/MdContent';
import MdDialog from 'vue-material/dist/components/MdDialog';
import MdDrawer from 'vue-material/dist/components/MdDrawer';
import MdIcon from 'vue-material/dist/components/MdIcon';
import MdProgress from 'vue-material/dist/components/MdProgress';
import MdRipple from 'vue-material/dist/components/MdRipple';
import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
import MdField from 'vue-material/dist/components/MdField';
import FileContainer from 'src/components/files/FileContainer';

export default Vue => {
  Vue.use(MdButton);
  Vue.use(MdContent);
  Vue.use(MdDialog);
  Vue.use(MdDrawer);
  Vue.use(MdIcon);
  Vue.use(MdProgress);
  Vue.use(MdRipple);
  Vue.use(MdSnackbar);
  Vue.use(MdField);
  Vue.component('file-container', FileContainer);
};
