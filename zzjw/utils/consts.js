export default {
  businessTypeObj: {
    achievement: 1,//课题
    topic: 2,//成果
    all: 3,//课题与成果
  },
  // 角色类型
  businessType: [
    { value: 1, label: '课题', color: '#3d8cde' },
    { value: 2, label: '成果', color: '#f4bf4f' },
    { value: 3, label: '课题与成果', color: '#61c554' }
  ],
  // 课题项目类型
  typeList: [
    { value: 1, label: '国家级、教育部级' },
    { value: 2, label: '国家级' },
    { value: 3, label: '教育部级' },
    { value: 4, label: '军队重点' },
    { value: 5, label: '军队专项' },
  ],
  // 入库状态
  storeStatus: [
    { value: 0, label: '未添加', color: '#999999' },
    { value: 1, label: '待添加', color: '#f4bf4f' },
    { value: 2, label: '添加中', color: '#3d8cde' },
    { value: 3, label: '添加成功', color: '#61c554' },
    { value: 4, label: '添加失败', color: '#ed6b5f' },
  ],
  // 审批结果
  approvalResult: [
    { value: 1, label: '同意' },
    { value: 2, label: '驳回' },
  ],
  // 项目类型
  projectType: [
    { value: 1, label: '成果' },
    { value: 2, label: '课题' },
  ],
  // 成果内容类型
  tContentType: [
    { value: 1, label: '教学模式与方法改革' },
    { value: 2, label: '人才培养模式改革' },
    { value: 3, label: '课程与教学内容改革' },
    { value: 4, label: '教学力量建设' },
    { value: 5, label: '教学保障' },
    { value: 6, label: '教学管理' },
    { value: 7, label: '其他' },
  ],
  // 课题内容类型
  aContentType: [
    { value: 1, label: '国家级' },
    { value: 2, label: '教育部级' },
    { value: 3, label: '军队重点' },
    { value: 4, label: '军队专项' }
  ],
  // 成果级别
  tLevel: [
    { value: 1, label: '军队级一等奖' },
    { value: 2, label: '军队级二等奖' },
    { value: 3, label: '军队级三等奖' },
    { value: 4, label: '校一等奖' },
    { value: 5, label: '校二等奖' }
  ],
  // 课题级别
  aLevel: [
    { value: 1, label: '国家级' },
    { value: 2, label: '教育部级' },
    { value: 3, label: '军队重点' },
    { value: 4, label: '军队专项' },
    { value: 5, label: '一般' }
  ],
}