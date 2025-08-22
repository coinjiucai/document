import $cv from '@/com/constValue';
import { default as nativePlace } from '@/com/native_place';

const menuTypeList = [
  { label: '顶级菜单', value: $cv.MENU_TYPE.TOP_MENU },
  { label: '子菜单', value: $cv.MENU_TYPE.SEC_MENU },
  { label: '按钮', value: $cv.MENU_TYPE.BUTTON }
];
const dictionaryTypeList = [
  { name: '项目类型', value: $cv.DICTIONARY_TYPE.PROJECT_TYPE },
  { name: '用户类型', value: $cv.DICTIONARY_TYPE.USER_TYPE },
  { name: '借阅类型', value: $cv.DICTIONARY_TYPE.BORROW_TYPE },
  { name: '项目阶段', value: $cv.DICTIONARY_TYPE.PROJECT_STAGE },
  { name: '设备类型', value: $cv.DICTIONARY_TYPE.DEVICE_TYPE },
  { name: '档案类型', value: $cv.DICTIONARY_TYPE.DOCUMENT_TYPE },
  { name: '密级类型', value: $cv.DICTIONARY_TYPE.PWD_TYPE }
];

const projectStatusList = [// 项目状态
  {
    label: '申报',
    type: 'info',
    value: $cv.PROJECT_STATUS.REPORT
  },
  {
    label: '立项',
    type: '',
    value: $cv.PROJECT_STATUS.STAND
  },
  {
    label: '实施',
    type: 'success',
    value: $cv.PROJECT_STATUS.EXECUTE
  },
  {
    label: '验收',
    type: 'danger',
    value: $cv.PROJECT_STATUS.ACCEPT
  }
];

