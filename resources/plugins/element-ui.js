import Vue from "vue";
import {
  Scrollbar,
  InfiniteScroll,
  Menu,
  Submenu,
  MenuItem,
  // MenuItemGroup,
  // Table,
  // TableColumn,
  // Pagination,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  OptionGroup,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Button,
  // Checkbox,
  // CheckboxGroup,
  // Radio,
  // RadioGroup,
  // Switch,
  // Tree,
  // Popover,
  MessageBox,
  Message,
  Loading,
  Row,
  Col,
  // Dialog,
  // Progress,
  // Breadcrumb,
  // BreadcrumbItem,
  // Tag
  // Tabs,
  // TabPane
  Drawer,
  Image
} from "element-ui";
import CollapseTransition from "element-ui/lib/transitions/collapse-transition";

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Button);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Row);
Vue.use(Col);
Vue.use(Drawer);
Vue.use(Image);
Vue.use(Scrollbar);
Vue.use(InfiniteScroll);
Vue.use(Loading.directive);
Vue.component(CollapseTransition.name, CollapseTransition);

// 重写Message的属性，让调用时居中
["success", "warning", "info", "error"].forEach((type) => {
  Message[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    options.center = true;
    // options.duration = 0; // 不让消失，调样式用
    return Message(options);
  };
});
Object.assign(Vue.prototype, {
  $ELEMENT: { zIndex: 990 }, // size: "small",
  $message: Message,
  $messageBox: MessageBox,
  $confirm: MessageBox.confirm,
  $alert: MessageBox.alert,
  $prompt: MessageBox.prompt,
  $loading: Loading,
});
