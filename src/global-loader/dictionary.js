import MdButton from 'vue-material/dist/components/MdButton';
import MdDialog from 'vue-material/dist/components/MdDialog';
import MdDrawer from 'vue-material/dist/components/MdDrawer';
import MdIcon from 'vue-material/dist/components/MdIcon';
import MdProgress from 'vue-material/dist/components/MdProgress';
import MdSnackbar from 'vue-material/dist/components/MdSnackbar';
import FileContainer from 'src/components/files/FileContainer';

export default Vue => {
  Vue.use(MdButton);
  Vue.use(MdDialog);
  Vue.use(MdDrawer);
  Vue.use(MdIcon);
  Vue.use(MdProgress);
  Vue.use(MdSnackbar);
  Vue.component('file-container', FileContainer);
};