const layoutOptions = [// 布局类型，由三种工作台组合而成，根据不同的权限来控制不同的工作台功能 layout为默认布局
  {
    label: '项目',
    value: $cv.LAYOUT_TYPE.PROJECT,
    layout: [
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '31A9275D',
        'ctrlKey': {
          'value': 'projectSituation',
          'label': '项目情况'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '69EA34F5',
        'ctrlKey': {
          'value': 'projectMsg',
          'label': '项目信息'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 5,
        'i': 'AF7536D2',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 5,
        'w': 8,
        'h': 14,
        'i': 'A60E478F',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 19,
        'w': 8,
        'h': 17,
        'i': 'BC18FA40',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '5E63D166',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'AFDDBAE1',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      }
    ]
  },
  {
    label: '设备',
    value: $cv.LAYOUT_TYPE.DEVICE,
    layout: [
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': 'EA1BB9DF',
        'ctrlKey': {
          'value': 'deviceCount',
          'label': '设备数量分析'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '71521A18',
        'ctrlKey': {
          'value': 'deviceStatus',
          'label': '设备状态分析'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 6,
        'i': '97034138',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 6,
        'w': 8,
        'h': 14,
        'i': 'B9AFDADA',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 20,
        'w': 8,
        'h': 16,
        'i': '994B026A',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 36,
        'w': 12,
        'h': 18,
        'i': '818FAEC3',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 12,
        'y': 36,
        'w': 12,
        'h': 18,
        'i': '44080AEC',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'FE19BA5F',
        'ctrlKey': {
          'value': 'realTime',
          'label': '涉密载体实时动态'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '24658A3A',
        'ctrlKey': {
          'value': 'deviceSituation',
          'label': '涉密载体情况分析'
        },
        'moved': false
      }
    ]
  },
  {
    label: '档案',
    value: $cv.LAYOUT_TYPE.ARCHIVES,
    layout: [
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': 'C60FCA90',
        'ctrlKey': {
          'value': 'document',
          'label': '文档类型'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '66CE45BA',
        'ctrlKey': {
          'value': 'archives',
          'label': '档案总量'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 6,
        'i': 'AA95E8C5',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 6,
        'w': 8,
        'h': 13,
        'i': '43C11622',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 19,
        'w': 8,
        'h': 17,
        'i': 'BA5A13C3',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'C3465719',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'F6EFA567',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      }
    ]
  },
  {
    label: '项目和设备',
    value: $cv.LAYOUT_TYPE.PROANDDEV,
    layout: [
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': 'F5530800',
        'ctrlKey': {
          'value': 'projectSituation',
          'label': '项目情况'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '6D49641C',
        'ctrlKey': {
          'value': 'projectMsg',
          'label': '项目信息'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 6,
        'i': 'DA2D6E76',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 6,
        'w': 8,
        'h': 14,
        'i': '36A68C88',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 20,
        'w': 8,
        'h': 16,
        'i': 'B1465BC1',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '7832074B',
        'ctrlKey': {
          'value': 'realTime',
          'label': '涉密载体实时动态'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': 'D3944734',
        'ctrlKey': {
          'value': 'deviceSituation',
          'label': '涉密载体情况分析'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '02CF178F',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 54,
        'w': 8,
        'h': 18,
        'i': '7DE6195F',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '6EFFF7EA',
        'ctrlKey': {
          'value': 'deviceCount',
          'label': '设备数量分析'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '5F0F51A1',
        'ctrlKey': {
          'value': 'deviceStatus',
          'label': '设备状态分析'
        },
        'moved': false
      }
    ]
  },
  {
    label: '项目和档案',
    value: $cv.LAYOUT_TYPE.PROANDARC,
    layout: [
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 6,
        'i': 'D97C66D3',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 6,
        'w': 8,
        'h': 14,
        'i': '991DB8CE',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 20,
        'w': 8,
        'h': 16,
        'i': 'F9692F36',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': 'F91AF971',
        'ctrlKey': {
          'value': 'projectSituation',
          'label': '项目情况'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '640F56F0',
        'ctrlKey': {
          'value': 'projectMsg',
          'label': '项目信息'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '67EDD56C',
        'ctrlKey': {
          'value': 'document',
          'label': '文档类型'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '174A6CDE',
        'ctrlKey': {
          'value': 'archives',
          'label': '档案总量'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '15264A9F',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': 'D3749368',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      }
    ]
  },
  {
    label: '档案和设备',
    value: $cv.LAYOUT_TYPE.DEVANDARC,
    layout: [
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '7B262A5C',
        'ctrlKey': {
          'value': 'deviceCount',
          'label': '设备数量分析'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': 'D5C53B44',
        'ctrlKey': {
          'value': 'deviceStatus',
          'label': '设备状态分析'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 5,
        'i': '781071F7',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 5,
        'w': 8,
        'h': 14,
        'i': '53153940',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 19,
        'w': 8,
        'h': 17,
        'i': 'EFB9FDF2',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'C10D53AF',
        'ctrlKey': {
          'value': 'realTime',
          'label': '涉密载体实时动态'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '5BEE7250',
        'ctrlKey': {
          'value': 'deviceSituation',
          'label': '涉密载体情况分析'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '832D002A',
        'ctrlKey': {
          'value': 'document',
          'label': '文档类型'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '84EC5947',
        'ctrlKey': {
          'value': 'archives',
          'label': '档案总量'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '1D8D0610',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 54,
        'w': 8,
        'h': 18,
        'i': '44D4D204',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      }
    ]
  },
  {
    label: '项目和档案和设备',
    value: $cv.LAYOUT_TYPE.PROANDDEVANDARC,
    layout: [
      {
        'x': 8,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '1D91668F',
        'ctrlKey': {
          'value': 'projectMsg',
          'label': '项目信息'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 0,
        'w': 8,
        'h': 7,
        'i': 'AB2C2261',
        'ctrlKey': {
          'value': 'timeBox',
          'label': '时间'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': '6241F81A',
        'ctrlKey': {
          'value': 'deviceCount',
          'label': '设备数量分析'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 18,
        'w': 8,
        'h': 18,
        'i': 'F081C6CE',
        'ctrlKey': {
          'value': 'deviceStatus',
          'label': '设备状态分析'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 7,
        'w': 8,
        'h': 14,
        'i': 'D29E1B0F',
        'ctrlKey': {
          'value': 'shortCut',
          'label': '快捷入口'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 21,
        'w': 8,
        'h': 15,
        'i': '60DB3359',
        'ctrlKey': {
          'value': 'eventList',
          'label': '事件列表'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '82ACC107',
        'ctrlKey': {
          'value': 'realTime',
          'label': '涉密载体实时动态'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '21C1E831',
        'ctrlKey': {
          'value': 'deviceSituation',
          'label': '涉密载体情况分析'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 36,
        'w': 8,
        'h': 18,
        'i': '4BFB5C47',
        'ctrlKey': {
          'value': 'document',
          'label': '文档类型'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 54,
        'w': 8,
        'h': 18,
        'i': 'DDE37019',
        'ctrlKey': {
          'value': 'archives',
          'label': '档案总量'
        },
        'moved': false
      },
      {
        'x': 8,
        'y': 54,
        'w': 8,
        'h': 18,
        'i': '0AA03F5A',
        'ctrlKey': {
          'value': 'notice',
          'label': '通知公告'
        },
        'moved': false
      },
      {
        'x': 16,
        'y': 54,
        'w': 8,
        'h': 18,
        'i': 'CCD13A37',
        'ctrlKey': {
          'value': 'rules',
          'label': '政策法规'
        },
        'moved': false
      },
      {
        'x': 0,
        'y': 0,
        'w': 8,
        'h': 18,
        'i': '97C3146A',
        'ctrlKey': {
          'value': 'projectSituation',
          'label': '项目情况'
        },
        'moved': false
      }
    ]
  }
];

const difficultyList = [
  {label:'简单',value:1},
  {label:'普通',value:2},
  {label:'困难',value:3},
]

const questionTypeList = [
  {label:'单选题',value:1},
  {label:'多选题',value:2},
  {label:'判断题',value:3},
  {label:'填空题',value:4},
  {label:'问答题',value:5},
]

const rightWrong = [
  {
    label: '正确',
    value: 0,
  },
  {
    label: '错误',
    value: 1
  }
]

const courseDifficulty = [
  {label:'低级',value:1},
  {label:'中级',value:2},
  {label:'高级',value:3},
]

const courseStatus = [
  {label:'未开始',value:0},
  {label:'进行中',value:1},
  {label:'已结束',value:2},
]

const numberWord = ['一', '二', '三', '四', '五']

export {
  menuTypeList,
  dictionaryTypeList,
  nativePlace,
  projectStatusList,
  layoutOptions,
  difficultyList,
  questionTypeList,
  rightWrong,
  courseDifficulty,
  courseStatus,
  numberWord,
};
