import Vue from 'vue';

import {
  List,
  Image as VanImage
} from 'vant';


[
  List,
  VanImage
].forEach((el) => Vue.use(el));