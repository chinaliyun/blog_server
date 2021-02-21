import FixedDialog from './src/FixedDialog';

/* istanbul ignore next */
FixedDialog.install = function(Vue) {
  Vue.component(FixedDialog.name, FixedDialog);
};

export default FixedDialog;
